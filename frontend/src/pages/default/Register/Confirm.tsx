import { useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { EnterIcon, HomeIcon } from "@radix-ui/react-icons";
import { Blockquote } from "@radix-ui/themes";

import CenterCard from "src/components/ui/CenterCard";
import Button from "src/components/ui/Button";
import { RegisterContext } from ".";

function RegisterConfirm() {
  const fetchConfirm = useContext(RegisterContext);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (fetchConfirm?.isError) {
      const res = fetchConfirm?.error as AxiosError;
      if (res.response !== undefined) {
        const apiError = res.response as AxiosResponse;
        setError(apiError.data.message);
      }
    }
    if (error) {
      switch (error) {
        case "token expired":
          setErrorMessage(
            "Your token has expired. Please recheck your email inbox for the most recent confirmation email or try again by clicking the button below."
          );
          break;
        case "no login required":
          setErrorMessage("Your email is already confirmed!");
          break;
        case "invalid input":
          setErrorMessage("The search params of your url are invalid.");
          break;
        default:
          setErrorMessage("Something went wrong...");
          break;
      }
    }
  }, [fetchConfirm, error]);

  return (
    <CenterCard heading={error ? "Something went wrong!" : "Done!"}>
      <Blockquote size="5">
        {error
          ? errorMessage
          : "Your email has been successfully confirmed. You are also automatically logged in!"}
      </Blockquote>

      {error === "token expired" ? (
        <Button onClick={() => navigate("/resend")}>
          Resend confirmation email
        </Button>
      ) : error === "no login required" ? (
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

export default RegisterConfirm;
