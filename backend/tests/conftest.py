from flask import Flask
from flask_mongoengine import MongoEngine

import mongoengine
import pytest

from chatgame import create_app
from chatgame.db.models import User

@pytest.fixture
def app():
    app = create_app(mode="test")

    with app.app_context():
        yield app

    mongoengine.connection.disconnect_all()

@pytest.fixture
def db(app):
    test_db = MongoEngine(app)

    db_name = (
        test_db.connection["default"]
        .get_database("chatgame_test").name
    )

    if not db_name.endswith("_test"):
        raise RuntimeError(
            f"DATABASE_URL must point to testing db, not to master db ({db_name})"
        )

    test_db.connection["default"].drop_database(db_name)

    user = User(
        username="Test",
        email="test@gmail.com",
        admin=True,
        email_confirmed=True
    )
    user.set_password("test")
    user.save()

    yield test_db

    test_db.connection["default"].drop_database(db_name)

@pytest.fixture
def user(db: MongoEngine) -> User:
    return User.objects(username="Test").first()

@pytest.fixture
def client(app: Flask):
    return app.test_client()

@pytest.fixture
def auth_client(app: Flask, user: User):
    return app.test_client(user=user)