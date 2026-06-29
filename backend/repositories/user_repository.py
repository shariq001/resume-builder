from uuid import UUID
from typing import Optional
from sqlmodel import Session, select
from backend.models.user import User, RefreshToken

class UserRepository:
    """Repository for User model CRUD operations."""
    def __init__(self, session: Session):
        self.session = session

    def create(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def get_by_email(self, email: str) -> Optional[User]:
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first()

    def get_by_reset_token(self, token: str) -> Optional[User]:
        return self.session.exec(select(User).where(User.reset_password_token == token)).first()

    def get_by_username(self, username: str) -> Optional[User]:
        statement = select(User).where(User.username == username)
        return self.session.exec(statement).first()

    def get_by_id(self, user_id: UUID) -> Optional[User]:
        return self.session.get(User, user_id)

    def update(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user


class RefreshTokenRepository:
    """Repository for RefreshToken model operations."""
    def __init__(self, session: Session):
        self.session = session

    def create(self, token: RefreshToken) -> RefreshToken:
        self.session.add(token)
        self.session.commit()
        self.session.refresh(token)
        return token

    def get_by_hash(self, token_hash: str) -> Optional[RefreshToken]:
        statement = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        return self.session.exec(statement).first()

    def update(self, token: RefreshToken) -> RefreshToken:
        self.session.add(token)
        self.session.commit()
        self.session.refresh(token)
        return token
        
    def revoke_all_for_user(self, user_id: UUID) -> None:
        statement = select(RefreshToken).where(RefreshToken.user_id == user_id, RefreshToken.revoked == False)
        tokens = self.session.exec(statement).all()
        for t in tokens:
            t.revoked = True
            self.session.add(t)
        self.session.commit()
