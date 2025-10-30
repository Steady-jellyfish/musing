import json
from typing import List, Dict
import sys
import os

# chat_api.py를 import하기 위해 상위 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from chat_api import ChatGPT, ResponseFormat


class LLMService:
    @staticmethod
    def find_similar_notes(text: str, existing_notes: List[Dict]) -> List[Dict]:
        """새 노트와 유사한 기존 노트 찾기

        Args:
            text: 새로 입력한 노트 텍스트
            existing_notes: 기존 노트 리스트 [{"id": 1, "title": "...", "content": "..."}]

        Returns:
            유사도 순으로 정렬된 노트 리스트 (최대 3개)
        """
        if not existing_notes:
            return []

        notes_info = "\n\n".join([
            f"[노트 ID: {note['id']}]\n제목: {note['title']}\n내용: {note['content'][:200]}..."
            for note in existing_notes
        ])

        system_content = "너는 노트 유사도 분석 전문가야. 항상 JSON 포맷으로만 응답해."

        user_content = f"""
새로 입력된 노트와 가장 유사한 기존 노트를 찾아줘.

새 노트:
{text}

기존 노트 목록:
{notes_info}

작업:
1. 새 노트와 주제/내용이 유사한 노트를 최대 3개 선택
2. 각 노트별 유사도 점수 (0~1) 계산
3. 유사도 0.3 이상인 것만 반환

반드시 아래 JSON 포맷으로만 반환:
{{
  "similar_notes": [
    {{"note_id": 1, "score": 0.85, "reason": "유사한 이유 간단히"}},
    {{"note_id": 2, "score": 0.72, "reason": "유사한 이유 간단히"}}
  ]
}}
"""

        try:
            result = ChatGPT.chat(
                system_content=system_content,
                user_content=user_content,
                temperature=0.3,
                max_tokens=1000,
                response_format=ResponseFormat.JSON,
                model="gpt-4o-mini"
            )

            if "error" in result:
                raise Exception(f"LLM API 오류: {result['error']}")

            return result.get('similar_notes', [])

        except Exception as e:
            print(f"❌ 유사 노트 검색 실패: {e}")
            return []

    @staticmethod
    def analyze_note(text: str, existing_categories: List[str]) -> Dict:
        """노트 분석 및 정제"""

        categories_str = ', '.join(existing_categories) if existing_categories else "없음"

        system_content = "너는 노트 정리 전문가야. 항상 JSON 포맷으로만 응답해."

        user_content = f"""
다음 노트를 분석해줘:

원문:
{text}

기존 카테고리 목록: {categories_str}

작업:
1. 원문에서 핵심 제목 추출 (명사형, 20자 이내)
   - **반드시 명사형으로 작성** (예: "리눅스 검색 방법", "회원사 관리 메뉴")
   - **금지**: "~을 설명함", "~하는 방법", "~에 대해" 등 서술형
2. 기존 카테고리 중 가장 유사한 것 최대 3개 선택 (유사도 0~1 점수 포함)
   - 카테고리는 3레벨 계층 구조임 (예: "개발/백엔드/API", "업무/관리/회원사")
3. 적합한 기존 카테고리가 없으면 새 카테고리 1개 제안 (3레벨 형태로, 예: "업무/도하/메뉴관리")
4. 내용을 잘 표현하는 태그 3~5개 추천
5. 글 정제 (간결한 명사형/체언 종결 + 마크다운 문법):
   - **종결어미 규칙:**
     * 설명/개요: 체언 종결 (예: "파일 편집 및 조회 명령어")
     * 목록 항목: 명사형 또는 간결한 서술 (예: "파일 열기", "검색 기능")
     * 절대 금지: "~함", "~소개함", "~열음", "~합니다"
   - 구어체, 이모티콘, 불필요한 수사 완전 제거
   - 맞춤법/문법 교정
   - 핵심 정보만 간결하게 정리
   - **마크다운 문법 적극 활용**

**정제 예시:**
원문:
리눅스 명령어
vi <파일명> 하면 파일을 편집기로 열 수 있음
cat <파일명> 하면 파일을 조회용으로 열 수 있음

제목: 리눅스 파일 명령어

정제된 본문:
## 개요
리눅스에서 파일 편집 및 조회를 위한 기본 명령어

## 주요 명령어
- `vi <파일명>`: 파일 편집기 실행
- `cat <파일명>`: 파일 내용 조회

반드시 아래 JSON 포맷으로만 반환:
{{
  "title": "회원사 관리 메뉴 추가",
  "category_matches": [
    {{"name": "개발/백엔드/API", "score": 0.95}}
  ],
  "new_category_suggestion": "업무/도하/메뉴관리" 또는 null,
  "tags": ["태그1", "태그2", "태그3"],
  "refined_text": "정제된 본문 (제목 제외, 본문만)"
}}
"""

        try:
            # ChatGPT API 호출 (동기 방식)
            result = ChatGPT.chat(
                system_content=system_content,
                user_content=user_content,
                temperature=0.3,
                max_tokens=2000,
                response_format=ResponseFormat.JSON,
                model="gpt-4o-mini"
            )

            # 에러 체크
            if "error" in result:
                raise Exception(f"LLM API 오류: {result['error']}")

            return result

        except json.JSONDecodeError as e:
            print(f"❌ LLM 응답 파싱 실패: {e}")
            raise
        except Exception as e:
            print(f"❌ LLM 호출 실패: {e}")
            raise

    @staticmethod
    def merge_notes(existing_refined_text: str, existing_created_at: str, new_text: str) -> str:
        """기존 노트와 새 노트를 병합하여 재정제

        Args:
            existing_refined_text: 기존 정제된 텍스트
            existing_created_at: 기존 노트 작성일 (섹션 구분용)
            new_text: 새로 입력한 원본 텍스트

        Returns:
            병합 및 재정제된 텍스트 (섹션별로 구분)
        """
        system_content = "너는 노트 병합 및 정리 전문가야. 항상 JSON 포맷으로만 응답해."

        user_content = f"""
기존 노트에 새로운 내용을 추가하여 하나의 통합된 문서로 재정제해줘.

기존 정제된 내용:
{existing_refined_text}

새로 추가할 내용:
{new_text}

작업:
1. **날짜별 섹션 구분 금지** - 단일 문서로 통합
2. 기존 내용과 새 내용을 **주제별로 재구성**
3. 중복되는 내용은 통합하여 정리
4. 관련 있는 내용끼리 묶어서 마크다운 섹션(##)으로 구조화
5. **종결어미 규칙:**
   - 설명/개요: 체언 종결 (예: "파일 편집 및 조회 명령어")
   - 목록 항목: 명사형 (예: "파일 열기", "검색 기능")
   - 절대 금지: "~함", "~소개함", "~열음", "~위한"
6. 전체적으로 깔끔하고 읽기 좋게 재작성

**통합 예시:**
기존: "vi 명령어로 파일을 연다"
추가: "vi에서 검색은 :/로 한다"
→ 통합:
## vi 편집기
- `vi <파일명>`: 파일 편집기 실행
- `:/`: 검색
- `n`/`shift+n`: 다음/이전 검색 결과

반드시 아래 JSON 포맷으로만 반환:
{{
  "merged_text": "주제별로 통합 정제된 전체 본문"
}}
"""

        try:
            result = ChatGPT.chat(
                system_content=system_content,
                user_content=user_content,
                temperature=0.3,
                max_tokens=3000,
                response_format=ResponseFormat.JSON,
                model="gpt-4o-mini"
            )

            if "error" in result:
                raise Exception(f"LLM API 오류: {result['error']}")

            return result.get('merged_text', '')

        except Exception as e:
            print(f"❌ 노트 병합 실패: {e}")
            raise
