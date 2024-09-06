import { useEffect } from "react";
import { Flex, Heading } from "@radix-ui/themes";

import Chat from "src/components/Chat";
import { manager } from "src/api/sockets";
import TictactoeSocket from "src/api/sockets/tictactoe";
import Fields from "src/components/games/tictactoe/Fields";
import { useAppDispatch, useAppSelector } from "src/hooks";
import Players from "src/components/games/tictactoe/Players";
import { reset } from "src/features/gamesSlice/tictactoeSlice";
import Messages from "src/components/games/tictactoe/Messages";
import FinishButtons from "src/components/games/tictactoe/FinishButtons";

const socketListener = manager.socket("/tictactoe");
const socket = new TictactoeSocket(socketListener);

function Tictactoe() {
  const tictactoe = useAppSelector((state) => state.games.tictactoe);
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
  }, [tictactoe.nextGame]);

  return (
    <>
      <Heading className="text-center m-10 mb-5" size="8">
        Tic Tac Toe
      </Heading>

      <Players />

      <Flex justify="center" gap="6" className="h-[400px]">
        <Fields makeMove={socket.makeMove} />
        <Chat
          namespace="/tictactoe"
          loading={
            tictactoe.status === "searching" || tictactoe.status === undefined
          }
          className="w-[400px]"
        />
      </Flex>

      <Messages />

      <FinishButtons requestRematch={socket.requestRematch} />
    </>
  );
}

export default Tictactoe;
