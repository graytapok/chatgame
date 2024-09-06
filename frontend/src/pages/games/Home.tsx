import { Flex, Separator } from "@radix-ui/themes";
import Link from "src/components/ui/Link";

function GameHome() {
  return (
    <Flex className="flex-row gap-3 items-center">
      <Link to="/game/tictactoe">Tictactoe</Link>
      <Separator orientation={"vertical"} size="1" />
      <Link to="/game/tictactoe_plus">TictactoePlus</Link>
    </Flex>
  );
}

export default GameHome;
