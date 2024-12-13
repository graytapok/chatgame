from flask_pydantic import validate
from flask_login import login_required, current_user

from ..users import bp, utils
from ..auth.deps import admin_required

from chatgame.db.dto import UserDto
from chatgame.db.models import UserModel
from chatgame.extensions import db

@bp.get("/me")
@login_required
@validate()
def get_current_user():
    return UserDto.model_validate(current_user), 200

@bp.get("/me/friends")
@login_required
@validate(response_many=True)
def get_friends():
    return [UserDto.model_validate(i) for i in current_user.friends]

@bp.post("/friends/<username>")
@login_required
@validate()
def add_friend(username: str):
    utils.add_fiend(current_user, username)
    return {}, 204

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