def test_login_username(client, user):
    res = client.post("/api/auth/login", json={
        "login": user.username,
        "password": "test",
    })
    assert res.status_code == 204

    res = client.get("/api/users/me")
    assert res.status_code == 200
    assert res.json["id"] == str(user.id)

def test_login_email(client, user):
    res = client.post("/api/auth/login", json={
        "login": user.email,
        "password": "test",
    })
    assert res.status_code == 204

    res = client.get("/api/users/me")
    assert res.status_code == 200
    assert res.json["id"] == str(user.id)

def test_login_access(auth_client):
    res = auth_client.post("/api/auth/login")
    assert res.status_code == 403
    assert res.json["detail"] == "User is authorized"

def test_login_after(client, user):
    res = client.get("/api/users/me")
    assert res.status_code == 401
    assert res.json["detail"] == "Unauthorized"

    res = client.post("/api/auth/login", json={
        "login": user.username,
        "password": "test"
    })
    assert res.status_code == 204

    res = client.get("/api/users/me")
    assert res.status_code == 200
    assert res.json["id"] == str(user.id)

    res = client.post("/api/auth/login")
    assert res.status_code == 403
    assert res.json["detail"] == "User is authorized"
