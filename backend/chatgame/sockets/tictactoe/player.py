class Player:
    def __init__(self, sid, username, opponent_id, room=None):
        self.sid = sid
        self.room = room
        self.username = username
        self.opponent_id = opponent_id
        self.symbol = "X"

    def set_room(self, room):
        self.room = room

    def __repr__(self):
        return f"<Player '{self.username}' | '{self.sid}'>"