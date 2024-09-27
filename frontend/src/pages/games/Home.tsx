import { Flex, Separator } from "@radix-ui/themes";
import PageHeading from "src/components/PageHeading";
import Link from "src/components/ui/Link";

function GameHome() {
  return (
    <>
      <PageHeading title="Game" text="A rich choose of games!"></PageHeading>
      <Flex className="flex-row gap-3 items-center justify-center mt-6">
        <Link to="/game/tictactoe">Tictactoe</Link>
        <Separator orientation={"vertical"} size="1" />
        <Link to="/game/tictactoe_plus">TictactoePlus</Link>
      </Flex>
    </>
  );
}

export default GameHome;
