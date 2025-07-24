import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_user_registration_success(client: AsyncClient, test_user_data: dict):
    """Test successful user registration."""
    response = await client.post("/api/v1/auth/register", json=test_user_data)

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == test_user_data["email"]
    assert data["full_name"] == test_user_data["full_name"]
    assert "id" in data
    assert "created_at" in data
    assert "hashed_password" not in data  # Should not expose password


@pytest.mark.asyncio
async def test_user_registration_duplicate_email(
    client: AsyncClient, test_user_data: dict
):
    """Test registration with duplicate email should fail."""
    # Register first user
    await client.post("/api/v1/auth/register", json=test_user_data)

    # Try to register with same email
    response = await client.post("/api/v1/auth/register", json=test_user_data)

    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_user_registration_invalid_email(client: AsyncClient):
    """Test registration with invalid email format."""
    invalid_data = {
        "email": "not-an-email",
        "password": "password123",
        "full_name": "Test User",
    }

    response = await client.post("/api/v1/auth/register", json=invalid_data)

    assert response.status_code == 422  # Validation error
