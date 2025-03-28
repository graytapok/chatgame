import { Flex, Heading } from "@radix-ui/themes";

import { Chat } from "src/components";
import { TictactoeSocket } from "src/sockets";
import Fields from "src/pages/games/Tictactoe/Fields";
import { useAppSelector } from "src/hooks";
import Players from "src/pages/games/Tictactoe/Players";
import Messages from "src/pages/games/Tictactoe/Messages";
import FinishButtons from "src/pages/games/Tictactoe/FinishButtons";

function Tictactoe() {
  const tictactoe = useAppSelector((state) => state.games.tictactoe);
  const socketManager = new TictactoeSocket();

  socketManager.useSockets(tictactoe.counter);

  return (
    <>
      <Heading className="text-center m-10 mb-5" size="8">
        Tic Tac Toe
      </Heading>

      <Players />

      <Flex justify="center" gap="6" className="h-[400px]">
        <Fields makeMove={socketManager.makeMove} />
        <Chat
          socket={socketManager.socket}
          loading={
            tictactoe.status === "searching" || tictactoe.status === undefined
          }
          className="w-[400px]"
        />
      </Flex>

      <Messages />

      <FinishButtons requestRematch={socketManager.requestRematch} />
    </>
  );
}

export default Tictactoe;
