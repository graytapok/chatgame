import { Flex, Text } from "@radix-ui/themes";
import { useAppSelector } from "src/hooks";

const Messages = () => {
  const { playerSymbol, winner, turn, opponent } = useAppSelector(
    (state) => state.games.tictactoePlus
  );
  return (
    <Flex className="items-center justify-center m-5">
      {opponent?.left ? (
        <Text size="6">{opponent?.username} left!</Text>
      ) : winner ? (
        winner === "draw" ? (
          <Text size="6">Draw!</Text>
        ) : (
          <Text size="6">
            {winner === playerSymbol ? "You won!" : "You lost!"}
          </Text>
        )
      ) : turn ? (
        <Flex direction={"column"} className="text-center">
          <Text size="6">
            {turn.symbol === playerSymbol
              ? "Your turn!"
              : opponent?.username + " moves!"}
          </Text>
          <Text size="6">
            {" Field " + (turn.field ? turn.field + 1 : "is free to choose!")}
          </Text>
        </Flex>
      ) : (
        <Text size="6">Waiting is always boring!</Text>
      )}
    </Flex>
  );
};

export default Messages;
