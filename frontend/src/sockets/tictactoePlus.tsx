import { Button, Flex, Text } from "@radix-ui/themes";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

import { store } from "src/store";
import {
  Opponent,
  Turn,
  Winner,
  gameBegin,
  gameOver,
  madeMove,
  opponentLeft,
  rematch,
  Symbol,
  fieldWinner,
} from "src/features/gamesSlice/tictactoePlusSlice";
import { addMessage } from "src/features/chatSlice";

interface OnGameBeginProps {
  symbol: string;
  opponent: Opponent;
}

interface OnMadeMoveProps {
  field: number;
  subField: number;
  symbol: Symbol;
  turn: Turn;
}

interface OnFieldWinnerProps {
  field: number;
  symbol: Symbol;
}

export class TictactoePlusSocket {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  makeMove = (field: number, subField: number) => {
    this.socket.emit("make_move", field, subField);
  };

  acceptRematch = () => {
    this.socket.emit("rematch", true);
  };

  rejectRematch = () => {
    this.socket.emit("rematch", false);
  };

  requestRematch = () => {
    store.dispatch(rematch({ type: "requested" }));
    this.socket.emit("rematch");
  };

  onGameBegin = (data: OnGameBeginProps) => {
    store.dispatch(
      gameBegin({
        playerSymbol: data.symbol,
        opponent: data.opponent,
        turn: { symbol: "X" },
      })
    );
    store.dispatch(
      addMessage({
        type: "info",
        message: `You and ${
          store.getState().games.tictactoePlus.opponent?.username
        } joined. The game begins!`,
      })
    );
  };

  onGameOver = (data: { winner: Winner }) => {
    store.dispatch(gameOver({ winner: data.winner }));
  };

  onMadeMove = (data: OnMadeMoveProps) => {
    store.dispatch(madeMove(data));
  };

  onFieldWinner = (data: OnFieldWinnerProps) => {
    store.dispatch(fieldWinner(data));
  };

  onOpponentLeft = () => {
    store.dispatch(opponentLeft());
  };

  onRematchAccepted = () => {
    const rematchStatus = store.getState().games.tictactoe.rematch;
    if (rematchStatus === "requested") {
      toast.success("Rematch request accepted!", { toastId: "rematch" });
    }
    store.dispatch(rematch({ type: "accepted" }));
  };

  onRematchRejected = () => {
    store.dispatch(rematch({ type: "rejected" }));
    toast.error("Rematch request rejectded!", { toastId: "rematch" });
  };

  onRematchRequest = () => {
    store.dispatch(rematch({ type: "recieved" }));
    toast.info(
      <Flex className="flex-col">
        <Text>Rematch request received!</Text>
        <Flex className="gap-2">
          <Button size="1" onClick={this.acceptRematch} color="green">
            Accept
          </Button>
          <Button size="1" onClick={this.rejectRematch} color="red">
            Reject
          </Button>
        </Flex>
      </Flex>,
      {
        toastId: "rematchRecieved",
        onClose: () => {
          if (store.getState().games.tictactoe.rematch === "recieved") {
            this.rejectRematch();
          }
        },
      }
    );
  };
}
