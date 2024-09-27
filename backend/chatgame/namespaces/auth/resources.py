from flask_restx import Resource, marshal
from flask_login import login_user, current_user, logout_user

from itsdangerous import BadSignature, SignatureExpired

from chatgame.extensions import safe_t
from chatgame.utils.email import *
from chatgame.utils.funcs import get_user_by_login
from chatgame.utils.errors import InvalidInput
from chatgame.utils.models import *
from chatgame.utils.decorators import no_login_required, login_required
from chatgame.database.models import User
from chatgame.database.models.user import user_validation
from chatgame.database.schemas import UserSchema

from ..auth import ns
from .parser import *
from .models import *


class Default(Resource):
    @login_required
    @ns.doc(description="Get current user")
    @ns.response(200, "Success", one_user_model)
    @ns.response(401, "Unauthorized", login_required_model)
    def get(self):
        return {"user": UserSchema().dump(current_user)}, 200


class Login(Resource):
    @no_login_required
    @ns.expect(login_parser)
    @ns.doc(description="Login user")
    @ns.response(200, "Success")
    @ns.response(400, "Bad request", invalid_input_model)
    @ns.response("403 (1)", "Forbidden", no_login_required_model)
    @ns.response("403 (2)", "Forbidden", email_required_model)
    def post(self):
        args = login_parser.parse_args()

        user = get_user_by_login(args["login"])

        if user is None or not user.check_password(args["password"]):
            raise InvalidInput()
        elif user.email_confirmed is not True:
            return marshal({}, email_required_model), 403
        else:
            login_user(user, remember=args["remember"] or False)
            return {}


class Logout(Resource):
    @login_required
    @ns.doc(description="Logout user")
    @ns.response(200, "Success")
    @ns.response(401, "Unauthorized", login_required_model)
    def get(self):
        logout_user()
        return {}, 200


class Register(Resource):
    @no_login_required
    @ns.expect(register_parser)
    @ns.doc(description="Register user")
    @ns.response(201, "Created")
    @ns.response(400, "Bad request", validation_model)
    @ns.response(403, "Forbidden", no_login_required_model)
    def post(self):
        json = register_parser.parse_args()

        user_validation(
            username=json["username"],
            email=json["email"],
            password=json["password"],
            confirm_password=json["confirm_password"],
        )

        token = safe_t.dumps(json["email"], salt="email-confirm/email")

        user = User(
            username=json["username"],
            email=json["email"],
            verification_token=token,
        )
        user.set_password(json["password"])
        user.save()

        send_registration_email(user.email, user.id, user.verification_token)

        return {}, 201


class ConfirmEmail(Resource):
    @no_login_required
    @ns.expect(email_parser)
    @ns.doc(description="Confirm user email")
    @ns.response(200, "Success")
    @ns.response(400, "Bad Request", invalid_input_model)
    @ns.response(403, "Forbidden", no_login_required_model)
    @ns.response(404, "Not Found", user_not_found_model)
    @ns.response(410, "Expired", token_expired_model)
    def get(self):
        args = email_parser.parse_args()

        user_hash = args["user_hash"]
        token = args["token"]

        try:
            user_id = safe_t.loads(user_hash, salt="email-confirm/user", max_age=60 * 10)
        except SignatureExpired:
            return marshal({}, token_expired_model), 410
        except BadSignature:
            raise InvalidInput(userId="invalid")

        user = User.objects(id=user_id).first()
        if user is None:
            return marshal({"user_id": user_id}, user_not_found_model), 404

        try:
            safe_t.loads(token, salt="email-confirm/email", max_age=60 * 10)
            if user.email_confirmed:
                return marshal({}, no_login_required_model), 403
            elif user.verification_token == token:
                user.update(verification_token="", email_confirmed=True)
                login_user(user, remember=True)
            else:
                return marshal({}, token_expired_model), 410
        except SignatureExpired:
            return marshal({}, token_expired_model), 410
        except BadSignature:
            raise InvalidInput(token="invalid")
        return {}


class ResendConfirmEmail(Resource):
    @no_login_required
    @ns.expect(resend_parser)
    @ns.doc(description="Resend confirm email")
    @ns.response(200, "Success")
    @ns.response(400, "Bad Request", validation_model)
    @ns.response(403, "Forbidden", no_login_required_model)
    @ns.response(404, "Not Found", user_not_found_model)
    def post(self):
        json = resend_parser.parse_args()

        user = get_user_by_login(json["login"])

        if user is not None:
            if user.email_confirmed:
                return marshal({}, email_already_confirmed_model), 403
            else:
                token = safe_t.dumps(user.email, salt="email-confirm/email")
                user.update(verification_token=token)
                send_registration_email(user.email, user.id, token)
                return {}, 200
        else:
            return marshal({"user_id": json["login"]}, user_not_found_model), 404


class ForgotPassword(Resource):
    @ns.expect(forgot_parser)
    @ns.doc(description="Forgot password")
    @ns.response(200, "Success")
    @ns.response(400, "Bad Request", validation_model)
    @ns.response(404, "Not Found", user_not_found_model)
    def post(self):
        json = forgot_parser.parse_args()

        user = get_user_by_login(json["login"])

        if user is not None:
            token = safe_t.dumps(user.email, salt="password-change/email")
            send_change_password_email(user.email, user.id, token)
            user.update(password_token=token)
        else:
            return marshal({"user_id": json["login"]}, user_not_found_model), 404

        return {}

class ChangePassword(Resource):
    @ns.expect(change_parser)
    @ns.doc(description="Change password")
    @ns.response(200, "Success")
    @ns.response(400, "Bad Request", validation_model)
    @ns.response(403, "Forbidden", email_required_model)
    @ns.response(404, "Not Found", user_not_found_model)
    @ns.response(410, "Expired", token_expired_model)
    def post(self):
        args = change_parser.parse_args()

        if current_user.is_authenticated:
            user_validation(
                password=args["password"],
                confirm_password=args["confirm_password"]
            )

            if not current_user.email_confirmed:
                return marshal({}, email_required_model), 403

            new_password_hash = current_user.set_password(args["password"])
            current_user.update(password_token="", password_hash=new_password_hash)
        else:
            token_args = change_parser_u_t.parse_args()
            try:
                user_id = safe_t.loads(token_args["user_hash"], salt="password-change/user", max_age=60 * 10)
            except SignatureExpired:
                return marshal({}, token_expired_model), 410
            except BadSignature:
                raise InvalidInput(userId="invalid")

            user = User.objects(id=user_id).first()
            if user is None:
                return marshal({"user_id": user_id}, user_not_found_model), 404

            user_validation(
                password=args["password"],
                confirm_password=args["confirm_password"]
            )

            try:
                safe_t.loads(token_args["token"], salt="password-change/email", max_age=60 * 10)
                if not user.email_confirmed:
                    return marshal({}, email_required_model), 403
                elif user.password_token == token_args["token"]:
                    new_password_hash = user.set_password(args["password"])
                    user.update(password_token="", password_hash=new_password_hash)
                    login_user(user, remember=True)
                else:
                    return marshal({}, token_expired_model), 410
            except SignatureExpired:
                return marshal({}, token_expired_model), 410
            except BadSignature:
                raise InvalidInput(token="invalid")

        return {}
