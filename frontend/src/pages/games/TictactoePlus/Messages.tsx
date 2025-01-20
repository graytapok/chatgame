import { Flex, Text } from "@radix-ui/themes";
import { useAppSelector } from "src/hooks";

const Messages = () => {
  const { player, winner, turn, opponent } = useAppSelector(
    (state) => state.games.tictactoePlus
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
        <>
          <Text size="6">
            {turn.symbol === player?.symbol
              ? "Your turn!"
              : opponent?.username + " moves!"}
          </Text>
          <Text size="6">
            {" Field " + (turn.field ? turn.field + 1 : "is free to choose!")}
          </Text>
        </>
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
