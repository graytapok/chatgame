from chatgame.exceptions.ApiException import ApiException


class InvalidTokenException(ApiException):
    def __init__(self, token_name: str):
        super().__init__(status=400, message=f"{token_name} is invalid")