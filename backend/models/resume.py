from datetime import datetime, timezone
from typing import Optional, Dict, Any
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, String, SmallInteger
from sqlalchemy.dialects.postgresql import JSONB

class Resume(SQLModel, table=True):
    """Resume model storing user configurations and form state."""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", ondelete="CASCADE")
    title: str = Field(sa_column=Column("title", String(100), nullable=False))
    template_id: int = Field(sa_column=Column("template_id", SmallInteger, nullable=False))
    form_data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB, nullable=False))
    ats_score: Optional[int] = Field(default=None, sa_column=Column("ats_score", SmallInteger, nullable=True))
    pdf_url: Optional[str] = Field(default=None)
    version: int = Field(default=1, nullable=False)
    last_auto_saved_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ResumeSnapshot(SQLModel, table=True):
    """Version history snapshot for a resume."""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    resume_id: UUID = Field(foreign_key="resume.id", ondelete="CASCADE")
    version: int = Field(nullable=False)
    form_data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB, nullable=False))
    ats_score: Optional[int] = Field(default=None, sa_column=Column("ats_score", SmallInteger, nullable=True))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
