import { ChangeEvent, useEffect, useState } from "react";
import { Flex, Heading } from "@radix-ui/themes";

import {
  gameBegin,
  gameOver,
  madeMove,
  opponentLeft,
  reset,
} from "src/features/tictactoeSlice";
import Chat from "src/components/Chat";
import { manager } from "src/api/socket";
import Button from "src/components/ui/Button";
import Fields from "src/components/game/tictactoe/Fields";
import { useAppDispatch, useAppSelector } from "src/hooks";
import Players from "src/components/game/tictactoe/Players";
import Messages from "src/components/game/tictactoe/Messages";
import type { Winner, Turn } from "src/features/tictactoeSlice";
import FinishButtons from "src/components/game/tictactoe/FinishButtons";

export const socket = manager.socket("/tictactoe");

interface Opponent {
  username: string;
  symbol: string;
}

interface OnGameBeginResponse {
  symbol: string;
  opponent: Opponent;
}

interface OnMadeMoveResponse {
  position: string;
  symbol: string;
  turn: Turn;
}

function TicTacToe() {
  const tictactoe = useAppSelector((state) => state.tictactoe);
  const dispatch = useAppDispatch();

  const [fields, setFields] = useState<JSX.Element[]>([]);

  const generateFields = () => {
    const fields: JSX.Element[] = [];

    for (let i = 1; i < 10; i += 1) {
      fields.push(
        <Flex className="items-center justify-center" key={i}>
          <Button
            id={i.toString()}
            className="h-24 w-24 flex justify-center items-center"
            color="gray"
            variant="soft"
            highContrast={true}
            onClick={(e: ChangeEvent) => socket.emit("make_move", e.target.id)}
          />
        </Flex>
      );
    }

    return fields;
  };

  const onGameBegin = (data: OnGameBeginResponse) => {
    dispatch(
      gameBegin({
        playerSymbol: data.symbol,
        opponent: data.opponent,
        turn: "X",
      })
    );
  };

  const onGameOver = (data: { winner: Winner }) => {
    dispatch(gameOver({ winner: data.winner }));
  };

  const onMadeMove = (data: OnMadeMoveResponse) => {
    const field = document.getElementById(data.position);
    if (field) {
      field.textContent = data.symbol;
      const prevClassName = field.className;
      const newClassName = data.symbol === "X" ? " bg-blue-500" : " bg-red-500";
      field.className = prevClassName + newClassName;
      field.setAttribute("disabled", "");

      dispatch(madeMove({ turn: data.turn }));
    }
  };

  const onOpponentLeft = () => {
    dispatch(opponentLeft());
  };

  useEffect(() => {
    socket.connect();

    setFields(generateFields());

    socket.on("game_over", onGameOver);
    socket.on("made_move", onMadeMove);
    socket.on("game_begin", onGameBegin);
    socket.on("opponent_left", onOpponentLeft);

    return () => {
      socket.off("game_over", onGameOver);
      socket.off("made_move", onMadeMove);
      socket.off("game_begin", onGameBegin);
      socket.off("opponent_left", onOpponentLeft);

      socket.disconnect();

      setFields([]);

      if (tictactoe.nextGame != 0) {
        dispatch(reset());
      }
    };
  }, [tictactoe.nextGame]);

  return (
    <>
      <Heading className="text-center m-10 mb-5" size="8">
        Tic Tac Toe
      </Heading>

      <Players />

      <Flex justify="center" gap="6" className="h-[400px]">
        <Fields fields={fields} />
        <Chat
          namespace="/tictactoe"
          loading={
            tictactoe.gameStatus === "searching" ||
            tictactoe.gameStatus === undefined
          }
          className="w-[400px]"
        />
      </Flex>

      <Messages />

      <FinishButtons setFields={setFields} />
    </>
  );
}

export default TicTacToe;
