import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  TextField,
  Checkbox,
  Text,
  Callout,
  IconButton,
} from "@radix-ui/themes";
import {
  EyeNoneIcon,
  EyeOpenIcon,
  InfoCircledIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { useLogin } from "src/api/auth";
import Button from "src/components/ui/Button";
import Link from "src/components/ui/Link";
import CenterCard from "src/components/ui/CenterCard";
import { AxiosError, AxiosResponse } from "axios";

function Login() {
  const fetchLogin = useLogin();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [passwordVisible, setPasswordVisibility] = useState(false);

  const toggleRemember = () => setRemember(!remember);

  const handleLogin = () => {
    fetchLogin.mutate({ login, password, remember });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisible);
  };

  useEffect(() => {
    if (fetchLogin.isSuccess) {
      navigate("/");
    }
    if (fetchLogin.isError) {
      const res = fetchLogin.error as AxiosError;
      if (res.response !== undefined) {
        const apiError = res.response as AxiosResponse;
        const apiData = apiError.data.message;
        if (apiData === "email must be confirmed") {
          navigate("/resend?m=email");
        }
      }
    }
  }, [fetchLogin]);

  return (
    <CenterCard heading="Login">
      <TextField.Root
        size="3"
        placeholder="Login"
        variant="surface"
        onChange={(e) => setLogin(e.target.value)}
        className="outline-1"
      >
        <TextField.Slot>
          <PersonIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>

      <TextField.Root
        size="3"
        placeholder="Password"
        type={passwordVisible ? undefined : "password"}
        onChange={(e) => setPassword(e.target.value)}
        className="outline-1"
      >
        <TextField.Slot>
          <LockClosedIcon height="16" width="16" />
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

      {fetchLogin.isError && (
        <Callout.Root color="red" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>Invalid Input</Callout.Text>
        </Callout.Root>
      )}

      <Flex justify="between">
        <Text as="label" size="3" className="hover:cursor-pointer">
          <Flex as="span" gap="2" className="hover:cursor-pointer">
            <Checkbox
              size="2"
              onClick={toggleRemember}
              className="hover:cursor-pointer"
            />{" "}
            <span className="opacity-50">Remember Me</span>
          </Flex>
        </Text>
        <Link to="/forgot_password">Forgot password?</Link>
      </Flex>

      <Button onClick={handleLogin} loading={fetchLogin.isPending}>
        Login
      </Button>

      <Flex gap="2" justify="center">
        <span>No account yet? </span>
        <Link to="/register">Register</Link>
      </Flex>
    </CenterCard>
  );
}

export default Login;
