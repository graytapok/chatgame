from chatgame.exceptions import ApiException

class FulfilledException(ApiException):
    def __init__(self):
        super().__init__(400, "Payment is fulfilled.")