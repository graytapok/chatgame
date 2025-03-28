import { Button, Flex, Text } from "@radix-ui/themes";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

import { store } from "src/store";
import {
  gameBegin,
  gameOver,
  madeMove,
  opponentLeft,
  rematch,
  fieldWinner,
  MadeMoveProps,
  FieldWinnerProps,
  reset,
} from "src/features/gamesSlice/tictactoePlusSlice";
import { addMessage } from "src/features/chatSlice";
import { GameBeginProps } from "src/features/gamesSlice/tictactoeSlice";
import { OnGameOverResponse } from "./tictactoe";
import { useEffect } from "react";
import { manager } from ".";

export class TictactoePlusSocket {
  socket: Socket;

  constructor() {
    this.socket = manager.socket("/tictactoe_plus");
  }

  useSockets = (trigger: any) => {
    useEffect(() => {
      this.socket.connect();

      this.socket.on("made_move", this.onMadeMove);
      this.socket.on("game_over", this.onGameOver);
      this.socket.on("game_begin", this.onGameBegin);
      this.socket.on("field_winner", this.onFieldWinner);
      this.socket.on("opponent_left", this.onOpponentLeft);
      this.socket.on("rematch_accepted", this.onRematchAccepted);
      this.socket.on("rematch_rejected", this.onRematchRejected);
      this.socket.on("rematch_request", this.onRematchRequest);

      return () => {
        this.socket.off("game_over", this.onGameOver);
        this.socket.off("made_move", this.onMadeMove);
        this.socket.off("game_begin", this.onGameBegin);
        this.socket.off("field_winner", this.onFieldWinner);
        this.socket.off("opponent_left", this.onOpponentLeft);
        this.socket.off("rematch_accepted", this.onRematchAccepted);
        this.socket.off("rematch_rejected", this.onRematchRejected);
        this.socket.off("rematch_request", this.onRematchRequest);

        this.socket.disconnect();

        store.dispatch(reset());
      };
    }, [trigger]);
  };

  makeMove = (field: number, subField: number) => {
    this.socket.emit("make_move_plus", field, subField);
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
          store.getState().games.tictactoePlus.opponent?.username
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

  onFieldWinner = (data: FieldWinnerProps) => {
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
