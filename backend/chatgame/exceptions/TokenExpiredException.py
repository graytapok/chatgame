from chatgame.exceptions.ApiException import ApiException


class TokenExpiredException(ApiException):
    def __init__(self, token_name: str):
        super().__init__(status=410, message=f"{token_name} expired")