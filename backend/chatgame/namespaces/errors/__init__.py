from flask import Blueprint
from flask_restx import Namespace, marshal

ns = Namespace("errors")
bp = Blueprint("errors", __name__)

from . import handlers, resources
