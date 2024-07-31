import { ReloadIcon, ResetIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

import Button from "src/components/ui/Button";

interface Props {
  gameStatus?: string;

  setNextGame: React.Dispatch<React.SetStateAction<number>>;
  setFields: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
  reset: () => void;

  opponentLeft?: boolean;
}

const FinishButtons = (p: Props) => {
  const navigate = useNavigate();

  const handleNextGame = () => {
    p.setNextGame((prev) => prev + 1);
    p.setFields([]);
    p.reset();
  };

  return (
    <Flex className="items-center justify-center m-5 gap-3">
      {p.gameStatus === "finished" && (
        <>
          <Button onClick={() => navigate("/game")} color="red">
            <ResetIcon />
            Leave
          </Button>

          <Button onClick={handleNextGame}>
            <ReloadIcon />
            Next Game
          </Button>
        </>
      )}
    </Flex>
  );
};

export default FinishButtons;
