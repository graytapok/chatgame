from flask_socketio import emit

from email_validator import validate_email, EmailNotValidError
from chatgame.database.models import User

from json import JSONDecodeError
import json

__all__ = [
    "get_user_by_login"
]

def get_user_by_login(login) -> User:
    try:
        validate_email(login)
        user = User.objects(email=login).first()
    except EmailNotValidError:
        user = User.objects(username=login).first()
    return user
