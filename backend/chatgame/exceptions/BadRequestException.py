from chatgame.exceptions import ApiException


class BadRequestException(ApiException):
    def __init__(self, message: str):
        super().__init__(status=400, message=message)