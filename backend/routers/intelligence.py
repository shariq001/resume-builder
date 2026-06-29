from fastapi import APIRouter, Depends, HTTPException, status, Request
from uuid import UUID
from sqlmodel import Session
from backend.db.session import get_session
from backend.models.user import User, AuditLog
from backend.repositories.resume_repository import ResumeRepository
from backend.repositories.audit_repository import AuditRepository
from backend.api.deps import get_current_user

from backend.schemas.ats import ATSScoreResult, KeywordMatchRequest, KeywordMatchResult
from backend.services.ats.score import compute_score
from backend.services.keywords.matcher import match

router = APIRouter(prefix="/resumes", tags=["intelligence"])

def get_resume_repo(session: Session = Depends(get_session)) -> ResumeRepository:
    return ResumeRepository(session)

def get_audit_repo(session: Session = Depends(get_session)) -> AuditRepository:
    return AuditRepository(session)

@router.post("/{resume_id}/ats-score", response_model=ATSScoreResult)
def get_ats_score(
    request: Request,
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    resume_repo: ResumeRepository = Depends(get_resume_repo),
    audit_repo: AuditRepository = Depends(get_audit_repo)
):
    resume = resume_repo.get_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    result = compute_score(resume.form_data, resume.template_id)
    
    resume.ats_score = result.total_score
    resume_repo.update(resume, save_snapshot=False)
    
    audit_repo.create(AuditLog(
        user_id=current_user.id,
        action="resume.ats_scored",
        http_method="POST",
        path=f"/resumes/{resume_id}/ats-score",
        ip_address=request.client.host if request.client else "127.0.0.1"
    ))
    
    return result

@router.post("/{resume_id}/keyword-match", response_model=KeywordMatchResult)
def get_keyword_match(
    request: Request,
    resume_id: UUID,
    data: KeywordMatchRequest,
    current_user: User = Depends(get_current_user),
    resume_repo: ResumeRepository = Depends(get_resume_repo),
    audit_repo: AuditRepository = Depends(get_audit_repo)
):
    if len(data.job_description) < 50 or len(data.job_description) > 5000:
        raise HTTPException(status_code=400, detail="Job description must be between 50 and 5000 characters")
        
    resume = resume_repo.get_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    result = match(data.job_description, resume.form_data)
    
    audit_repo.create(AuditLog(
        user_id=current_user.id,
        action="resume.keyword_matched",
        http_method="POST",
        path=f"/resumes/{resume_id}/keyword-match",
        ip_address=request.client.host if request.client else "127.0.0.1"
    ))
    
    return result
