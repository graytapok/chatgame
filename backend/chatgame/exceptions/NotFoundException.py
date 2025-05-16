from chatgame.exceptions.ApiException import ApiException


class NotFoundException(ApiException):
    def __init__(self, model: str, value: any = None):
        if value:
            super().__init__(status=404, message=f"{model} '{str(value)}' not found")

        else:
            super().__init__(status=404, message=f"{model} not found")