from flask_login import current_user

from functools import wraps

from chatgame.extensions import api

from .errors import EmailConfirmationRequired, LoginRequired, NoLoginRequired
from .models import login_required_model

__all__ = (
    "email_confirmation_required",
    "login_required",
    "no_login_required",
)

def email_confirmation_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            raise EmailConfirmationRequired(email=current_user.email)
        return func(*args, **kwargs)
    return wrapped

@api.response(401, "Unauthorized", login_required_model)
def login_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            raise LoginRequired
        return func(*args, **kwargs)
    return wrapped

def no_login_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if current_user.is_authenticated:
            raise NoLoginRequired
        return func(*args, **kwargs)
    return wrapped
