import { Button, Flex, Text } from "@radix-ui/themes";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

import { store } from "src/store";
import {
  gameBegin,
  gameOver,
  madeMove,
  Opponent,
  opponentLeft,
  rematch,
  Symbol,
  Winner,
} from "src/features/gamesSlice/tictactoeSlice";
import { addMessage } from "src/features/chatSlice";

export interface OnGameBeginResponse {
  symbol: string;
  opponent: Opponent;
}

interface OnMadeMoveResponse {
  turn: Symbol;
  position: number;
  symbol: Symbol;
}

export class TictactoeSocket {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  makeMove = (id: number) => {
    this.socket.emit("make_move", id);
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

  onGameBegin = (data: OnGameBeginResponse) => {
    store.dispatch(
      gameBegin({
        playerSymbol: data.symbol,
        opponent: data.opponent,
        turn: "X",
      })
    );
    store.dispatch(
      addMessage({
        type: "info",
        message: `You and ${
          store.getState().games.tictactoe.opponent?.username
        } joined. The game begins!`,
      })
    );
  };

  onGameOver = (data: { winner: Winner }) => {
    store.dispatch(gameOver({ winner: data.winner }));
  };

  onMadeMove = (data: OnMadeMoveResponse) => {
    store.dispatch(madeMove(data));
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
