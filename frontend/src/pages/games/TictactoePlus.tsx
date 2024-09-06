import { useEffect } from "react";

import { manager } from "src/api/sockets";
import TictactoePlusSocket from "src/api/sockets/tictactoePlus";
import { reset } from "src/features/gamesSlice/tictactoePlusSlice";
import { useAppDispatch } from "src/hooks";

const socketListener = manager.socket("/tictactoe_plus");
const socket = new TictactoePlusSocket(socketListener);

const TictactoePlus = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socketListener.connect();

    socketListener.on("game_over", socket.onGameOver);
    socketListener.on("made_move", socket.onMadeMove);
    socketListener.on("game_begin", socket.onGameBegin);
    socketListener.on("opponent_left", socket.onOpponentLeft);
    socketListener.on("rematch_accepted", socket.onRematchAccepted);
    socketListener.on("rematch_rejected", socket.onRematchRejected);
    socketListener.on("rematch_request", socket.onRematchRequest);

    return () => {
      socketListener.off("game_over");
      socketListener.off("made_move");
      socketListener.off("game_begin");
      socketListener.off("opponent_left");
      socketListener.off("rematch_accepted");
      socketListener.off("rematch_rejected");
      socketListener.off("rematch_request");

      socketListener.disconnect();

      dispatch(reset());
    };
  });

  return <div>TictactoePlus</div>;
};

export default TictactoePlus;
