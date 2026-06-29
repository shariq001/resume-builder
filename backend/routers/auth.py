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
