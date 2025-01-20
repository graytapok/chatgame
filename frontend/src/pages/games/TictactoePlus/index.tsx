import { Flex, Heading } from "@radix-ui/themes";
import { useEffect } from "react";

import FinishButtons from "src/pages/games/Tictactoe/FinishButtons";
import Messages from "src/pages/games/TictactoePlus/Messages";
import Fields from "src/pages/games/TictactoePlus/Fields";
import Players from "src/pages/games/Tictactoe/Players";
import { manager as socketManager } from "src/sockets";
import { TictactoePlusSocket } from "src/sockets";
import { useAppSelector } from "src/hooks";
import { Chat } from "src/components";

const socket = socketManager.socket("/tictactoe_plus");
const manager = new TictactoePlusSocket(socket);

const TictactoePlus = () => {
  const tictactoePlus = useAppSelector((state) => state.games.tictactoePlus);

  useEffect(() => {
    manager.connectSockets(socket);

    return () => {
      manager.removeSockets(socket);
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
