from contextlib import asynccontextmanager
from fastapi import FastAPI
from backend.routers import auth_router, users_router, resumes_router, intelligence_router
from backend.core.config import settings
from backend.db.session import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(resumes_router, prefix=settings.API_V1_STR)
app.include_router(intelligence_router, prefix=settings.API_V1_STR)

from fastapi.staticfiles import StaticFiles
import os
os.makedirs("storage/avatars", exist_ok=True)
app.mount("/avatars", StaticFiles(directory="storage/avatars"), name="avatars")
