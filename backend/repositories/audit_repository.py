from sqlmodel import Session
from backend.models.user import AuditLog

class AuditRepository:
    """Repository for AuditLog model operations."""
    def __init__(self, session: Session):
        self.session = session

    def create(self, log: AuditLog) -> AuditLog:
        self.session.add(log)
        self.session.commit()
        self.session.refresh(log)
        return log
