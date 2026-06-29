from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import jwt
import hashlib
from backend.core.config import settings
from typing import Any

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Pre-hash with SHA-256 to bypass bcrypt's 72-byte limit
    pre_hashed = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()
    return pwd_context.verify(pre_hashed, hashed_password)

def get_password_hash(password: str) -> str:
    # Pre-hash with SHA-256 to bypass bcrypt's 72-byte limit
    pre_hashed = hashlib.sha256(password.encode('utf-8')).hexdigest()
    return pwd_context.hash(pre_hashed)

def get_token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

def create_access_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
