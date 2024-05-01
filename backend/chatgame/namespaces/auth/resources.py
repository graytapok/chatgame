from flask import redirect, url_for
from flask_restx import Resource, marshal
from flask_login import login_user, current_user, logout_user

from email_validator import EmailNotValidError, validate_email
from itsdangerous import BadSignature, SignatureExpired

from chatgame.extensions import safe, db
from chatgame.utils.email import send_registration_email
from chatgame.utils.funcs import get_user_by_login
from chatgame.utils.errors import InvalidInput
from chatgame.utils.models import *
from chatgame.utils.decorators import no_login_required, login_required
from chatgame.database.models import User
from chatgame.database.models.user import user_validation
from chatgame.database.schemas import UserSchema

from ..auth import auth_ns
from .parser import *
from .models import *

class Default(Resource):
    @login_required
    @auth_ns.doc(description="Get current user")
    @auth_ns.response(200, "Success", one_user_model)
    @auth_ns.response(401, "Unauthorized", login_required_model)
    def get(self):
        return {"user": UserSchema().dump(current_user)}, 200

class Login(Resource):
    @no_login_required
    @auth_ns.expect(login_parser)
    @auth_ns.doc(description="Login user")
    @auth_ns.response(200, "Success", one_user_model)
    @auth_ns.response(400, "Bad request", invalid_input_model)
    @auth_ns.response(403, "Forbidden", no_login_required_model)
    def post(self):
        args = login_parser.parse_args()

        user = get_user_by_login(args["login"])

        if user is None or not user.check_password(args["password"]) or user.email_confirmed is not True:
            raise InvalidInput()
        else:
            login_user(user, remember=args["remember"])
            return redirect(url_for("current_user"))

class Logout(Resource):
    @login_required
    @auth_ns.doc(description="Logout user")
    @auth_ns.response(200, "Success")
    @auth_ns.response(401, "Unauthorized", login_required_model)
    def get(self):
        logout_user()
        return {}, 200

class Register(Resource):
    @no_login_required
    @auth_ns.expect(register_parser)
    @auth_ns.doc(description="Register user")
    @auth_ns.response(201, "Created")
    @auth_ns.response(400, "Bad request", validation_model)
    @auth_ns.response(403, "Forbidden", no_login_required_model)
    def post(self):
        json = register_parser.parse_args()

        user_validation(
            username=json["username"],
            email=json["email"],
            password=json["password"],
            confirm_password=json["confirm_password"],
        )

        token = safe.dumps(json["email"], salt="email-confirm/email")

        user = User(username=json["username"], email=json["email"])
        user.set_password(json["password"])
        user.verification_token = token
        user.save(user)

        send_registration_email(user.email, user.id, user.verification_token)

        return {}, 201

class ConfirmEmail(Resource):
    @no_login_required
    @auth_ns.expect(email_parser)
    @auth_ns.doc(description="Confirm user email")
    @auth_ns.response(200, "Success", one_user_model)
    @auth_ns.response(400, "Bad Request", invalid_input_model)
    @auth_ns.response(403, "Forbidden", no_login_required_model)
    @auth_ns.response(404, "Not Found", user_not_found_model)
    @auth_ns.response(410, "Expired", token_expired_model)
    def get(self):
        args = email_parser.parse_args()

        user_hash = args["user_hash"]
        token = args["token"]

        try:
            user_id = safe.loads(user_hash, salt="email-confirm/user", max_age=60 * 10)
        except SignatureExpired:
            return marshal({}, token_expired_model), 410
        except BadSignature:
            raise InvalidInput(userId="invalid")

        user = User.objects(id=user_id).first()
        if user is None:
            return marshal({"user_id": user_id}, user_not_found_model), 404

        try:
            t = safe.loads(token, salt="email-confirm/email", max_age=60 * 10)
            if user.email_confirmed:
                login_user(user)
            elif user.verification_token == token:
                user.update(verification_token="", email_confirmed=True)
                login_user(user, remember=True)
            else:
                return marshal({}, token_expired_model), 410
        except SignatureExpired:
            return marshal({}, token_expired_model), 410
        except BadSignature:
            raise InvalidInput(token="invalid")
        return redirect(url_for("current_user"))

class ResendConfirmEmail(Resource):
    @no_login_required
    @auth_ns.expect(resend_parser)
    @auth_ns.doc(description="Resend confirm email")
    @auth_ns.response(200, "Success")
    @auth_ns.response(400, "Bad Request", validation_model)
    @auth_ns.response(403, "Forbidden", no_login_required_model)
    @auth_ns.response(404, "Not Found", user_not_found_model)
    def get(self):
        json = resend_parser.parse_args()

        user = get_user_by_login(json["login"])

        if user is not None:
            if user.email_confirmed:
                return marshal({}, email_already_confirmed_model), 403
            else:
                token = safe.dumps(user.email, salt="email-confirm/email")
                user.update(verification_token=token)
                send_registration_email(user.email, user.id, token)
                return {}, 200
        else:
            return marshal({"user_id": json["login"]}, user_not_found_model), 404

# Not Ready
class ForgotPassword(Resource):
    def get(self):
        user = get_user_by_login(login)

        if user is not None:
            user.verification_token = send_change_password_email(user.email)
            db.session.commit()
        else:
            message = "user not found"

        return {}

# Not Ready
class ChangePassword(Resource):
    def get(self):
        email = ""
        message = ""
        data = {}

        password = request.json["password"]
        confirm_password = request.json["confirmPassword"]

        try:
            v = validate_email(email)
            email = v["email"]
            user = User.query.filter_by(email=email).first()
            if user is None:
                message = "user not found"
        except EmailNotValidError:
            message = "email is not valid"

        if message == "":
            try:
                itsdanger = safe.loads(token, salt="password-change", max_age=60 * 15)

                # Password: 8-units, letters, capitals, numbers
                if (len(password) < 8
                        or password.isalpha()
                        or password.isdigit()
                        or password.islower()
                        or password.isupper()):
                    data.update({"password": False})

                # Confirm Password: must be equal to password
                if confirm_password != password:
                    data.update({"confirmPassword": False})

                if user.verification_token == token and len(data) == 0:
                    user.email_confirmed = True
                    user.verification_token = ""
                    user.set_password(password)
                    db.session.commit()
                    if not current_user.is_authenticated:
                        login_user(user, remember=True)
                else:
                    if len(data) != 0:
                        message = "incorrect input"
                    else:
                        message = "token is expired"
            except SignatureExpired:
                message = "token is expired"
            except BadSignature:
                message = "token is incorrect"

        return {}