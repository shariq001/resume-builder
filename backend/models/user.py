from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import INET
from enum import Enum

class ThemePreference(str, Enum):
    light = "light"
    dark = "dark"
    system = "system"

class User(SQLModel, table=True):
    """User model representing authentication and profile info."""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(sa_column=Column("email", String(255), unique=True, index=True, nullable=False))
    username: str = Field(sa_column=Column("username", String(50), unique=True, nullable=False))
    hashed_password: str = Field(nullable=False)
    full_name: str = Field(sa_column=Column("full_name", String(150), nullable=False))
    profile_picture_url: Optional[str] = Field(default=None)
    theme_preference: ThemePreference = Field(default=ThemePreference.system)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RefreshToken(SQLModel, table=True):
    """Token model for managing JWT refresh tokens."""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", ondelete="CASCADE")
    token_hash: str = Field(index=True, nullable=False)
    expires_at: datetime = Field(nullable=False)
    revoked: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AuditLog(SQLModel, table=True):
    """Audit log for state-changing operations."""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: Optional[UUID] = Field(default=None, foreign_key="user.id")
    action: str = Field(sa_column=Column("action", String(100), nullable=False))
    http_method: str = Field(sa_column=Column("http_method", String(10), nullable=False))
    path: str = Field(nullable=False)
    ip_address: str = Field(sa_column=Column(INET, nullable=False))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
