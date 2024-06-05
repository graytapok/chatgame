def test_login_username(client, user):
    res = client.post("/api/auth/login", json={
        "login": user.username,
        "password": "test",
    })
    assert res.status_code == 200

    res = client.get("/api/auth/")
    assert res.status_code == 200
    assert res.json["user"]["username"] == user.username

def test_login_email(client, user):
    res = client.post("/api/auth/login", json={
        "login": user.email,
        "password": "test",
    })
    assert res.status_code == 200

    res = client.get("/api/auth/")
    assert res.status_code == 200
    assert res.json["user"]["username"] == user.username

def test_login_access(auth_client):
    res = auth_client.post("/api/auth/login")
    assert res.status_code == 403
    assert res.json["message"] == "no login required"

def test_login_after(client, user):
    res = client.get("/api/auth/")
    assert res.status_code == 401
    assert res.json["message"] == "login required"

    res = client.post("/api/auth/login", json={
        "login": user.username,
        "password": "test"
    })
    assert res.status_code == 200

    res = client.get("/api/auth/")
    assert res.status_code == 200
    assert res.json["user"]["username"] == user.username

    res = client.post("/api/auth/login")
    assert res.status_code == 403
    assert res.json["message"] == "no login required"
