class UserIsAuthorized(Exception):
    pass

class EmailIsNotConfirmed(Exception):
    pass

class EmailIsConfirmed(Exception):
    pass

class TokenExpired(Exception):
    pass

class InvalidToken(Exception):
    pass