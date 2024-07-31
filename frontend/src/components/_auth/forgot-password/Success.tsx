import { useNavigate } from "react-router-dom";
import { HomeIcon } from "@radix-ui/react-icons";
import { Blockquote } from "@radix-ui/themes";

import CenterCard from "src/components/ui/CenterCard";
import Button from "src/components/ui/Button";

function Success() {
  const navigate = useNavigate();
  return (
    <CenterCard heading="Forgot Password">
      <Blockquote size="5">
        Your password has been succesfully changed. You are also logged in!
      </Blockquote>

      <Button onClick={() => navigate("/")}>
        <HomeIcon />
        Home
      </Button>
    </CenterCard>
  );
}

export default Success;
