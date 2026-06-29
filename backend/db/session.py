from typing import Generator
from sqlmodel import SQLModel, create_engine, Session
from backend.core.config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)

def get_session() -> Generator[Session, None, None]:
    """Yields a database session."""
    with Session(engine) as session:
        yield session

def create_db_and_tables() -> None:
    """Initialize database and tables."""
    SQLModel.metadata.create_all(engine)
