from functools import wraps
from flask_login import current_user, login_required

from chatgame.blueprints.auth.exceptions import ForbiddenException

def no_login_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if current_user.is_authenticated:
            raise ForbiddenException
        return func(*args, **kwargs)
    return wrapped


def admin_required(func):
    @wraps(func)
    @login_required
    def wrapped(*args, **kwargs):
        if not current_user.admin:
            raise ForbiddenException
        return func(*args, **kwargs)
    return wrapped