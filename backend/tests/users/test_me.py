def test_me(client):
    res = client.get("/api/users/me")
    assert res.status_code == 401

def test_me_2(auth_client):
    res = auth_client.get("/api/users/me")
    assert res.status_code == 200