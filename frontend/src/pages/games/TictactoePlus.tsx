import { Flex, Heading } from "@radix-ui/themes";
import { useEffect } from "react";

import Chat from "src/components/Chat";
import { manager as socketManager } from "src/api/sockets";
import { useAppDispatch, useAppSelector } from "src/hooks";
import Players from "src/components/games/tictactoe/Players";
import TictactoePlusSocket from "src/api/sockets/tictactoePlus";
import Fields from "src/components/games/tictactoe-plus/Fields";
import { reset } from "src/features/gamesSlice/tictactoePlusSlice";
import Messages from "src/components/games/tictactoe-plus/Messages";
import FinishButtons from "src/components/games/tictactoe/FinishButtons";

const socket = socketManager.socket("/tictactoe_plus");
const manager = new TictactoePlusSocket(socket);

const TictactoePlus = () => {
  const tictactoePlus = useAppSelector((state) => state.games.tictactoePlus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.connect();

    socket.on("game_over", manager.onGameOver);
    socket.on("made_move", manager.onMadeMove);
    socket.on("game_begin", manager.onGameBegin);
    socket.on("field_winner", manager.onFieldWinner);
    socket.on("opponent_left", manager.onOpponentLeft);
    socket.on("rematch_accepted", manager.onRematchAccepted);
    socket.on("rematch_rejected", manager.onRematchRejected);
    socket.on("rematch_request", manager.onRematchRequest);

    return () => {
      socket.off("game_over", manager.onGameOver);
      socket.off("made_move", manager.onMadeMove);
      socket.off("game_begin", manager.onGameBegin);
      socket.off("field_winner", manager.onFieldWinner);
      socket.off("opponent_left", manager.onOpponentLeft);
      socket.off("rematch_accepted", manager.onRematchAccepted);
      socket.off("rematch_rejected", manager.onRematchRejected);
      socket.off("rematch_request", manager.onRematchRequest);

      socket.disconnect();

      dispatch(reset());
    };
  }, [tictactoePlus.nextGame]);

  return (
    <>
      <Heading className="text-center m-10 mb-5" size="8">
        Tic Tac Toe Plus
      </Heading>

      <Players plus />

      <Flex justify="center" gap="6" className="h-[550px]">
        <Fields makeMove={manager.makeMove} />
        <Chat
          socket={socket}
          loading={
            tictactoePlus.status === "searching" ||
            tictactoePlus.status === undefined
          }
          className="w-[400px]"
        />
      </Flex>

      <Messages />

      <FinishButtons plus requestRematch={manager.requestRematch} />
    </>
  );
};

export default TictactoePlus;
