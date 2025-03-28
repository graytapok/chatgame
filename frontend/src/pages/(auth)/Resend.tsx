import { InfoCircledIcon, PersonIcon } from "@radix-ui/react-icons";
import { TextField, Blockquote, Callout, Text, Button } from "@radix-ui/themes";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { useResend } from "src/hooks/api/auth";
import { CenterCard } from "src/components/ui";

function Resend() {
  const fetchResend = useResend();
  const [searchParams] = useSearchParams();

  const [login, setLogin] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (fetchResend.isSuccess) {
      setLogin("");
      setError("");
    }
    if (fetchResend.isError) {
      const res = fetchResend.error as AxiosError;
      if (res.response !== undefined) {
        const apiError = res.response as AxiosResponse;
        setError(apiError.data.message);
        if (apiError.data.message === "email already confirmed") {
          setErrorMessage("Your account is already confirmed!");
        } else {
          setErrorMessage("Invalid Input");
        }
      }
    }
  }, [fetchResend.status]);

  return (
    <CenterCard heading="Resend Confirmation Email">
      {searchParams.get("m") === "email" && (
        <Text>Your email is not confirmed!</Text>
      )}

      <Blockquote>
        Enter your username or email to confirm/end your registration.
      </Blockquote>

      <TextField.Root
        placeholder="Username or Email"
        size="3"
        onChange={(e) => setLogin(e.target.value)}
        value={login || ""}
      >
        <TextField.Slot>
          <PersonIcon />
        </TextField.Slot>
      </TextField.Root>

      {error && (
        <Callout.Root color="red" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{errorMessage}</Callout.Text>
        </Callout.Root>
      )}

      {fetchResend.isSuccess && (
        <Callout.Root color="green" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>New confirmation email has been sent!</Callout.Text>
        </Callout.Root>
      )}

      <Button onClick={() => fetchResend.mutate({ login })}>
        Resend email
      </Button>
    </CenterCard>
  );
}

export default Resend;
