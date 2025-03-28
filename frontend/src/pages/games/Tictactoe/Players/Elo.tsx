import { Button } from "@radix-ui/themes";
import { Player } from "src/features/gamesSlice/tictactoeSlice";

export const Elo = ({ player }: { player?: Player }) => {
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
