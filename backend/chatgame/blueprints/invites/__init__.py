from flask import Blueprint

bp = Blueprint("invites", __name__)

from . import routes