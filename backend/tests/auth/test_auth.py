def test_auth(client):
    res = client.get("/api/auth/")
    assert res.status_code == 401
    assert res.json["message"] == "login required"

def test_auth_access(auth_client, user):
    res = auth_client.get("/api/auth/")
    assert res.status_code == 200
    assert res.json["user"]["username"] == user.username


