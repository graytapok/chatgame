import { Flex, Text, Button } from "@radix-ui/themes";
import { User } from "src/types/auth";

interface Props {
  symbol: string | undefined;
  user: User | null;
  opponent: { username: string; symbol: string } | undefined;
}

const Players = ({ symbol, user, opponent }: Props) => {
  return (
    <Flex className="text-center justify-center m-4 gap-3">
      <Flex className="justify-center items-center gap-2">
        <Text>{user ? user.username : "You"}</Text>
        <Button
          color={symbol === "X" ? "blue" : symbol === "O" ? "red" : "gray"}
          className={
            `${
              symbol === "X"
                ? "bg-blue-500"
                : symbol === "O"
                ? "bg-red-500"
                : ""
            }` + " dark:text-white text-black cursor-default"
          }
          disabled={true}
        >
          {symbol}
        </Button>
      </Flex>

      <Flex className="justify-center items-center gap-2">
        <Text>VS</Text>
      </Flex>

      <Flex className="justify-center items-center gap-2">
        <Button
          disabled={true}
          color={
            opponent?.symbol === "X"
              ? "blue"
              : opponent?.symbol === "O"
              ? "red"
              : "gray"
          }
          className={
            `${
              opponent?.symbol === "X"
                ? "bg-blue-500"
                : opponent?.symbol === "O"
                ? "bg-red-500"
                : ""
            }` + " dark:text-white text-black cursor-default"
          }
        >
          {opponent?.symbol}
        </Button>
        <Text>{opponent?.username}</Text>
      </Flex>
    </Flex>
  );
};

export default Players;
