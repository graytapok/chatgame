import { Button, Flex, Text } from "@radix-ui/themes";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

import { store } from "src/store";
import {
  gameBegin,
  gameOver,
  madeMove,
  MadeMoveProps,
  opponentLeft,
  rematch,
  Winner,
  GameBeginProps,
  reset,
} from "src/features/gamesSlice/tictactoeSlice";
import { addMessage } from "src/features/chatSlice";
import { useEffect } from "react";
import { manager } from ".";

export interface OnGameOverResponse {
  winner: Winner;
  X_elo?: number;
  O_elo?: number;
}

export class TictactoeSocket {
  socket: Socket;

  constructor() {
    this.socket = manager.socket("/tictactoe");
  }

  useSockets = (trigger: any) => {
    useEffect(() => {
      this.socket.connect();

      this.socket.on("game_over", this.onGameOver);
      this.socket.on("made_move", this.onMadeMove);
      this.socket.on("game_begin", this.onGameBegin);
      this.socket.on("opponent_left", this.onOpponentLeft);
      this.socket.on("rematch_accepted", this.onRematchAccepted);
      this.socket.on("rematch_rejected", this.onRematchRejected);
      this.socket.on("rematch_request", this.onRematchRequest);

      return () => {
        this.socket.off("game_over");
        this.socket.off("made_move");
        this.socket.off("game_begin");
        this.socket.off("opponent_left");
        this.socket.off("rematch_accepted");
        this.socket.off("rematch_rejected");
        this.socket.off("rematch_request");

        this.socket.disconnect();

        store.dispatch(reset());
      };
    }, [trigger]);
  };

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

  onGameBegin = (data: GameBeginProps) => {
    store.dispatch(gameBegin(data));
    store.dispatch(
      addMessage({
        type: "info",
        message: `You and ${
          store.getState().games.tictactoe.opponent?.username
        } joined. The game begins!`,
      })
    );
  };

  onGameOver = (data: OnGameOverResponse) => {
    store.dispatch(
      gameOver({
        winner: data.winner,
        diffXElo: data.X_elo,
        diffOElo: data.O_elo,
      })
    );
  };

  onMadeMove = (data: MadeMoveProps) => {
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
