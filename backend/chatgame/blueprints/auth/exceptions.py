from chatgame.exceptions import ApiException


class EmailIsNotConfirmedException(ApiException):
    def __init__(self):
        super().__init__(403, message="Email is not confirmed")

class InvalidCredentialsException(ApiException):
    def __init__(self):
        super().__init__(401, message="Invalid credentials")

class ForbiddenException(ApiException):
    def __init__(self):
        super().__init__(403, message="Forbidden")