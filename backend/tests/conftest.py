import pytest


@pytest.fixture
def test_user_data():
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "password": "securepassword123",
        "full_name": "Test User",
    }
