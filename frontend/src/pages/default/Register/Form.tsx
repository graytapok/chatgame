import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import {
  LockClosedIcon,
  PersonIcon,
  LockOpen1Icon,
  EnvelopeClosedIcon,
  EyeOpenIcon,
  EyeNoneIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Callout, Flex, IconButton, TextField } from "@radix-ui/themes";

import Button from "src/components/ui/Button";
import { useRegister } from "src/api/auth";
import Link from "src/components/ui/Link";
import CenterCard from "src/components/ui/CenterCard";

interface ErrorResponse {
  message: string;
  errors: Error;
}

interface Error {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function RegisterForm() {
  const fetchRegister = useRegister();

  const [error, setError] = useState<Error>({});

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordVisible, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisibility] =
    useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisible);
  };

  const handleRegister = () => {
    fetchRegister.mutate({ username, email, password, confirmPassword });
  };

  useEffect(() => {
    if (fetchRegister.isError) {
      const res = fetchRegister.error as AxiosError;
      if (res.response !== undefined) {
        const apiError = res.response as AxiosResponse;
        const data = apiError.data as ErrorResponse;
        setError(data.errors);
      }
    }
    if (fetchRegister.isSuccess) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError({});
    }
  }, [fetchRegister.status]);

  return (
    <CenterCard heading="Registration">
      <TextField.Root
        placeholder="Username"
        size="3"
        onChange={(e) => setUsername(e.target.value)}
        value={username || ""}
      >
        <TextField.Slot>
          <PersonIcon />
        </TextField.Slot>
      </TextField.Root>

      {error && "username" in error && (
        <Callout.Root color="red" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            {error.username === "required"
              ? "Please, set a username."
              : error.username === "not unique"
              ? "Username is already taken."
              : error.username === "rules" &&
                "Username must be atleast 2 digits long."}
          </Callout.Text>
        </Callout.Root>
      )}

      <TextField.Root
        size="3"
        placeholder="Email address"
        onChange={(e) => setEmail(e.target.value)}
        value={email || ""}
      >
        <TextField.Slot>
          <EnvelopeClosedIcon />
        </TextField.Slot>
      </TextField.Root>

      {error && "email" in error && (
        <Callout.Root color="red" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            {error.email === "required"
              ? "Please, set an email."
              : error.email === "not unique"
              ? "This email adress is already registered."
              : error.email === "rules" &&
                "Be sure to provide a valid email address."}
          </Callout.Text>
        </Callout.Root>
      )}

      <TextField.Root
        placeholder="Password"
        size="3"
        onChange={(e) => setPassword(e.target.value)}
        type={passwordVisible ? undefined : "password"}
        value={password || ""}
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
            {passwordVisible ? <EyeOpenIcon /> : <EyeNoneIcon />}
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
        placeholder="Confirm password"
        size="3"
        onChange={(e) => setConfirmPassword(e.target.value)}
        type={confirmPasswordVisible ? undefined : "password"}
        value={confirmPassword || ""}
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
