import { useEffect } from "react";
import { Flex, Heading } from "@radix-ui/themes";

import { Chat } from "src/components";
import { manager } from "src/sockets";
import { TictactoeSocket } from "src/sockets";
import Fields from "src/pages/games/Tictactoe/Fields";
import { useAppSelector } from "src/hooks";
import Players from "src/pages/games/Tictactoe/Players";
import Messages from "src/pages/games/Tictactoe/Messages";
import FinishButtons from "src/pages/games/Tictactoe/FinishButtons";

const socketListener = manager.socket("/tictactoe");
const socket = new TictactoeSocket(socketListener);

function Tictactoe() {
  const tictactoe = useAppSelector((state) => state.games.tictactoe);

  useEffect(() => {
    socket.connectSockets(socketListener);

    return () => {
      socket.removeSockets(socketListener);
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
          socket={socketListener}
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
