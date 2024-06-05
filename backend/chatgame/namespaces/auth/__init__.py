from flask_restx import Namespace

auth_ns = Namespace("auth", description="Authentication operations")

from . import resources

auth_ns.add_resource(resources.Default, "/", endpoint="current_user")
auth_ns.add_resource(resources.Login, "/login", endpoint="login")
auth_ns.add_resource(resources.Logout, "/logout", endpoint="logout")
auth_ns.add_resource(resources.Register, "/register", endpoint="register")
auth_ns.add_resource(resources.ConfirmEmail, "/confirm_email", endpoint="confirm_email")
auth_ns.add_resource(resources.ForgotPassword, "/forgot_password", endpoint="forgot_password")
auth_ns.add_resource(resources.ChangePassword, "/change_password", endpoint="forgot_password_change")
auth_ns.add_resource(resources.ResendConfirmEmail, "/resend_email", endpoint="resend_email")
