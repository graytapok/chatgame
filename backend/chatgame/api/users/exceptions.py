class UserNotFound(Exception):
    def __init__(self, attribute: str):
        self.attribute = attribute