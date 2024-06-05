import { useEffect, useState } from "react";
import { InfoCircledIcon, PersonIcon } from "@radix-ui/react-icons";
import { Blockquote, Callout, TextField } from "@radix-ui/themes";

import { useForgotPassword } from "src/api/auth/useForgotPassword";
import CenterCard from "src/components/ui/CenterCard";
import Button from "src/components/ui/Button";

function ForgotPassword() {
  const fetchForgotPassword = useForgotPassword();
  const [login, setLogin] = useState("");

  useEffect(() => {
    if (fetchForgotPassword.isSuccess) {
      setLogin("");
    }
  }, [fetchForgotPassword.status]);

  return (
    <CenterCard heading="Forgot Password">
      <Blockquote>
        Enter your username or email to reset your password and get a password
        change email.
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

      {fetchForgotPassword.isError && (
        <Callout.Root color="red" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>Invalid input</Callout.Text>
        </Callout.Root>
      )}

      {fetchForgotPassword.isSuccess && (
        <Callout.Root color="green" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>Password change email sended!</Callout.Text>
        </Callout.Root>
      )}

      <Button
        onClick={() => fetchForgotPassword.mutate({ login })}
        loading={fetchForgotPassword.isPending}
      >
        Send email
      </Button>
    </CenterCard>
  );
}

export default ForgotPassword;
