from chatgame.exceptions.ApiException import ApiException


class NotFoundException(ApiException):
    def __init__(self, model: str, value: str):
        super().__init__(status=404, message=f"{model} '{value}' not found")