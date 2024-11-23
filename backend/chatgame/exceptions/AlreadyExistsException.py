from chatgame.exceptions.ApiException import ApiException


class AlreadyExistsException(ApiException):
    def __init__(self, model: str, value: str):
        super().__init__(status=400, message=f"{model} '{value}' already exists")