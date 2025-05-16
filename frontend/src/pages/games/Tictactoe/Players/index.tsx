import { Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";

import { useAppSelector } from "src/hooks";
import { DiffElo } from "./DiffElo";
import { Symbol } from "./Symbol";
import { Elo } from "./Elo";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRequest } from "src/hooks/api/friends";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { AxiosError } from "axios";

const Players = ({ plus = false }: { plus?: boolean }) => {
  const { player, opponent } = useAppSelector((state) =>
    plus ? state.games.tictactoePlus : state.games.tictactoe
  );
  const user = useAppSelector((state) => state.user);
  const friends = useAppSelector((state) => state.friends.friends);

  const { mutate, status, error } = useRequest();

  useEffect(() => {
    if (status === "success") {
      toast.success(`Friend request to ${opponent?.username} sent!`);
    }

    if (status === "error") {
      const data = error as AxiosError;
      const msg = data.response?.data as { message: string };

      toast.error(msg.message);
    }
  }, [status]);

  return (
    <Flex className="text-center justify-center m-4 gap-3">
      <Flex className="justify-center items-center gap-2">
        <DiffElo player={player} />

        <Text>{user.id && player?.username ? player.username : "You"}</Text>

        <Elo player={player} />

        <Symbol player={player} />
      </Flex>

      <Flex className="justify-center items-center gap-2">
        <Text>VS</Text>
      </Flex>

      <Flex className="justify-center items-center gap-2 relative">
        <Symbol player={opponent} />

        <Elo player={opponent} />

        <Text>{opponent?.username || "Enemy"}</Text>

        <DiffElo player={opponent} />

        {opponent?.elo &&
          !friends?.some((i) => i.username === opponent.username) && (
            <Tooltip content="Add friend">
              <IconButton
                size="1"
                className="rounded-full"
                variant="soft"
                onClick={() => {
                  mutate(opponent.username);
                }}
              >
                <PlusIcon />
              </IconButton>
            </Tooltip>
          )}
      </Flex>
    </Flex>
  );
};

export default Players;
