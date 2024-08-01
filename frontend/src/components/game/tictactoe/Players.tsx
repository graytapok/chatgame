import { Flex, Text, Button } from "@radix-ui/themes";
import { useAppSelector } from "src/hooks";

const Players = () => {
  const user = useAppSelector((state) => state.user);
  const { playerSymbol, opponent } = useAppSelector((state) => state.tictactoe);
  return (
    <Flex className="text-center justify-center m-4 gap-3">
      <Flex className="justify-center items-center gap-2">
        <Text>{user.authenticated ? user.username : "You"}</Text>
        <Button
          color={
            playerSymbol === "X"
              ? "blue"
              : playerSymbol === "O"
              ? "red"
              : "gray"
          }
          className={
            `${
              playerSymbol === "X"
                ? "bg-blue-500"
                : playerSymbol === "O"
                ? "bg-red-500"
                : ""
            }` + " dark:text-white text-black cursor-default"
          }
          disabled={true}
        >
          {playerSymbol}
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
