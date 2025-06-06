from flask_pydantic import validate

from . import bp
from .dto import InviteBody


@bp.post()
@validate()
def invite(body: InviteBody):
    pass