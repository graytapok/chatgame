from typing import Literal
from pydantic import BaseModel

from chatgame.constants import tictactoe_possible_wins

class TictactoeGame(BaseModel):
    room: str
    rematch: dict[str, bool] = {}
    fields: list[Literal["X", "O"] | None] = [None for i in range(0, 9)]
    status: Literal["playing", "finished"] = "playing"
    turn: Literal["X", "O"] | None = "X"

    def check_winner(self) -> Literal["X", "O", "draw"] | None:
        for symbol in ["X", "O"]:
            for i in tictactoe_possible_wins:
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