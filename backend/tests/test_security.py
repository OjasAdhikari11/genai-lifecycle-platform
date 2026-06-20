"""Unit tests for password hashing and JWT helpers."""

from datetime import timedelta

import pytest
from fastapi import HTTPException

from app.security import (
    create_access_token,
    hash_password,
    verify_password,
    verify_token,
)


def test_hash_and_verify_password():
    hashed = hash_password("secret123")
    assert hashed != "secret123"
    assert verify_password("secret123", hashed) is True
    assert verify_password("wrong", hashed) is False


def test_create_and_verify_token():
    token = create_access_token(
        data={"sub": "42"},
        expires_delta=timedelta(minutes=30),
    )
    assert verify_token(token) == "42"


def test_verify_token_rejects_invalid():
    with pytest.raises(HTTPException) as exc:
        verify_token("not-a-valid-token")
    assert exc.value.status_code == 401
