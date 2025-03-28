import { Text } from "@radix-ui/themes";
import { Player } from "src/features/gamesSlice/tictactoeSlice";

export const DiffElo = ({ player }: { player?: Player }) => {
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
