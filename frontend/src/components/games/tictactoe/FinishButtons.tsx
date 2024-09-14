import { ReloadIcon, ResetIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { Flex } from "@radix-ui/themes";
import { LuSwords } from "react-icons/lu";

import { useAppDispatch, useAppSelector } from "src/hooks";
import Button from "src/components/ui/Button";
import { nextGame } from "src/features/gamesSlice/tictactoeSlice";
import { nextGame as nextGamePlus } from "src/features/gamesSlice/tictactoePlusSlice";

const FinishButtons = ({
  requestRematch,
  plus = false,
}: {
  plus?: boolean;
  requestRematch: () => void;
}) => {
  const { status, opponent, rematch } = useAppSelector((state) =>
    plus ? state.games.tictactoePlus : state.games.tictactoe
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Flex className="items-center justify-center m-5 gap-3">
      {status === "finished" && (
        <>
          <Button onClick={() => navigate("/game")} color="red">
            <ResetIcon />
            Leave
          </Button>

          {!opponent?.left && (
            <Button
              color="green"
              loading={rematch === "requested"}
              disabled={rematch === "recieved" || rematch === "rejected"}
              onClick={rematch ? () => {} : requestRematch}
            >
              <LuSwords />
              Rematch
            </Button>
          )}

          <Button
            onClick={() =>
              plus ? dispatch(nextGamePlus()) : dispatch(nextGame())
            }
          >
            <ReloadIcon />
            Next Game
          </Button>
        </>
      )}
    </Flex>
  );
};

export default FinishButtons;
