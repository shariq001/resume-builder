from fastapi import APIRouter, Depends, HTTPException, status, Request
from uuid import UUID
from typing import List
from sqlmodel import Session
from backend.db.session import get_session
from backend.models.user import User, AuditLog
from backend.models.resume import Resume
from backend.schemas.resume import ResumeCreateRequest, ResumeUpdateRequest, ResumeResponse, ResumeSnapshotResponse
from backend.repositories.resume_repository import ResumeRepository
from backend.repositories.audit_repository import AuditRepository
from backend.api.deps import get_current_user
from backend.services.pdf.pdf_service import PDFService
from fastapi.responses import FileResponse
import os

router = APIRouter(prefix="/resumes", tags=["resumes"])

def get_resume_repo(session: Session = Depends(get_session)) -> ResumeRepository:
    return ResumeRepository(session)

def get_audit_repo(session: Session = Depends(get_session)) -> AuditRepository:
    return AuditRepository(session)

@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(
    request: Request,
    data: ResumeCreateRequest, 
    current_user: User = Depends(get_current_user),
    resume_repo: ResumeRepository = Depends(get_resume_repo),
    audit_repo: AuditRepository = Depends(get_audit_repo)
) -> Resume:
    resume = Resume(
        user_id=current_user.id,
        title=data.title,
        template_id=data.template_id,
        form_data={}
    )
    created = resume_repo.create(resume)
    
    audit_repo.create(AuditLog(
        user_id=current_user.id,
        action="resume.created",
        http_method="POST",
        path="/resumes",
        ip_address=request.client.host if request.client else "127.0.0.1"
    ))
    return created

@router.get("", response_model=List[ResumeResponse])
def list_resumes(
    current_user: User = Depends(get_current_user),
    resume_repo: ResumeRepository = Depends(get_resume_repo)
) -> List[Resume]:
    return resume_repo.list_by_user(current_user.id)

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    resume_repo: ResumeRepository = Depends(get_resume_repo)
) -> Resume:
    resume = resume_repo.get_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.patch("/{resume_id}", response_model=ResumeResponse)
def update_resume(
    request: Request,
    resume_id: UUID,
    data: ResumeUpdateRequest,
    current_user: User = Depends(get_current_user),
    resume_repo: ResumeRepository = Depends(get_resume_repo),
    audit_repo: AuditRepository = Depends(get_audit_repo)
) -> Resume:
    resume = resume_repo.get_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    if data.title is not None:
        resume.title = data.title
    if data.template_id is not None:
        resume.template_id = data.template_id
    if data.form_data is not None:
        resume.form_data = data.form_data
        
    if data.save_version:
        resume.version += 1

    updated = resume_repo.update(resume, save_snapshot=data.save_version)
    
    action = "resume.auto_saved" if not data.save_version else "resume.version_saved"
    audit_repo.create(AuditLog(
        user_id=current_user.id,
        action=action,
        http_method="PATCH",
        path=f"/resumes/{resume_id}",
        ip_address=request.client.host if request.client else "127.0.0.1"
    ))
    return updated

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    request: Request,
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    resume_repo: ResumeRepository = Depends(get_resume_repo),
    audit_repo: AuditRepository = Depends(get_audit_repo)
) -> None:
    resume = resume_repo.get_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    resume_repo.delete(resume)
    
    audit_repo.create(AuditLog(
        user_id=current_user.id,
        action="resume.deleted",
        http_method="DELETE",
        path=f"/resumes/{resume_id}",
        ip_address=request.client.host if request.client else "127.0.0.1"
    ))

@router.get("/{resume_id}/snapshots", response_model=List[ResumeSnapshotResponse])
def list_snapshots(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    resume_repo: ResumeRepository = Depends(get_resume_repo)
):
    resume = resume_repo.get_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume_repo.list_snapshots(resume_id)

@router.post("/{resume_id}/restore/{version}", response_model=ResumeResponse)
def restore_snapshot(
    request: Request,
    resume_id: UUID,
    version: int,
    current_user: User = Depends(get_current_user),
    resume_repo: ResumeRepository = Depends(get_resume_repo),
    audit_repo: AuditRepository = Depends(get_audit_repo)
) -> Resume:
    resume = resume_repo.get_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    snapshot = resume_repo.get_snapshot(resume_id, version)
    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
        
    resume.form_data = snapshot.form_data
    resume.ats_score = snapshot.ats_score
    resume.version += 1 
    
    updated = resume_repo.update(resume, save_snapshot=True)
    
    audit_repo.create(AuditLog(
        user_id=current_user.id,
        action="resume.restored",
        http_method="POST",
        path=f"/resumes/{resume_id}/restore/{version}",
        ip_address=request.client.host if request.client else "127.0.0.1"
    ))
    return updated

def get_pdf_service(resume_repo: ResumeRepository = Depends(get_resume_repo)) -> PDFService:
    return PDFService(resume_repo)

@router.post("/{resume_id}/generate-pdf")
async def generate_pdf(
    request: Request,
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    pdf_service: PDFService = Depends(get_pdf_service),
    audit_repo: AuditRepository = Depends(get_audit_repo)
):
    try:
        result = await pdf_service.generate_pdf(resume_id, current_user.id)
        audit_repo.create(AuditLog(
            user_id=current_user.id,
            action="resume.pdf_generated",
            http_method="POST",
            path=f"/resumes/{resume_id}/generate-pdf",
            ip_address=request.client.host if request.client else "127.0.0.1"
        ))
        return {"download_url": result.download_url}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{resume_id}/download")
async def download_pdf(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    resume_repo: ResumeRepository = Depends(get_resume_repo)
):
    resume = resume_repo.get_by_id(resume_id, current_user.id)
    if not resume or not resume.pdf_url:
        raise HTTPException(status_code=404, detail="PDF not found")
        
    file_name = f"{current_user.id}_{resume_id}_v{resume.version}.pdf"
    file_path = f"storage/pdfs/{file_name}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF file missing")
        
    return FileResponse(path=file_path, filename=f"{resume.title}.pdf", media_type='application/pdf')
