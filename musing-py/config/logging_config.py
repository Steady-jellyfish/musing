import logging
import sys


def setup_logger(name: str) -> logging.Logger:
    """
    로거 설정 함수

    Args:
        name (str): 로거 이름 (일반적으로 __name__)

    Returns:
        logging.Logger: 설정된 로거 객체
    """
    logger = logging.getLogger(name)

    # 이미 핸들러가 설정되어 있다면 중복 설정 방지
    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)

    # 콘솔 핸들러 설정
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)

    # 포맷 설정
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(formatter)

    logger.addHandler(console_handler)

    return logger
