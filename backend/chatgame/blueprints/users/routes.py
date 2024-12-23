from flask_pydantic import validate
from flask_login import login_required, current_user

from ..users import bp, UsersService
from ..auth.deps import admin_required

from chatgame.db.dto import UserDto

@bp.get("/me")
@login_required
@validate()
def get_current_user():
    return UserDto.model_validate(current_user), 200

@bp.get("/")
@admin_required
@validate(response_many=True)
def get_all_users():
    users = UsersService.get_all_users()

    return [UserDto.model_validate(i) for i in users]

@bp.get("/<user_id>")
@admin_required
@validate()
def get_user(user_id: str):
    user = UsersService.get_user_or_throw(user_id)

    return UserDto.model_validate(user)