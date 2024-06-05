from flask_login import current_user
from flask_socketio import disconnect

from functools import wraps

from .errors import *

import json

__all__ = [
    "email_confirmation_required",
    "login_required",
    "no_login_required",
    "validate_json",
    "socket_login_required"
]

def email_confirmation_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            raise EmailConfirmationRequired(email=current_user.email)
        return func(*args, **kwargs)
    return wrapped

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

def validate_json(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        try:
            json.loads(args[1])
        except Exception as e:
            raise NotValidJson(args[1])
        return func(args[0], json.loads(args[1]), **kwargs)
    return wrapped

def socket_login_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            disconnect()
        else:
            return func(*args, **kwargs)
    return wrapped
