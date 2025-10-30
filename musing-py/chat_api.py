import json
from openai import OpenAI
from typing import Dict, Any, Optional

from config.logging_config import setup_logger

logger = setup_logger(__name__)


class ResponseFormat:
    """응답 형식 상수 클래스"""

    JSON = {"type": "json_object"}
    TEXT = {"type": "text"}


class ChatGPT:
    """
    OpenAI API를 사용하여 GPT 모델과 대화하는 유틸리티 클래스
    (API 키가 상수로 설정되어 바로 사용 가능)
    """

    # API 키 상수 설정 - 실제 키로 변경해주세요
    API_KEY = "API_KEY"

    # 클라이언트 초기화 (클래스 변수로 미리 생성)
    client = OpenAI(api_key=API_KEY)

    @classmethod
    def chat(
        cls,
        system_content: str,
        user_content: str,
        temperature: float = 0.3,
        max_tokens: int = 100,
        response_format: Optional[Dict[str, str]] = None,
        model: str = "gpt-4o-mini",
    ) -> Dict[str, Any]:
        """
        ChatGPT API를 사용하여 응답을 생성합니다. (정적 메소드)

        Args:
            system_content (str): 시스템 역할의 내용
            user_content (str): 사용자 역할의 내용
            temperature (float): 응답의 창의성 수준 (0.0 ~ 2.0)
            max_tokens (int): 최대 토큰 수
            response_format: OpenAI 응답 형식 지정
                - {"type": "json_object"}: JSON 형식 응답 요청
                    -> 반드시 system_content와 user_content에 json이라는 단어가 포함되어 있어야 함
                - {"type": "text"}: 텍스트 형식 응답 요청 (기본값)
            model (str): 사용할 모델 이름

        Returns:
            dict: API 응답에서 추출한 결과
        """
        try:
            # API 요청 메시지 구성
            messages = [
                {"role": "system", "content": system_content},
                {"role": "user", "content": user_content},
            ]

            # API 호출 파라미터 설정
            params = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }

            # response_format이 제공된 경우 파라미터에 추가
            if response_format:
                params["response_format"] = response_format

            # API 호출
            response = cls.client.chat.completions.create(**params)

            # JSON 응답일 경우 파싱
            if response_format and response_format.get("type") == "json_object":
                result = json.loads(response.choices[0].message.content)
            else:
                # 일반 텍스트 응답
                result = {"text": response.choices[0].message.content}

            return result

        except Exception as e:
            logger.error(f"GPT API 호출 중 오류 발생: {e}")
            return {"error": str(e)}