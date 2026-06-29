from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import PyJWTError, decode
from uuid import UUID
from sqlmodel import Session
from backend.core.config import settings
from backend.db.session import get_session
from backend.models.user import User
from backend.repositories.user_repository import UserRepository, RefreshTokenRepository
from backend.repositories.audit_repository import AuditRepository
from backend.services.auth.auth_service import AuthService

security = HTTPBearer()

def get_auth_service(session: Session = Depends(get_session)) -> AuthService:
    user_repo = UserRepository(session)
    token_repo = RefreshTokenRepository(session)
    audit_repo = AuditRepository(session)
    return AuthService(user_repo, token_repo, audit_repo)

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UUID:
    token = credentials.credentials
    try:
        payload = decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return UUID(user_id_str)
    except PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def get_current_user(
    user_id: UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
) -> User:
    repo = UserRepository(session)
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
