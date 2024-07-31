import {
  ChangeEvent,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Flex, Heading } from "@radix-ui/themes";
import { Socket } from "socket.io-client";

import Chat from "src/components/Chat";
import { manager } from "src/api/socket";
import Button from "src/components/ui/Button";
import AuthContext from "src/providers/AuthProvider";
import Fields from "src/components/game/tictactoe/Fields";
import Players from "src/components/game/tictactoe/Players";
import Messages from "src/components/game/tictactoe/Messages";
import FinishButtons from "src/components/game/tictactoe/FinishButtons";

export const socket = manager.socket("/tictactoe");

export const TicTacToeContext = createContext<Socket>(socket);

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
  turn: string;
}

function TicTacToe() {
  const { user } = useContext(AuthContext) as AuthContext;
  const [symbol, setSymbol] = useState<string | undefined>();

  const [gameStatus, setGameStatus] = useState<string>("searching");
  const [fields, setFields] = useState<JSX.Element[]>([]);
  const [turn, setTurn] = useState<string | undefined>();
  const [winner, setWinner] = useState<string | undefined>();

  const [opponent, setOpponent] = useState<Opponent | undefined>();
  const [opponentLeft, setOpponentLeft] = useState<boolean>(false);

  const [nextGame, setNextGame] = useState<number>(0);

  const messagesProps = {
    symbol,
    gameStatus,
    opponentLeft,
    opponent,
    turn,
    winner,
  };

  const finishButtonsProps = {
    gameStatus,
    opponentLeft,

    setNextGame,
    setFields,

    reset: () => reset(),
  };

  const onGameBegin = (data: OnGameBeginResponse) => {
    setSymbol(data.symbol);
    setOpponent({
      username: data.opponent.username,
      symbol: data.opponent.symbol,
    });
    setTurn("X");
    setGameStatus("active");
  };

  const onGameOver = (data: { winner: string }) => {
    setWinner(data.winner);
    setGameStatus("finished");
  };

  const onMadeMove = (data: OnMadeMoveResponse) => {
    const field = document.getElementById(data.position);
    if (field) {
      field.textContent = data.symbol;
      const prevClassName = field.className;
      const newClassName = data.symbol === "X" ? " bg-blue-500" : " bg-red-500";
      field.className = prevClassName + newClassName;
      field.setAttribute("disabled", "");
      setTurn(data.turn);
    }
  };

  const onOpponentLeft = () => {
    setGameStatus("finished");
    setOpponentLeft(true);
  };

  useEffect(() => {
    socket.connect();

    for (let i = 1; i < 10; i += 1) {
      setFields((prev) => [
        ...prev,
        <Flex className="items-center justify-center" key={i}>
          <Button
            id={i.toString()}
            className="h-24 w-24 flex justify-center items-center"
            color="gray"
            variant="soft"
            highContrast={true}
            onClick={(e: ChangeEvent) => socket.emit("make_move", e.target.id)}
          />
        </Flex>,
      ]);
    }

    socket.on("game_over", onGameOver);
    socket.on("made_move", onMadeMove);
    socket.on("game_begin", onGameBegin);
    socket.on("opponent_left", onOpponentLeft);

    return () => {
      reset();

      socket.off("game_over", onGameOver);
      socket.off("made_move", onMadeMove);
      socket.off("game_begin", onGameBegin);
      socket.off("opponent_left", onOpponentLeft);

      socket.disconnect();
    };
  }, [nextGame]);

  const reset = () => {
    setGameStatus("searching");
    setOpponentLeft(false);
    setOpponent(undefined);
    setWinner(undefined);
    setSymbol(undefined);
    setTurn(undefined);
    setFields([]);
  };

  return (
    <TicTacToeContext.Provider value={socket}>
      <Heading className="text-center m-10 mb-5" size="8">
        Tic Tac Toe
      </Heading>

      <Players symbol={symbol} user={user} opponent={opponent} />

      <Flex justify="center" gap="6" className="h-[400px]">
        <Fields fields={fields} />
        <Chat
          namespace="/tictactoe"
          loading={gameStatus === "searching"}
          className="w-[400px]"
        />
      </Flex>

      <Messages {...messagesProps} />

      <FinishButtons {...finishButtonsProps} />
    </TicTacToeContext.Provider>
  );
}

export default TicTacToe;
