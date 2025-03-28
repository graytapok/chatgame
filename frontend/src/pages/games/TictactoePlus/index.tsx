import { Flex, Heading } from "@radix-ui/themes";

import FinishButtons from "src/pages/games/Tictactoe/FinishButtons";
import Messages from "src/pages/games/TictactoePlus/Messages";
import Fields from "src/pages/games/TictactoePlus/Fields";
import Players from "src/pages/games/Tictactoe/Players";
import { TictactoePlusSocket } from "src/sockets";
import { useAppSelector } from "src/hooks";
import { Chat } from "src/components";

const TictactoePlus = () => {
  const tictactoePlus = useAppSelector((state) => state.games.tictactoePlus);
  const socketManager = new TictactoePlusSocket();

  socketManager.useSockets(tictactoePlus.counter);

  return (
    <>
      <Heading className="text-center m-10 mb-5" size="8">
        Tic Tac Toe Plus
      </Heading>

      <Players plus />

      <Flex justify="center" gap="6" className="h-[550px]">
        <Fields makeMove={socketManager.makeMove} />
        <Chat
          socket={socketManager.socket}
          loading={
            tictactoePlus.status === "searching" ||
            tictactoePlus.status === undefined
          }
          className="w-[400px]"
        />
      </Flex>

      <Messages />

      <FinishButtons plus requestRematch={socketManager.requestRematch} />
    </>
  );
};

export default TictactoePlus;
