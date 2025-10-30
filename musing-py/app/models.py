from sqlalchemy import Column, Integer, String, Text, Float, Boolean, TIMESTAMP, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# 노트-태그 다대다 관계
note_tags = Table(
    'note_tags',
    Base.metadata,
    Column('note_id', Integer, ForeignKey('notes.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)


class Note(Base):
    __tablename__ = 'notes'

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), nullable=False, index=True)
    title = Column(String(200))
    original_text = Column(Text, nullable=False)
    refined_text = Column(Text)
    category_id = Column(Integer, ForeignKey('categories.id'))
    parent_note_id = Column(Integer, ForeignKey('notes.id'), nullable=True)  # 이어쓰기 시 원본 노트 ID
    is_merged = Column(Boolean, default=False)  # 다른 노트에 병합되었는지 여부
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    version = Column(Integer, default=1)

    category = relationship("Category", back_populates="notes")
    tags = relationship("Tag", secondary=note_tags, back_populates="notes")
    suggestions = relationship("CategorySuggestion", back_populates="note", cascade="all, delete-orphan")
    children = relationship("Note", backref="parent", remote_side=[id])  # 이어쓰기 이력


class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)  # 단일 레벨 이름 (예: "API개발")
    full_path = Column(String(300), unique=True, nullable=False)  # 전체 경로 (예: "개발/백엔드/API개발")
    parent_id = Column(Integer, ForeignKey('categories.id'), nullable=True)
    level = Column(Integer, default=1)  # 1, 2, 3
    created_at = Column(TIMESTAMP, server_default=func.now())

    notes = relationship("Note", back_populates="category")
    suggestions = relationship("CategorySuggestion", back_populates="category")
    children = relationship("Category", backref="parent", remote_side=[id])


class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    notes = relationship("Note", secondary=note_tags, back_populates="tags")


class CategorySuggestion(Base):
    __tablename__ = 'category_suggestions'

    id = Column(Integer, primary_key=True, index=True)
    note_id = Column(Integer, ForeignKey('notes.id', ondelete='CASCADE'), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'))
    category_name = Column(String(100))  # 신규 제안용
    similarity_score = Column(Float, default=0.0)
    is_selected = Column(Boolean, default=False)
    is_new = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    note = relationship("Note", back_populates="suggestions")
    category = relationship("Category", back_populates="suggestions")
