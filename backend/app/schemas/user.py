from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Base user schema with common attributes."""

    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user registration input."""

    password: str


class UserResponse(UserBase):
    """Schema for user response (no password)."""

    id: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserInDB(UserResponse):
    """Schema for user in database (includes hashed password)."""

    hashed_password: str
