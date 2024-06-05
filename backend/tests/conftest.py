from flask_mongoengine import MongoEngine

import mongoengine
import pytest

from chatgame import create_app
from chatgame.database.models import User

@pytest.fixture
def app():
    app = create_app(test=True)

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
    user.set_password("test", test=True)
    user.save()

    yield test_db

    test_db.connection["default"].drop_database(db_name)

@pytest.fixture
def user(db):
    user = User.objects(username="Test").first()
    yield user

@pytest.fixture
def client(app, db):
    return app.test_client(user=None)

@pytest.fixture
def auth_client(app, user, db):
    return app.test_client(user=user)
