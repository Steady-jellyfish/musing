import sys
import os

# 상위 디렉토리를 path에 추가 (상대 import 문제 해결)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.note_service import NoteService


def print_separator():
    print("\n" + "="*60 + "\n")


def main():
    # DB 초기화
    print("🔧 데이터베이스 초기화 중...")
    # drop_all=True로 설정하면 JPA create-drop처럼 테이블 삭제 후 재생성
    init_db(drop_all=False)  # 개발 중에는 True, 운영에서는 False
    print("✅ 초기화 완료\n")

    db: Session = SessionLocal()
    service = NoteService(db)

    try:
        print("📝 Note Organizer - 콘솔 버전")
        print_separator()

        # 노트 입력
        print("노트를 입력하세요 (여러 줄 입력 가능, 입력 완료 후 빈 줄에서 Enter):")
        lines = []
        while True:
            line = input()
            if line == "":
                break
            lines.append(line)

        text = "\n".join(lines)

        if not text.strip():
            print("❌ 입력된 내용이 없습니다.")
            return

        print_separator()

        # 노트 분석
        result = service.create_note(text)

        print_separator()
        print("📊 분석 결과:")
        print(f"\n노트 ID: {result['note_id']}")
        print(f"세션 ID: {result['session_id']}")

        # 제목
        print(f"\n📌 제목: {result['title']}")

        # 유사 노트 출력
        if result.get('similar_notes'):
            print("\n🔍 유사한 기존 노트 발견:")
            for idx, similar in enumerate(result['similar_notes'], 1):
                print(f"  {idx}. [{similar['title']}] (카테고리: {similar['category']}, 유사도: {similar['score']:.2f})")
                print(f"     사유: {similar['reason']}")
        else:
            print("\n🔍 유사한 기존 노트 없음")

        # 카테고리 후보
        print("\n🏷️  카테고리 후보:")
        for idx, suggestion in enumerate(result['category_suggestions'], 1):
            marker = "🆕" if suggestion['is_new'] else "📁"
            score = f"(유사도: {suggestion['score']:.2f})" if not suggestion['is_new'] else "(신규)"
            print(f"  {idx}. {marker} {suggestion['name']} {score}")

        # 태그
        print(f"\n🏷️  추천 태그: {', '.join(result['suggested_tags'])}")

        # 정제된 글
        print("\n📄 정제된 본문:")
        print("-" * 60)
        print(result['refined_text'])
        print("-" * 60)

        # 이어쓰기 또는 새 노트 선택
        print_separator()
        merge_choice = None
        if result.get('similar_notes'):
            print("📝 노트 저장 방식을 선택하세요:")
            print("  0. 새 노트로 저장")
            for idx, similar in enumerate(result['similar_notes'], 1):
                print(f"  {idx}. 기존 노트에 병합: [{similar['title']}] (유사도: {similar['score']:.2f})")

            merge_choice = int(input("\n번호 입력: "))

            if merge_choice > 0:
                # 기존 노트에 병합
                selected_note = result['similar_notes'][merge_choice - 1]
                merge_result = service.merge_to_existing_note(result['note_id'], selected_note['id'])

                print_separator()
                print("✅ 기존 노트에 병합 완료!")
                print(f"\n노트 ID: {merge_result['note_id']}")
                print(f"제목: {merge_result['title']}")
                print(f"버전: {merge_result['version']}")
                print(f"카테고리: {merge_result['category']}")
                print(f"태그: {', '.join(merge_result['tags'])}")
                print("\n📄 병합된 본문:")
                print("-" * 60)
                print(merge_result['refined_text'])
                print("-" * 60)
                return  # 병합 완료 후 종료

        # 새 노트로 저장 선택 시 기존 플로우 진행
        print_separator()
        print("카테고리를 선택하세요:")
        print("  0. 직접 입력")
        for idx, suggestion in enumerate(result['category_suggestions'], 1):
            marker = "🆕" if suggestion['is_new'] else "📁"
            score = f"(유사도: {suggestion['score']:.2f})" if not suggestion['is_new'] else "(신규)"
            print(f"  {idx}. {marker} {suggestion['name']} {score}")

        choice = int(input("\n번호 입력: "))

        if choice == 0:
            # 직접 입력
            category_path = input("카테고리를 입력하세요 (슬래시로 구분, 예: 개발/백엔드/API): ").strip()
            selection_category = {
                'category_id': None,
                'new_category_path': category_path
            }
        else:
            # 추천 목록에서 선택
            selected = result['category_suggestions'][choice - 1]
            selection_category = {
                'category_id': selected['id'] if not selected['is_new'] else None,
                'new_category_path': selected['name'] if selected['is_new'] else None
            }

        # 태그 선택
        print(f"\n추천 태그:")
        for idx, tag in enumerate(result['suggested_tags'], 1):
            print(f"  {idx}. {tag}")

        print(f"\n선택할 태그 번호 (쉼표로 구분, 전체 선택은 Enter): ", end='')
        tag_selection = input().strip()

        selected_tags = []
        if tag_selection:
            # 번호로 선택
            indices = [int(i.strip()) - 1 for i in tag_selection.split(',')]
            selected_tags = [result['suggested_tags'][i] for i in indices if 0 <= i < len(result['suggested_tags'])]
        else:
            # 전체 선택
            selected_tags = result['suggested_tags']

        print(f"추가할 태그 (쉼표로 구분, 없으면 Enter): ", end='')
        additional_tags_input = input().strip()
        if additional_tags_input:
            additional_tags = [t.strip() for t in additional_tags_input.split(',')]
            selected_tags.extend(additional_tags)

        # 최종 저장
        selection = {
            **selection_category,
            'tags': selected_tags
        }

        final_result = service.select_category(result['note_id'], selection)

        print_separator()
        print("✅ 저장 완료!")
        print(f"\n카테고리: {final_result['category']}")
        print(f"태그: {', '.join(final_result['tags'])}")

    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    main()
