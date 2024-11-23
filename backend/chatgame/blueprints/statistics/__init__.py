from flask import Blueprint

bp = Blueprint("statistics", __name__)

from . import routes, commands