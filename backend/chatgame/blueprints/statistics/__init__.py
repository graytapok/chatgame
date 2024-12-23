from flask import Blueprint

bp = Blueprint("statistics", __name__)

from .StatisticsService import StatisticsService

from . import routes, commands


