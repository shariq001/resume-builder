import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.api.deps import get_auth_service
from backend.schemas.auth import TokenResponse
from fastapi import HTTPException

client = TestClient(app)

def test_register_success():
    class MockAuthService:
        def register(self, data, ip):
            return TokenResponse(access_token="mock_access", refresh_token="mock_refresh")
            
    app.dependency_overrides[get_auth_service] = lambda: MockAuthService()
    
    response = client.post("/api/v1/auth/register", json={
        "full_name": "Test User",
        "email": "test@example.com",
        "username": "testuser",
        "password": "Password1!"
    })
    
    assert response.status_code == 201
    assert "access_token" in response.json()
    app.dependency_overrides.clear()

def test_login_invalid_credentials():
    class MockAuthService:
        def login(self, data, ip):
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
    app.dependency_overrides[get_auth_service] = lambda: MockAuthService()
    
    response = client.post("/api/v1/auth/login", json={
        "email": "wrong@example.com",
        "password": "WrongPassword1!"
    })
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"
    app.dependency_overrides.clear()
