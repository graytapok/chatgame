possible_wins = (
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],

    ["1", "4", "7"],
    ["2", "5", "8"],
    ["3", "6", "9"],

    ["1", "5", "9"],
    ["7", "5", "3"]
)

class Game:
    def __init__(self, room):
        self.room = room
        self.rematch = {}
        self.fields = {}
        self.status = "playing"
        self.turn = "X"

        for i in range(1, 10):
            self.fields.update({str(i): ""})

    def __repr__(self):
        return f"<Game '{self.room}' | '{self.status}'>"

    def check_winner(self):
        for symbol in ["X", "O"]:
            for i in possible_wins:
                if self.fields[i[0]] == self.fields[i[1]] == self.fields[i[2]] == symbol:
                    return symbol

        counter = 0
        for i in range(1, 10):
            if self.fields[str(i)] != "":
                counter += 1

        if counter == 9:
            return "draw"

        return None

    def decide_rematch(self, sid, decision):
        self.rematch.update({sid: decision})

    def setup_rematch(self):
        self.turn = "X"
        self.fields = {}
        self.status = "playing"
        self.rematch = {}

        for i in range(1, 10):
            self.fields.update({str(i): ""})