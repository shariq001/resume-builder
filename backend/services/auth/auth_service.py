from uuid import UUID, uuid4
from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from backend.repositories.user_repository import UserRepository, RefreshTokenRepository
from backend.repositories.audit_repository import AuditRepository
from backend.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UpdateProfileRequest,
    ChangePasswordRequest,
    TokenResponse,
    ProfileResponse
)
from backend.models.user import User, RefreshToken, AuditLog
from backend.services.auth.security import get_password_hash, verify_password, create_access_token, get_token_hash
from backend.core.config import settings

class AuthService:
    """Service layer for Authentication and Profile Management."""
    def __init__(self, user_repo: UserRepository, token_repo: RefreshTokenRepository, audit_repo: AuditRepository):
        self.user_repo = user_repo
        self.token_repo = token_repo
        self.audit_repo = audit_repo

    def register(self, data: RegisterRequest, ip_address: str) -> TokenResponse:
        if self.user_repo.get_by_email(data.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        if self.user_repo.get_by_username(data.username):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already registered")

        hashed_pw = get_password_hash(data.password)
        new_user = User(
            email=data.email,
            username=data.username,
            full_name=data.full_name,
            hashed_password=hashed_pw
        )
        user = self.user_repo.create(new_user)
        
        access_token = create_access_token(subject=user.id)
        refresh_token_str = str(uuid4())
        
        token_record = RefreshToken(
            user_id=user.id,
            token_hash=get_token_hash(refresh_token_str),
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )
        self.token_repo.create(token_record)

        self.audit_repo.create(AuditLog(
            user_id=user.id,
            action="user.created",
            http_method="POST",
            path="/auth/register",
            ip_address=ip_address
        ))

        return TokenResponse(access_token=access_token, refresh_token=refresh_token_str)

    def login(self, data: LoginRequest, ip_address: str) -> TokenResponse:
        user = self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

        self.token_repo.revoke_all_for_user(user.id)

        access_token = create_access_token(subject=user.id)
        refresh_token_str = str(uuid4())
        
        token_record = RefreshToken(
            user_id=user.id,
            token_hash=get_token_hash(refresh_token_str),
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )
        self.token_repo.create(token_record)

        self.audit_repo.create(AuditLog(
            user_id=user.id,
            action="user.login",
            http_method="POST",
            path="/auth/login",
            ip_address=ip_address
        ))

        return TokenResponse(access_token=access_token, refresh_token=refresh_token_str)

    def refresh(self, refresh_token: str, ip_address: str) -> TokenResponse:
        token_hash = get_token_hash(refresh_token)
        token_record = self.token_repo.get_by_hash(token_hash)
        
        if not token_record or token_record.revoked or token_record.expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

        token_record.revoked = True
        self.token_repo.update(token_record)

        user = self.user_repo.get_by_id(token_record.user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        access_token = create_access_token(subject=user.id)
        new_refresh_token_str = str(uuid4())
        
        new_token_record = RefreshToken(
            user_id=user.id,
            token_hash=get_token_hash(new_refresh_token_str),
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )
        self.token_repo.create(new_token_record)

        return TokenResponse(access_token=access_token, refresh_token=new_refresh_token_str)

    def logout(self, refresh_token: str, ip_address: str) -> None:
        token_hash = get_token_hash(refresh_token)
        token_record = self.token_repo.get_by_hash(token_hash)
        
        if token_record:
            token_record.revoked = True
            self.token_repo.update(token_record)

            self.audit_repo.create(AuditLog(
                user_id=token_record.user_id,
                action="user.logout",
                http_method="POST",
                path="/auth/logout",
                ip_address=ip_address
            ))

    def update_profile(self, user_id: UUID, data: UpdateProfileRequest, ip_address: str) -> ProfileResponse:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        if data.username and data.username != user.username:
            if self.user_repo.get_by_username(data.username):
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already taken")
            user.username = data.username
            
        if data.full_name:
            user.full_name = data.full_name
            
        if data.theme_preference:
            user.theme_preference = data.theme_preference

        updated_user = self.user_repo.update(user)

        self.audit_repo.create(AuditLog(
            user_id=user.id,
            action="user.profile_updated",
            http_method="PATCH",
            path="/users/me",
            ip_address=ip_address
        ))

        return ProfileResponse(
            id=updated_user.id,
            email=updated_user.email, # type: ignore
            username=updated_user.username,
            full_name=updated_user.full_name,
            profile_picture_url=updated_user.profile_picture_url,
            theme_preference=updated_user.theme_preference.value # type: ignore
        )

    def change_password(self, user_id: UUID, data: ChangePasswordRequest, ip_address: str) -> None:
        user = self.user_repo.get_by_id(user_id)
        if not user or not verify_password(data.current_password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect current password")

        user.hashed_password = get_password_hash(data.new_password)
        self.user_repo.update(user)
        self.token_repo.revoke_all_for_user(user.id)

        self.audit_repo.create(AuditLog(
            user_id=user.id,
            action="user.password_changed",
            http_method="POST",
            path="/users/me/change-password",
            ip_address=ip_address
        ))

    def forgot_password(self, email: str, ip_address: str) -> None:
        user = self.user_repo.get_by_email(email)
        if not user:
            return  # Do not reveal that the user does not exist
            
        import secrets
        from backend.services.email_service import send_reset_password_email
        
        token = secrets.token_urlsafe(32)
        user.reset_password_token = token
        user.reset_password_expires = datetime.now(timezone.utc) + timedelta(hours=1)
        self.user_repo.update(user)
        
        self.audit_repo.create(AuditLog(
            user_id=user.id,
            action="user.forgot_password_requested",
            http_method="POST",
            path="/auth/forgot-password",
            ip_address=ip_address
        ))
        
        send_reset_password_email(user.email, token)

    def reset_password(self, token: str, new_password: str, ip_address: str) -> None:
        user = self.user_repo.get_by_reset_token(token)
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")
            
        if not user.reset_password_expires or user.reset_password_expires.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")
            
        user.hashed_password = get_password_hash(new_password)
        user.reset_password_token = None
        user.reset_password_expires = None
        
        self.user_repo.update(user)
        self.token_repo.revoke_all_for_user(user.id)
        
        self.audit_repo.create(AuditLog(
            user_id=user.id,
            action="user.password_reset",
            http_method="POST",
            path="/auth/reset-password",
            ip_address=ip_address
        ))
