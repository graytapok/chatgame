import { Flex, Text, Button } from "@radix-ui/themes";
import { Player } from "src/features/gamesSlice/tictactoeSlice";
import { useAppSelector } from "src/hooks";

const DiffElo = ({ player }: { player?: Player }) => {
  return (
    <Text
      className={
        player?.diffElo !== undefined && player?.diffElo > 0
          ? "text-green-500"
          : player?.diffElo !== undefined && player?.diffElo < 0
          ? "text-red-500"
          : "text-neutral-400"
      }
    >
      {player?.diffElo !== undefined && player?.diffElo > 0
        ? `+${player?.diffElo}`
        : player?.diffElo}
    </Text>
  );
};

const Elo = ({ player }: { player?: Player }) => {
  if (player?.elo !== undefined && player?.elo !== null) {
    return (
      <Button
        color="gray"
        className="dark:text-white text-black cursor-default"
        disabled={true}
      >
        {player.elo}
      </Button>
    );
  }

  return;
};

const Symbol = ({ player }: { player?: Player }) => {
  return (
    <Button
      color={
        player?.symbol === "X"
          ? "blue"
          : player?.symbol === "O"
          ? "red"
          : "gray"
      }
      className={
        `${
          player?.symbol === "X"
            ? "bg-blue-500"
            : player?.symbol === "O"
            ? "bg-red-500"
            : ""
        }` + " dark:text-white text-black cursor-default"
      }
      disabled={true}
    >
      {player?.symbol}
    </Button>
  );
};

const Players = ({ plus = false }: { plus?: boolean }) => {
  const { player, opponent } = useAppSelector((state) =>
    plus ? state.games.tictactoePlus : state.games.tictactoe
  );
  return (
    <Flex className="text-center justify-center m-4 gap-3">
      <Flex className="justify-center items-center gap-2">
        <DiffElo player={player} />

        <Text>{player?.username ? player.username : "You"}</Text>

        <Elo player={player} />

        <Symbol player={player} />
      </Flex>

      <Flex className="justify-center items-center gap-2">
        <Text>VS</Text>
      </Flex>

      <Flex className="justify-center items-center gap-2">
        <Symbol player={opponent} />

        <Elo player={opponent} />

        <Text>{opponent?.username || "Enemy"}</Text>

        <DiffElo player={opponent} />
      </Flex>
    </Flex>
  );
};

export default Players;
