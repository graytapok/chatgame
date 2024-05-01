from flask_restx import fields

class NotFoundField(fields.String):
    def __init__(self, name: str, placeholder: str | None = None, **kwargs):
        self.name = name
        self.placeholder = placeholder
        self.example = f"{name} <{placeholder}> not found" if placeholder else f"{name} not found"
        self.default = f"{name} <{placeholder}> not found" if placeholder else f"{name} not found"
        super(NotFoundField, self).__init__(self.default, **kwargs)

    def format(self, value):
        if self.placeholder:
            return f"{self.name} {value} not found"
        else:
            return f"{self.default}"

    def __repr__(self):
        return self.example

class ValidationField(fields.String):
    def format(self, location):
        return f"Input {location} validation failed"
