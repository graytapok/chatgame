from email_validator import validate_email, EmailNotValidError

from chatgame.database.models import User

def get_user_by_login(login):
    try:
        validate_email(login)
        user = User.objects(email=login).first()
    except EmailNotValidError:
        user = User.objects(username=login).first()
    return user
