from chatgame.extensions import ma
from chatgame.database.models import Room
from .user import UserSchema

class RoomSchema(ma.Schema):
    class Meta:
        model = Room

    id = ma.Str()
    type = ma.Str()
    capacity = ma.Int()
    users = ma.List(ma.Nested(UserSchema))
    createdAt = ma.Str(attribute="created_at")
