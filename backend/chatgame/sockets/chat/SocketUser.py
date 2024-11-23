import random


class SocketUser:
    def __init__(self, sid, username=None):
        self.sid = sid
        self.username = username or random.randint()
        self.room = None