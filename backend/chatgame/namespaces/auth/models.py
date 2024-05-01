from chatgame.extensions import api
from chatgame.utils.fields import NotFoundField

__all__ = (
    "user_not_found_model",
)

user_not_found_model = api.model(
    "User Not Found",
    {
        "message": NotFoundField("user", placeholder="id", attribute="user_id")
    }
)