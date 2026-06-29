from uuid import UUID
from typing import Optional, List
from sqlmodel import Session, select
from backend.models.resume import Resume, ResumeSnapshot

class ResumeRepository:
    """Repository for Resume CRUD operations and snapshotting."""
    def __init__(self, session: Session):
        self.session = session

    def create(self, resume: Resume) -> Resume:
        self.session.add(resume)
        self.session.commit()
        self.session.refresh(resume)
        
        # Create initial snapshot
        snapshot = ResumeSnapshot(
            resume_id=resume.id,
            version=resume.version,
            form_data=resume.form_data,
            ats_score=resume.ats_score
        )
        self.session.add(snapshot)
        self.session.commit()
        
        return resume

    def get_by_id(self, resume_id: UUID, user_id: UUID) -> Optional[Resume]:
        statement = select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id)
        return self.session.exec(statement).first()

    def list_by_user(self, user_id: UUID) -> List[Resume]:
        statement = select(Resume).where(Resume.user_id == user_id).order_by(Resume.updated_at.desc()) # type: ignore
        return list(self.session.exec(statement).all())

    def update(self, resume: Resume, save_snapshot: bool = False) -> Resume:
        self.session.add(resume)
        self.session.commit()
        self.session.refresh(resume)
        
        if save_snapshot:
            snapshot = ResumeSnapshot(
                resume_id=resume.id,
                version=resume.version,
                form_data=resume.form_data,
                ats_score=resume.ats_score
            )
            self.session.add(snapshot)
            self.session.commit()
            
        return resume

    def delete(self, resume: Resume) -> None:
        self.session.delete(resume)
        self.session.commit()

    def list_snapshots(self, resume_id: UUID) -> List[ResumeSnapshot]:
        statement = select(ResumeSnapshot).where(ResumeSnapshot.resume_id == resume_id).order_by(ResumeSnapshot.version.desc()) # type: ignore
        return list(self.session.exec(statement).all())

    def get_snapshot(self, resume_id: UUID, version: int) -> Optional[ResumeSnapshot]:
        statement = select(ResumeSnapshot).where(ResumeSnapshot.resume_id == resume_id, ResumeSnapshot.version == version)
        return self.session.exec(statement).first()
