from chatgame.models import UserModel
from chatgame.extensions import db


def test_login(client, auth_client):
    response = client.post("/api/auth/login", json={"login": "Wadim", "password": "Wadim"})

    assert response.status_code == 401

    response = client.post("/api/auth/login", json={"login": "User", "password": "password"})

    assert response.status_code == 204

    response = auth_client.post("/api/auth/login", json={"login": "User", "password": "password"})

    assert response.status_code == 403

def test_logout(client, auth_client):
    res = auth_client.get("/api/auth/logout")

    assert res.status_code == 204

    res = client.get("/api/auth/logout")

    assert res.status_code == 401

    res = auth_client.get("/api/auth/logout")

    assert res.status_code == 401

def test_register(client):
    response = client.post("/api/auth/register?email=false", json={
        "username": "User",
        "email": "wadim@gmail.com",
        "password": "password"
    })

    assert response.status_code == 201

    new_user = db.session.query(UserModel).filter_by(email="wvtrupp@gmail.com").first()
    assert new_user







