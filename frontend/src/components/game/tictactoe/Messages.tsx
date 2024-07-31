import { Flex, Text } from "@radix-ui/themes";

interface Opponent {
  username: string;
  symbol: string;
}

interface Props {
  symbol?: string;

  gameStatus: string;
  winner?: string;
  turn?: string;

  opponent?: Opponent;
  opponentLeft?: boolean;
}

const Messages = (p: Props) => {
  return (
    <Flex className="items-center justify-center m-5">
      {p.opponentLeft ? (
        <Text size="6">{p.opponent?.username} left!</Text>
      ) : p.winner ? (
        p.winner === "draw" ? (
          <Text size="6">Draw!</Text>
        ) : (
          <Text size="6">{p.winner} won!</Text>
        )
      ) : p.turn ? (
        p.turn === p.symbol ? (
          <Text size="6">Your turn!</Text>
        ) : (
          <Text size="6">{p.opponent?.username} moves!</Text>
        )
      ) : (
        <Text size="6">Waiting is always boring!</Text>
      )}
    </Flex>
  );
};

export default Messages;
