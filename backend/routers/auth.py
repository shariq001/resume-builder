from fastapi import APIRouter, Depends, Request, status
from backend.schemas.auth import RegisterRequest, LoginRequest, RefreshRequest, LogoutRequest, TokenResponse
from backend.services.auth.auth_service import AuthService
from backend.api.deps import get_auth_service

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(request: Request, data: RegisterRequest, auth_service: AuthService = Depends(get_auth_service)) -> TokenResponse:
    ip_address = request.client.host if request.client else "127.0.0.1"
    return auth_service.register(data, ip_address)

@router.post("/login", response_model=TokenResponse)
def login(request: Request, data: LoginRequest, auth_service: AuthService = Depends(get_auth_service)) -> TokenResponse:
    ip_address = request.client.host if request.client else "127.0.0.1"
    return auth_service.login(data, ip_address)

@router.post("/refresh", response_model=TokenResponse)
def refresh(request: Request, data: RefreshRequest, auth_service: AuthService = Depends(get_auth_service)) -> TokenResponse:
    ip_address = request.client.host if request.client else "127.0.0.1"
    return auth_service.refresh(data.refresh_token, ip_address)

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request, data: LogoutRequest, auth_service: AuthService = Depends(get_auth_service)) -> None:
    ip_address = request.client.host if request.client else "127.0.0.1"
    auth_service.logout(data.refresh_token, ip_address)

from backend.schemas.auth import ForgotPasswordRequest, ResetPasswordRequest

from fastapi import BackgroundTasks

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(request: Request, data: ForgotPasswordRequest, background_tasks: BackgroundTasks, auth_service: AuthService = Depends(get_auth_service)):
    ip_address = request.client.host if request.client else "127.0.0.1"
    auth_service.forgot_password(data.email, ip_address, background_tasks)
    return {"message": "If that email is registered, a reset link has been sent."}

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(request: Request, data: ResetPasswordRequest, auth_service: AuthService = Depends(get_auth_service)):
    ip_address = request.client.host if request.client else "127.0.0.1"
    auth_service.reset_password(data.token, data.new_password, ip_address)
    return {"message": "Password reset successful. You can now login with your new password."}
