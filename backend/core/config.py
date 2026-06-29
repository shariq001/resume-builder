from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "ATS Resume Builder"
    API_V1_STR: str = "/api/v1"
    
    # JWT Settings
    SECRET_KEY: str = "dev_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database Settings (Neon Serverless PostgreSQL)
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ats_resume"
    
    # Allow loading from .env
    model_config = SettingsConfigDict(env_file="backend/.env", case_sensitive=True, extra="ignore")

settings = Settings()
