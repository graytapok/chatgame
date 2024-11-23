class TestMe:
    def test_401(self, client):
        res = client.get("/api/users/me")
        assert res.status_code == 401

    def test_200(self, auth_client, user):
        res = auth_client.get("/api/users/me")
        assert res.status_code == 200
        assert res.json["id"] == str(user.id)

class TestGetUsers:
    def test_401(self, client):
        res = client.get("/api/users/")
        assert res.status_code == 401

    def test_403(self, auth_client):
        res = auth_client.get("/api/users/")
        assert res.status_code == 403

    def test_200(self, admin_client):
        res = admin_client.get("/api/users/")
        assert res.status_code == 200
        assert res.json

class TestGetUser:
    def test_401(self, client, user):
        res = client.get(f"/api/users/{user.id}")
        assert res.status_code == 401

    def test_403(self, auth_client, user):
        res = auth_client.get(f"/api/users/{user.id}")
        assert res.status_code == 403

    def test_200(self, admin_client, admin):
        res = admin_client.get(f"/api/users/{admin.id}")
        assert res.status_code == 200
        assert res.json
