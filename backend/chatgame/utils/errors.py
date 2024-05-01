class BadException(Exception):
    def __init__(self, *args):
        self.list = []

        for i in args:
            self.list.append(i)

class LoginRequired(Exception):
    pass

class NoLoginRequired(Exception):
    pass

class EmailConfirmationRequired(Exception):
    def __init__(self, email: str):
        self.email = email

class InvalidInput(Exception):
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

class ValidationError(Exception):
    def __init__(self, message=None, field_name=None, errors=None):
        self.field_name = field_name
        self.errors = errors
        self.message = message

    def __repr__(self):
        if self.errors:
            return f"<Validation Error: {self.message} - {self.errors}>"
        return f"<Validation Error: {self.field_name} - {self.message}>"

    def to_dict(self):
        errors = {}

        if self.errors:
            for e in self.errors:
                if e.errors and e.field_name:
                    errors.update({e.field_name: e.to_dict()})
                elif e.field_name and e.message:
                    errors.update({e.field_name: e.message})

        return errors
