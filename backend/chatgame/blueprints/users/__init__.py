from flask import Blueprint

bp = Blueprint("users", __name__)

from . import routes, commands