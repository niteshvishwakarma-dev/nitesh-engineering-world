import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Nitesh Vishwakarma Portfolio API"


@pytest.mark.asyncio
async def test_projects_empty_state_without_demo_data():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/projects")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    # Verifies no fake demo projects are pre-seeded
    assert len(response.json()) == 0


@pytest.mark.asyncio
async def test_contact_form_validation_failures():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Invalid email
        res1 = await ac.post("/api/v1/contact", json={
            "name": "Alex",
            "email": "not-an-email",
            "subject": "Inquiry",
            "message": "Valid length message here!"
        })
        assert res1.status_code == 422

        # Message too short
        res2 = await ac.post("/api/v1/contact", json={
            "name": "Alex",
            "email": "alex@example.com",
            "subject": "Inquiry",
            "message": "Too short"
        })
        assert res2.status_code == 422


@pytest.mark.asyncio
async def test_admin_unauthorized_access():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/admin/login", json={
            "email": "unregistered@domain.com",
            "password": "wrongpassword123"
        })
        assert response.status_code == 401
