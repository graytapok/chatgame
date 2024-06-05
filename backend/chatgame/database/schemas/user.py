from chatgame.database.models import User
from chatgame.extensions import ma

class UserSchema(ma.Schema):
    class Meta:
        model = User

    id = ma.Str()
    username = ma.Str(attribute="username")
    email = ma.Str()
    emailConfirmed = ma.Boolean(attribute="email_confirmed")
    admin = ma.Boolean()
