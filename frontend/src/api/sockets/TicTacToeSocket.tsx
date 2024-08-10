import { Button, Flex, Text } from "@radix-ui/themes";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

import {
  gameBegin,
  gameOver,
  madeMove,
  Opponent,
  opponentLeft,
  rematch,
  Turn,
  Winner,
} from "src/features/tictactoeSlice";
import { store } from "src/store";

interface OnGameBeginResponse {
  symbol: string;
  opponent: Opponent;
}

interface OnMadeMoveResponse {
  position: string;
  symbol: Turn;
  turn: Turn;
}

class TicTacToeSocket {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  makeMove = (id: string) => {
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
  };

  onGameOver = (data: { winner: Winner }) => {
    store.dispatch(gameOver({ winner: data.winner }));
  };

  onMadeMove = (data: OnMadeMoveResponse) => {
    store.dispatch(madeMove({ ...data }));
  };

  onOpponentLeft = () => {
    store.dispatch(opponentLeft());
  };

  onRematchAccepted = () => {
    const rematchStatus = store.getState().tictactoe.rematch;
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
          if (store.getState().tictactoe.rematch === "recieved") {
            this.rejectRematch();
          }
        },
      }
    );
  };
}

export default TicTacToeSocket;
