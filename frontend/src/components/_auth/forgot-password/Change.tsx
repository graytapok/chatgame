import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import {
  Blockquote,
  Callout,
  IconButton,
  TextField,
  Text,
} from "@radix-ui/themes";
import {
  EyeNoneIcon,
  EyeOpenIcon,
  InfoCircledIcon,
  LockClosedIcon,
  LockOpen1Icon,
} from "@radix-ui/react-icons";

import Button from "src/components/ui/Button";
import { useChangePassword } from "src/api/auth";
import CenterCard from "src/components/ui/CenterCard";
import { ForgotPasswordContext } from "src/pages/_auth/ForgotPassword";

interface ErrorResponse {
  message: string;
  errors: Error;
}

interface Error {
  userId?: string;
  token?: string;
  password?: string;
  confirmPassword?: string;
}

function ForgotPasswordConfirm() {
  const fetchConfirm = useChangePassword();
  const setRender = useContext(ForgotPasswordContext);

  const [error, setError] = useState<Error>({});
  const [errorMessage, setErrorMessage] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newPasswordVisible, setNewPasswordVisibility] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisibility] =
    useState(false);

  const [args, setArgs] = useSearchParams();
  const userHash = args.get("u") || "";
  const token = args.get("t") || "";

  const togglePasswordVisibility = () => {
    setNewPasswordVisibility(!newPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisible);
  };

  const redirectForm = () => {
    setRender && setRender("form");
    setArgs("");
  };

  useEffect(() => {
    if (fetchConfirm.isError) {
      const res = fetchConfirm.error as AxiosError;
      if (res.response !== undefined) {
        const apiError = res.response as AxiosResponse;
        const data = apiError.data as ErrorResponse;
        setError(data.errors);
        setErrorMessage(data.message);
      }
    }
    if (fetchConfirm.isSuccess) {
      setNewPassword("");
      setConfirmPassword("");
      setError({});
      setArgs("");
      if (setRender) {
        setRender("success");
      }
    }
  }, [fetchConfirm, error]);

  return (
    <CenterCard heading="Forgot Password - Change">
      <Blockquote size="5">Enter a new password!</Blockquote>

      <TextField.Root
        type={newPasswordVisible ? undefined : "password"}
        value={newPassword || ""}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
        size="3"
      >
        <TextField.Slot>
          <LockClosedIcon />
        </TextField.Slot>
        <TextField.Slot>
          <IconButton
            variant="ghost"
            color="gray"
            className="hover:cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {newPasswordVisible ? <EyeOpenIcon /> : <EyeNoneIcon />}
          </IconButton>
        </TextField.Slot>
      </TextField.Root>

      {error && "password" in error && (
        <Callout.Root color="red" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            {error.password === "required"
              ? "Please, set a password."
              : error.password === "rules" &&
                "Requirements: length > 8, numbers and uppercase/lowercase letters"}
          </Callout.Text>
        </Callout.Root>
      )}

      <TextField.Root
        type={confirmPasswordVisible ? undefined : "password"}
        value={confirmPassword || ""}
        size="3"
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm password"
      >
        <TextField.Slot>
          <LockOpen1Icon />
        </TextField.Slot>
        <TextField.Slot>
          <IconButton
            variant="ghost"
            color="gray"
            className="hover:cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {confirmPasswordVisible ? <EyeOpenIcon /> : <EyeNoneIcon />}
          </IconButton>
        </TextField.Slot>
      </TextField.Root>

      {error && "confirmPassword" in error && (
        <Callout.Root color="red" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>Password do not match</Callout.Text>
        </Callout.Root>
      )}

      {errorMessage === "token expired" && (
        <Callout.Root
          color="red"
          variant="surface"
          size="1"
          className="mb-2 flex flex-row"
        >
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            Your token expired!{" "}
            <Text
              onClick={redirectForm}
              color="blue"
              className="hover:underline cursor-pointer"
            >
              Send a new email!
            </Text>
          </Callout.Text>
        </Callout.Root>
      )}

      <Button
        onClick={() =>
          fetchConfirm.mutate({
            newPassword,
            confirmPassword,
            userHash,
            token,
          })
        }
        loading={fetchConfirm.isPending}
      >
        Submit
      </Button>
    </CenterCard>
  );
}

export default ForgotPasswordConfirm;
