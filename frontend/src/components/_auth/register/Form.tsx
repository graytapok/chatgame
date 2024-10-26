import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import {
  LockClosedIcon,
  PersonIcon,
  LockOpen1Icon,
  EnvelopeClosedIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Callout, Flex } from "@radix-ui/themes";

import Button from "src/components/ui/Button";
import { useRegister } from "src/api/auth";
import Link from "src/components/ui/Link";
import CenterCard from "src/components/ui/CenterCard";
import InputField from "../../InputField";
import { ApiValidationError } from "src/types/api";

type ErrorType = "required" | "not unique" | "rules";

interface Errors {
  username?: ErrorType;
  email?: ErrorType;
  password?: ErrorType;
  confirmPassword?: ErrorType;
}

function RegisterForm() {
  const fetchRegister = useRegister();

  const [errors, setErrors] = useState<Errors>({});

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!username) {
      errors.username = "required";
    } else {
      delete errors.username;
    }

    if (!email) {
      errors.email = "required";
    } else {
      delete errors.email;
    }

    if (!password) {
      errors.password = "required";
    } else {
      delete errors.password;
    }

    if (confirmPassword != password) {
      errors.confirmPassword = "required";
    } else {
      delete errors.confirmPassword;
    }

    setErrors({ ...errors });

    if (Object.keys(errors).length === 0) {
      fetchRegister.mutate({ username, email, password });
    }
  };

  useEffect(() => {
    if (fetchRegister.isError) {
      const res = fetchRegister.error as AxiosError;

      if (res.response) {
        const apiError = res.response as AxiosResponse;
        const data = apiError.data;

        if (apiError.status == 400) {
          if ("validation_error" in data) {
            const list: ApiValidationError[] =
              data["validation_error"]["body_params"];

            list.forEach((e) => {
              if (e.loc.includes("username")) errors.username = "rules";
              if (e.loc.includes("password")) errors.password = "rules";
              if (e.loc.includes("email")) errors.email = "rules";
            });

            setErrors({ ...errors });
          }
          if ("detail" in data) {
            if ("username" in data["detail"]) errors.username = "not unique";
            if ("email" in data["detail"]) errors.email = "not unique";
            setErrors({ ...errors });
          }
        }
      }
    }
    if (fetchRegister.isSuccess) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    }
  }, [fetchRegister.status]);

  return (
    <CenterCard heading="Registration">
      <InputField
        placeholder="Username"
        onChange={setUsername}
        value={username || ""}
        icon={<PersonIcon />}
        callout={"username" in errors}
        calloutMsg={
          errors.username === "required"
            ? "Please, set a username."
            : errors.username === "not unique"
            ? "Username is already taken."
            : errors.username === "rules"
            ? "Username must be atleast 3 digits long."
            : ""
        }
      />

      <InputField
        placeholder="Email address"
        onChange={setEmail}
        value={email || ""}
        icon={<EnvelopeClosedIcon />}
        callout={"email" in errors}
        calloutMsg={
          errors.email === "required"
            ? "Please, set an email."
            : errors.email === "not unique"
            ? "This email adress is already registered."
            : errors.email === "rules"
            ? "Be sure to provide a valid email address."
            : ""
        }
      />

      <InputField
        placeholder="Password"
        onChange={setPassword}
        value={password || ""}
        icon={<LockClosedIcon />}
        callout={"password" in errors}
        type={"password"}
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
        value={confirmPassword || ""}
        icon={<LockOpen1Icon />}
        type={"password"}
        callout={"confirmPassword" in errors}
        calloutMsg="Passwords do not match"
      />

      {fetchRegister.isSuccess && (
        <Callout.Root color="green" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            You recieved an email. Please confirm it to continue!
          </Callout.Text>
        </Callout.Root>
      )}

      <Button loading={fetchRegister.isPending} onClick={handleRegister}>
        Register
      </Button>

      <Flex gap="2" justify="center">
        <span>Already have an account? </span>
        <Link to="/login">Login</Link>
      </Flex>
    </CenterCard>
  );
}

export default RegisterForm;
