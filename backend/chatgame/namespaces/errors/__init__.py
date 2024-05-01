from flask import Blueprint
from flask_restx import Namespace, marshal

errors_ns = Namespace("errors")
errors_bp = Blueprint("errors", __name__)

from . import handlers, resources
