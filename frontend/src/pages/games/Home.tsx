import { Flex, Separator } from "@radix-ui/themes";
import { PageHeading } from "src/components";
import { Link } from "src/components/ui";

function GameHome() {
  return (
    <>
      <PageHeading title="Game" text="A rich choose of games!">
        <Flex className="flex-row gap-3 items-center justify-center">
          <Link to="/game/tictactoe">Tictactoe</Link>
          <Separator orientation={"vertical"} size="1" />
          <Link to="/game/tictactoe_plus">TictactoePlus</Link>
        </Flex>
      </PageHeading>
    </>
  );
}

export default GameHome;
