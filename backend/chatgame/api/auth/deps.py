from functools import wraps
from flask_login import current_user

from chatgame.api.auth.exceptions import UserIsAuthorized

def no_login_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if current_user.is_authenticated:
            raise UserIsAuthorized
        return func(*args, **kwargs)
    return wrapped