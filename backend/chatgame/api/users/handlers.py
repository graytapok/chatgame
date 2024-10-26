from .exceptions import UserNotFound
from ..users import bp

@bp.app_errorhandler(UserNotFound)
def user_not_found(e: UserNotFound):
    return {"detail": f"User '{e.attribute}' not found"}, 404