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

export class TictactoePlusSocket {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  connectSockets = (socket: Socket) => {
    socket.connect();

    socket.on("made_move", this.onMadeMove);
    socket.on("game_over", this.onGameOver);
    socket.on("game_begin", this.onGameBegin);
    socket.on("field_winner", this.onFieldWinner);
    socket.on("opponent_left", this.onOpponentLeft);
    socket.on("rematch_accepted", this.onRematchAccepted);
    socket.on("rematch_rejected", this.onRematchRejected);
    socket.on("rematch_request", this.onRematchRequest);
  };

  removeSockets = (socket: Socket) => {
    socket.off("game_over", this.onGameOver);
    socket.off("made_move", this.onMadeMove);
    socket.off("game_begin", this.onGameBegin);
    socket.off("field_winner", this.onFieldWinner);
    socket.off("opponent_left", this.onOpponentLeft);
    socket.off("rematch_accepted", this.onRematchAccepted);
    socket.off("rematch_rejected", this.onRematchRejected);
    socket.off("rematch_request", this.onRematchRequest);

    socket.disconnect();

    store.dispatch(reset());
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
