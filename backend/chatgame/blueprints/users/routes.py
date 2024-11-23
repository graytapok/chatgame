from flask_pydantic import validate
from flask_login import login_required, current_user

from ..auth.deps import admin_required
from ..users import bp, utils
from ..statistics import utils as statistics_utils

from chatgame.dto import UserDto, TotalStatisticsDto
from chatgame.models import UserModel
from chatgame.extensions import db

@bp.get("/me")
@login_required
@validate()
def get_current_user():
    return UserDto.model_validate(current_user), 200

@bp.get("/")
@admin_required
@validate(response_many=True)
def get_users():
    query = db.session.query(UserModel).all()
    users = []

    for user in query:
        users.append(UserDto.model_validate(user))

    return users

@bp.get("/<user_id>")
@admin_required
@validate()
def get_user(user_id: str):
    user = utils.get_user_or_throw(user_id)

    return UserDto.model_validate(user)

@bp.get("/<user_id>/statistics")
@admin_required
@validate()
def get_user_statistics(user_id: str):
    statistics = statistics_utils.get_user_total_statistics(user_id)

    return TotalStatisticsDto.model_validate(statistics)