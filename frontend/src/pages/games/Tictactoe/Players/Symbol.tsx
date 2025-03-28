import { Button } from "@radix-ui/themes";
import { Player } from "src/features/gamesSlice/tictactoeSlice";

export const Symbol = ({ player }: { player?: Player }) => {
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
