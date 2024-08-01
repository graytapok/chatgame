import { ReloadIcon, ResetIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { Flex } from "@radix-ui/themes";

import Button from "src/components/ui/Button";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { nextGame } from "src/features/tictactoeSlice";

interface Props {
  setFields: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}

const FinishButtons = ({ setFields }: Props) => {
  const { gameStatus } = useAppSelector((state) => state.tictactoe);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNextGame = () => {
    dispatch(nextGame());
    setFields([]);
  };

  return (
    <Flex className="items-center justify-center m-5 gap-3">
      {gameStatus === "finished" && (
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
