import { Flex, Text } from "@radix-ui/themes";
import { useAppSelector } from "src/hooks";

const Messages = () => {
  const { player, winner, turn, opponent } = useAppSelector(
    (state) => state.games.tictactoe
  );
  return (
    <Flex className="flex-col items-center justify-center m-5">
      {opponent?.left && <Text size="6">{opponent?.username} left!</Text>}

      {winner ? (
        winner === "draw" ? (
          <Text size="6">Draw!</Text>
        ) : (
          <Text size="6">
            {winner === player?.symbol ? "You won!" : "You lost!"}
          </Text>
        )
      ) : (
        ""
      )}

      {!opponent?.left && !winner && turn ? (
        turn === player?.symbol ? (
          <Text size="6">Your turn!</Text>
        ) : (
          <Text size="6">{opponent?.username} moves!</Text>
        )
      ) : (
        ""
      )}

      {!opponent?.left && !winner && !turn && (
        <Text size="6">Waiting is always boring!</Text>
      )}
    </Flex>
  );
};

export default Messages;
