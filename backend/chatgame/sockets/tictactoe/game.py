from typing import Literal

from pydantic import BaseModel

possible_wins = (
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
)

class Game(BaseModel):
    room: str
    rematch: dict[str, bool] = {}
    fields: list[Literal["X", "O"] | None] = [None for i in range(0, 9)]
    status: Literal["playing", "finished"] = "playing"
    turn: Literal["X", "O"] | None = "X"

    def check_winner(self):
        for symbol in ["X", "O"]:
            for i in possible_wins:
                if self.fields[i[0]] == self.fields[i[1]] == self.fields[i[2]] == symbol:
                    return symbol

        counter = 0
        for i in range(0, 9):
            if self.fields[i]:
                counter += 1

        if counter == 9:
            return "draw"

        return None

    def decide_rematch(self, sid: str, decision: bool):
        self.rematch.update({sid: decision})

    def setup_rematch(self):
        self.turn = "X"
        self.fields = [None for i in range(0, 9)]
        self.status = "playing"
        self.rematch = {}