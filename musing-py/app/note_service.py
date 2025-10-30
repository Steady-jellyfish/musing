from sqlalchemy.orm import Session
from typing import List, Dict
from .models import Note, Category, Tag, CategorySuggestion, note_tags
from .llm_service import LLMService
import uuid


class NoteService:
    def __init__(self, db: Session):
        self.db = db
        self.llm = LLMService()

    def create_note(self, text: str) -> Dict:
        """새 노트 생성 및 분석"""

        # 1. 세션 ID 생성
        session_id = str(uuid.uuid4())

        # 2. DB에 원본 저장
        note = Note(
            session_id=session_id,
            original_text=text
        )
        self.db.add(note)
        self.db.commit()
        self.db.refresh(note)

        print(f"✅ 노트 저장 완료 (ID: {note.id})")

        # 3. 유사 노트 검색
        print("🔍 유사 노트 검색 중...")
        existing_notes = self.db.query(Note).filter(Note.is_merged == False).all()
        existing_notes_data = [
            {
                'id': n.id,
                'title': n.title or '제목 없음',
                'content': n.refined_text or n.original_text
            }
            for n in existing_notes if n.id != note.id
        ]

        similar_notes = []
        if existing_notes_data:
            similar_results = self.llm.find_similar_notes(text, existing_notes_data)
            for result in similar_results:
                found_note = self.db.query(Note).filter_by(id=result['note_id']).first()
                if found_note:
                    similar_notes.append({
                        'id': found_note.id,
                        'title': found_note.title,
                        'category': found_note.category.full_path if found_note.category else '없음',
                        'score': result['score'],
                        'reason': result['reason']
                    })

        # 4. 기존 카테고리 조회 (full_path 사용)
        existing_categories = self.db.query(Category.full_path).all()
        category_paths = [c.full_path for c in existing_categories]

        print(f"📂 기존 카테고리: {category_paths if category_paths else '없음'}")
        print("🤖 LLM 분석 중...")

        # 5. LLM 분석
        analysis = self.llm.analyze_note(text, category_paths)

        # 5. 카테고리 후보 저장
        suggestions = []

        for match in analysis.get('category_matches', []):
            category = self.db.query(Category).filter_by(full_path=match['name']).first()
            if category:
                suggestion = CategorySuggestion(
                    note_id=note.id,
                    category_id=category.id,
                    similarity_score=match['score'],
                    is_new=False
                )
                self.db.add(suggestion)
                suggestions.append({
                    'id': category.id,
                    'name': category.full_path,
                    'score': match['score'],
                    'is_new': False
                })

        # 신규 카테고리 제안
        if analysis.get('new_category_suggestion'):
            suggestion = CategorySuggestion(
                note_id=note.id,
                category_name=analysis['new_category_suggestion'],
                similarity_score=0.0,
                is_new=True
            )
            self.db.add(suggestion)
            suggestions.append({
                'id': None,
                'name': analysis['new_category_suggestion'],
                'score': 0.0,
                'is_new': True
            })

        # 6. title과 refined_text 저장
        note.title = analysis.get('title', '')
        note.refined_text = analysis['refined_text']
        self.db.commit()

        return {
            'note_id': note.id,
            'session_id': session_id,
            'title': note.title,
            'category_suggestions': suggestions,
            'suggested_tags': analysis['tags'],
            'refined_text': analysis['refined_text'],
            'similar_notes': similar_notes  # 유사 노트 정보 추가
        }

    def _create_category_hierarchy(self, full_path: str) -> Category:
        """3레벨 카테고리 계층 생성 (예: "개발/백엔드/API" → 3개 카테고리 생성)"""
        parts = full_path.split('/')
        parent = None

        for i, part in enumerate(parts):
            level = i + 1
            current_path = '/'.join(parts[:level])

            # 이미 존재하는지 확인
            category = self.db.query(Category).filter_by(full_path=current_path).first()

            if not category:
                # 새로 생성
                category = Category(
                    name=part.strip(),
                    full_path=current_path,
                    parent_id=parent.id if parent else None,
                    level=level
                )
                self.db.add(category)
                self.db.flush()

            parent = category

        return parent  # 마지막 레벨 카테고리 반환

    def select_category(self, note_id: int, selection: Dict):
        """카테고리 선택 및 태그 저장"""

        note = self.db.query(Note).filter_by(id=note_id).first()
        if not note:
            raise ValueError(f"노트 ID {note_id}를 찾을 수 없음")

        # 카테고리 처리
        if selection.get('category_id'):
            # 기존 카테고리 선택
            note.category_id = selection['category_id']
        elif selection.get('new_category_path'):
            # 신규 카테고리 생성 (3레벨 계층 구조)
            category = self._create_category_hierarchy(selection['new_category_path'])
            note.category_id = category.id

        # 태그 처리
        if selection.get('tags'):
            for tag_name in selection['tags']:
                tag = self.db.query(Tag).filter_by(name=tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    self.db.add(tag)
                    self.db.flush()

                if tag not in note.tags:
                    note.tags.append(tag)

        self.db.commit()

        return {
            'note_id': note.id,
            'category': note.category.full_path if note.category else None,
            'tags': [tag.name for tag in note.tags]
        }

    def merge_to_existing_note(self, new_note_id: int, target_note_id: int) -> Dict:
        """기존 노트에 새 노트를 병합

        Args:
            new_note_id: 새로 작성한 노트 ID
            target_note_id: 병합할 대상 노트 ID

        Returns:
            병합된 노트 정보
        """
        new_note = self.db.query(Note).filter_by(id=new_note_id).first()
        target_note = self.db.query(Note).filter_by(id=target_note_id).first()

        if not new_note or not target_note:
            raise ValueError("노트를 찾을 수 없음")

        print(f"🔄 노트 병합 중... (ID: {target_note_id})")

        # LLM으로 병합 및 재정제
        merged_text = self.llm.merge_notes(
            existing_refined_text=target_note.refined_text,
            existing_created_at=target_note.created_at.strftime('%Y-%m-%d'),
            new_text=new_note.original_text
        )

        # 기존 노트 업데이트
        target_note.original_text += f"\n\n--- 추가 ({new_note.created_at.strftime('%Y-%m-%d')}) ---\n{new_note.original_text}"
        target_note.refined_text = merged_text
        target_note.version += 1

        # 새 노트의 태그를 기존 노트에 병합
        for tag in new_note.tags:
            if tag not in target_note.tags:
                target_note.tags.append(tag)

        # 새 노트를 병합됨으로 표시
        new_note.is_merged = True
        new_note.parent_note_id = target_note_id

        self.db.commit()

        print(f"✅ 병합 완료! (버전: {target_note.version})")

        return {
            'note_id': target_note.id,
            'title': target_note.title,
            'version': target_note.version,
            'category': target_note.category.full_path if target_note.category else None,
            'tags': [tag.name for tag in target_note.tags],
            'refined_text': target_note.refined_text
        }
