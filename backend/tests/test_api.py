"""API tests for main endpoints (no real OpenAI calls)."""

SIGNUP_PAYLOAD = {"email": "test@example.com", "password": "pass123"}


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "message" in data


def test_signup_and_login(client):
    signup = client.post("/auth/signup", json=SIGNUP_PAYLOAD)
    assert signup.status_code == 200
    data = signup.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user_id"] == 1

    login = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "pass123"},
    )
    assert login.status_code == 200
    assert "access_token" in login.json()


def test_signup_duplicate_email(client):
    client.post("/auth/signup", json=SIGNUP_PAYLOAD)
    response = client.post("/auth/signup", json=SIGNUP_PAYLOAD)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_chat_requires_auth(client):
    response = client.post("/chat", json={"question": "Hello?"})
    assert response.status_code == 401
