import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.api.deps import get_auth_service, get_current_user
from backend.models.user import User

client = TestClient(app)

def mock_current_user():
    return User(
        email="test@example.com",
        username="testuser",
        hashed_password="mock_hash",
        full_name="Test User"
    )

def test_upload_avatar_invalid_mime():
    app.dependency_overrides[get_current_user] = mock_current_user
    
    # Create a dummy text file to simulate an invalid mime type
    files = {'file': ('avatar.txt', b'dummy content', 'text/plain')}
    response = client.post("/api/v1/users/me/avatar", files=files)
    
    assert response.status_code == 422
    assert "Invalid file type" in response.json()["detail"]
    app.dependency_overrides.clear()

def test_upload_avatar_too_large():
    app.dependency_overrides[get_current_user] = mock_current_user
    
    # 2.1 MB file (over the 2 MB limit)
    large_content = b'0' * int(2.1 * 1024 * 1024)
    files = {'file': ('avatar.png', large_content, 'image/png')}
    
    response = client.post("/api/v1/users/me/avatar", files=files)
    
    assert response.status_code == 422
    assert "File too large" in response.json()["detail"]
    app.dependency_overrides.clear()
