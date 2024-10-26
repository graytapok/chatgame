def test_logout(auth_client):
    res = auth_client.get("/api/auth/logout")
    assert res.status_code == 204

    res = auth_client.get("/api/users/me")
    assert res.status_code == 401

def test_logout_access(client):
    res = client.get("/api/auth/logout")
    assert res.status_code == 401
    assert res.json["detail"] == "Unauthorized"
