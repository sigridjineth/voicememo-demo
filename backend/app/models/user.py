from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, String

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    # Use String for UUID to ensure SQLite compatibility
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
