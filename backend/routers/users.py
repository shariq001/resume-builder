from fastapi import APIRouter, Depends, Request, UploadFile, File, HTTPException, status
from backend.models.user import User, AuditLog
from backend.schemas.auth import UpdateProfileRequest, ChangePasswordRequest, ProfileResponse, DeleteProfileRequest
from backend.services.auth.auth_service import AuthService
from backend.services.auth.security import verify_password
from backend.api.deps import get_auth_service, get_current_user
from typing import Dict, Any
import os

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user)) -> ProfileResponse:
    return ProfileResponse(
        id=current_user.id,
        email=current_user.email, # type: ignore
        username=current_user.username,
        full_name=current_user.full_name,
        profile_picture_url=current_user.profile_picture_url,
        theme_preference=current_user.theme_preference.value # type: ignore
    )

@router.patch("/me", response_model=ProfileResponse)
def update_profile(
    request: Request, 
    data: UpdateProfileRequest, 
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
) -> ProfileResponse:
    ip_address = request.client.host if request.client else "127.0.0.1"
    return auth_service.update_profile(current_user.id, data, ip_address)

@router.post("/me/change-password")
def change_password(
    request: Request, 
    data: ChangePasswordRequest, 
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
) -> Dict[str, str]:
    ip_address = request.client.host if request.client else "127.0.0.1"
    auth_service.change_password(current_user.id, data, ip_address)
    return {"message": "Password changed successfully"}

@router.post("/me/avatar", response_model=ProfileResponse)
async def upload_avatar(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
) -> ProfileResponse:
    ip_address = request.client.host if request.client else "127.0.0.1"
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid file type. Must be an image.")
    
    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="File too large")
        
    os.makedirs("storage/avatars", exist_ok=True)
    import re
    safe_filename = re.sub(r'[^a-zA-Z0-9_\.-]', '_', file.filename)
    filename = f"{current_user.id}_{safe_filename}"
    file_path = f"storage/avatars/{filename}"
    with open(file_path, "wb") as f:
        f.write(contents)
        
    
    base_url = str(request.base_url)
    if base_url.endswith("/"):
        base_url = base_url[:-1]
    
    avatar_url = f"{base_url}/avatars/{filename}"
    
    user = auth_service.user_repo.get_by_id(current_user.id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    user.profile_picture_url = avatar_url
    updated_user = auth_service.user_repo.update(user)
    
    auth_service.audit_repo.create(AuditLog(
        user_id=user.id,
        action="user.avatar_updated",
        http_method="POST",
        path="/users/me/avatar",
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

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_profile(
    request: Request,
    data: DeleteProfileRequest,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
) -> None:
    if not verify_password(data.password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password")

    ip_address = request.client.host if request.client else "127.0.0.1"
    
    auth_service.audit_repo.create(AuditLog(
        user_id=current_user.id,
        action="user.deleted",
        http_method="DELETE",
        path="/users/me",
        ip_address=ip_address
    ))
    
    auth_service.user_repo.delete(current_user)
