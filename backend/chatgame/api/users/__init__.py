from flask import Blueprint

bp = Blueprint("users", __name__)

from .views import me

from . import handlers

bp.add_url_rule("/me", view_func=me.Me.as_view("me"))