def test_logout(auth_client):
    res = auth_client.get("/api/auth/logout")
    assert res.status_code == 200

    res = auth_client.get("/api/auth/")
    assert res.status_code == 401

def test_logout_access(client):
    res = client.get("/api/auth/logout")
    assert res.status_code == 401
    assert res.json["message"] == "login required"
