import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import { EnterIcon, HomeIcon } from "@radix-ui/react-icons";
import { Blockquote, Button } from "@radix-ui/themes";

import { CenterCard } from "src/components/ui";
import { RegisterContext } from "src/pages/(auth)/Register";

function ConfirmRegister() {
  const fetchConfirm = useContext(RegisterContext);
  const navigate = useNavigate();

  const [status, setStatus] = useState<number>();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (fetchConfirm?.isError) {
      const res = fetchConfirm.error as AxiosError;
      setStatus(res.response?.status);
    }
  }, [fetchConfirm]);

  useEffect(() => {
    switch (status) {
      case 410:
        setErrorMessage(
          "Your token has expired. Please recheck your email inbox for the most recent confirmation email or try again by clicking the button below."
        );
        break;

      case 403:
        setErrorMessage("The email is already confirmed!");
        break;

      case 400:
      case 404:
        setErrorMessage("Invalid token.");
        break;

      default:
        setErrorMessage("Something went wrong...");
        break;
    }
  }, [status]);

  return (
    <CenterCard heading={status ? "Something went wrong!" : "Done!"}>
      <Blockquote size="5">
        {status
          ? errorMessage
          : "Your email has been successfully confirmed. You are also automatically logged in!"}
      </Blockquote>

      {status === 410 ? (
        <Button onClick={() => navigate("/resend")}>
          Resend confirmation email
        </Button>
      ) : status === 401 ? (
        <Button onClick={() => navigate("/login")}>
          <EnterIcon />
          Login
        </Button>
      ) : (
        <Button onClick={() => navigate("/")}>
          <HomeIcon />
          Home
        </Button>
      )}
    </CenterCard>
  );
}

export default ConfirmRegister;
