from flask import Blueprint

bp = Blueprint("friends", __name__)

from .FriendsService import FriendsService

from . import routes, jobs