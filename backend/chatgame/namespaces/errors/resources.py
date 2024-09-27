from flask_restx import marshal

from chatgame.utils import errors
from chatgame.utils.models import *

from ..errors import ns

@ns.errorhandler(errors.LoginRequired)
def error(e):
    return marshal({}, login_required_model), 401

@ns.errorhandler(errors.NoLoginRequired)
def error(e):
    return marshal({}, no_login_required_model), 403

@ns.errorhandler(errors.InvalidInput)
@ns.marshal_with(invalid_input_model, skip_none=True)
def error(e):
    invalid_input_error = {}
    if len(e.__dict__) != 0:
        for i in e.__dict__:
            if e.__dict__[i] is not None:
                invalid_input_error.update({i: e.__dict__[i]})
    return {"errors": invalid_input_error if len(e.__dict__) != 0 else None}, 400

@ns.errorhandler(errors.ValidationError)
def error(e):
    message = e.message if e.message else "validation failed"
    e_errors = e.to_dict()
    return marshal(
        {
            "message": message,
            "errors": e_errors if len(e_errors) != 0 else None
        },
        validation_model,
        skip_none=True
    ), 400
