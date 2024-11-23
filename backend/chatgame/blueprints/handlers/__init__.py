from flask import Blueprint

bp = Blueprint("handlers", __name__)

from . import routes