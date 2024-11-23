import pytest

from chatgame import create_app
from chatgame.extensions import db
from chatgame.blueprints.users.utils import create_user


@pytest.fixture
def app():
    app = create_app("TestConfig")

    with app.app_context():
        db.create_all()

        yield app

        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_client(app, user):
    return app.test_client(user=user)

@pytest.fixture
def admin_client(app, admin):
    return app.test_client(user=admin)

@pytest.fixture
def user(app):
    return create_user("User", "user@gmail.com", "password", email_confirmed=True)

@pytest.fixture
def admin(app):
    return create_user("Admin", "admin@gmail.com", "password", admin=True, email_confirmed=True)