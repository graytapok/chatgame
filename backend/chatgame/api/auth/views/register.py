from flask.views import MethodView
from flask_pydantic import validate
from pydantic import BaseModel, EmailStr, Field

from chatgame.api.auth.deps import no_login_required
from chatgame.extensions import safe
from chatgame.db.utils import check_email_available, check_username_available
from chatgame.db.models import User
from chatgame.api.auth.utils import send_registration_email


class RegisterProps(BaseModel):
    username: str = Field(min_length=3)
    email: EmailStr
    password: str = Field(min_length=8)

class Register(MethodView):
    init_every_request = False

    @no_login_required
    @validate()
    def post(self, body: RegisterProps):
        detail = {}

        if not check_username_available(body.username):
            detail.update(username=f"Username '{body.username}' is already taken")

        if not check_email_available(body.email):
            detail.update(email=f"Email '{body.email}' is already in use")

        if detail:
            return {"detail": detail}, 400

        token = safe.dumps(body.email, salt="email-confirm/email")

        user = User(
            username=body.username,
            email=body.email,
            verification_token=token,
        )
        user.set_password(body.password)
        user.save()

        send_registration_email(user.email, user.id, user.verification_token)

        return {}, 201
