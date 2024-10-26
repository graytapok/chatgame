from chatgame.db.models import User
from email_validator import validate_email, EmailNotValidError


def check_email_available(email: str):
    return True if User.objects(email=email).first() is None else False # type:ignore

def check_username_available(username: str):
    return True if User.objects(username=username).first() is None else False # type:ignore

def get_user_by_login(login) -> User:
    try:
        validate_email(login)
        user = User.objects(email=login).first() # type:ignore
    except EmailNotValidError:
        user = User.objects(username=login).first() # type:ignore
    return user
