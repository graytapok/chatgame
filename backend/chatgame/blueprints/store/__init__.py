from flask import Blueprint

bp = Blueprint("store", __name__)

from . import routes, jobs