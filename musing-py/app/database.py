from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """데이터베이스 세션 제공"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(drop_all=False):
    """
    데이터베이스 초기화 (테이블 생성)

    Args:
        drop_all (bool): True면 기존 테이블 삭제 후 재생성 (JPA create-drop과 동일)
    """
    if drop_all:
        print("⚠️  기존 테이블 삭제 중...")
        Base.metadata.drop_all(bind=engine)
        print("✅ 삭제 완료")

    Base.metadata.create_all(bind=engine)
