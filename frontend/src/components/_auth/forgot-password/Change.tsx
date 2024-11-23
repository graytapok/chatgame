import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { Blockquote, Callout, Text } from "@radix-ui/themes";
import {
  InfoCircledIcon,
  LockClosedIcon,
  LockOpen1Icon,
} from "@radix-ui/react-icons";

import Button from "src/components/ui/Button";
import { useChangePassword } from "src/api/auth";
import CenterCard from "src/components/ui/CenterCard";
import { ForgotPasswordContext } from "src/pages/_auth/ForgotPassword";
import InputField from "src/components/InputField";
import { ApiValidationError } from "src/types/api";

interface Error {
  password?: string;
  confirmPassword?: string;
}

function ForgotPasswordConfirm() {
  const fetchConfirm = useChangePassword();
  const setRender = useContext(ForgotPasswordContext);

  const [status, setStatus] = useState<number>();
  const [errors, setErrors] = useState<Error>({});

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [args, setArgs] = useSearchParams();
  const token = args.get("t") || "";

  const handleSubmit = () => {
    if (!password) {
      errors.password = "required";
    } else {
      delete errors.password;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "required";
    } else {
      delete errors.confirmPassword;
    }

    if (password != confirmPassword) {
      errors.confirmPassword = "rules";
    } else {
      delete errors.confirmPassword;
    }

    setErrors({ ...errors });

    if (Object.keys(errors).length === 0) {
      fetchConfirm.mutate({
        password,
        token,
      });
    }
  };

  const redirectForm = () => {
    setRender && setRender("form");
    setArgs("");
  };

  useEffect(() => {
    if (fetchConfirm.isError) {
      const error = fetchConfirm.error as AxiosError;
      const res = error.response as AxiosResponse;
      const data = res.data;
      setStatus(res.status);

      if (res.status === 400) {
        if ("validation_error" in data) {
          const list: ApiValidationError[] =
            data["validation_error"]["body_params"];

          list.forEach((e) => {
            if (e.loc.includes("password")) errors.password = "rules";
          });

          setErrors({ ...errors });
        }
      }
    }

    if (fetchConfirm.isSuccess && setRender) {
      setStatus(undefined);
      setPassword("");
      setConfirmPassword("");
      setRender("success");
    }
  }, [fetchConfirm]);

  return (
    <CenterCard heading="Forgot Password - Change">
      <Blockquote size="5">Enter a new password!</Blockquote>

      <InputField
        placeholder="New password"
        onChange={setPassword}
        type={"password"}
        value={password || ""}
        icon={<LockClosedIcon />}
        callout={"password" in errors}
        calloutMsg={
          errors.password === "required"
            ? "Please, set a password."
            : errors.password === "rules"
            ? "Password should be atleast 8 digits long"
            : ""
        }
      />

      <InputField
        placeholder="Confirm password"
        onChange={setConfirmPassword}
        type={"password"}
        value={confirmPassword || ""}
        icon={<LockOpen1Icon />}
        callout={"confirmPassword" in errors}
        calloutMsg={"Passwords do not match"}
      />

      {status == 410 && (
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
            Your token is expired or invalid!{" "}
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

      <Button onClick={handleSubmit} loading={fetchConfirm.isPending}>
        Submit
      </Button>
    </CenterCard>
  );
}

export default ForgotPasswordConfirm;
