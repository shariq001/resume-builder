from pydantic import BaseModel
from typing import Dict, Any, Optional
from uuid import UUID
from datetime import datetime

class ResumeCreateRequest(BaseModel):
    title: str
    template_id: int

class ResumeUpdateRequest(BaseModel):
    title: Optional[str] = None
    template_id: Optional[int] = None
    form_data: Optional[Dict[str, Any]] = None
    save_version: bool = False

class ResumeResponse(BaseModel):
    id: UUID
    title: str
    template_id: int
    form_data: Dict[str, Any]
    ats_score: Optional[int]
    pdf_url: Optional[str]
    version: int
    created_at: datetime
    updated_at: datetime

class ResumeSnapshotResponse(BaseModel):
    id: UUID
    resume_id: UUID
    version: int
    form_data: Dict[str, Any]
    ats_score: Optional[int]
    created_at: datetime
