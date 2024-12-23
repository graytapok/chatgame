from chatgame.exceptions.ApiException import ApiException


class NotFoundException(ApiException):
    def __init__(self, model: str, value: any):
        super().__init__(status=404, message=f"{model} '{str(value)}' not found")