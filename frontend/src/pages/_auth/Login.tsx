import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Flex, Checkbox, Text, Callout } from "@radix-ui/themes";
import {
  InfoCircledIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { useLogin } from "src/api/auth";
import Link from "src/components/ui/Link";
import Button from "src/components/ui/Button";
import CenterCard from "src/components/ui/CenterCard";
import InputField from "src/components/InputField";

function Login() {
  const fetchLogin = useLogin();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const toggleRemember = () => setRemember(!remember);

  const handleLogin = () => {
    fetchLogin.mutate({ login, password, remember });
  };

  useEffect(() => {
    if (fetchLogin.isSuccess) {
      navigate("/");
    }
    if (fetchLogin.isError) {
      const res = fetchLogin.error as AxiosError;

      if (res.response) {
        const apiError = res.response as AxiosResponse;
        const apiData = apiError.data.detail;
        if (apiData === "Email is not confirmed") {
          navigate("/resend?m=email");
        }
      }
    }
  }, [fetchLogin]);

  return (
    <CenterCard heading="Login">
      <InputField
        placeholder="Login"
        onChange={setLogin}
        value={login || ""}
        type="text"
        icon={<PersonIcon height="16" width="16" />}
      />

      <InputField
        placeholder="Password"
        value={password || ""}
        onChange={setPassword}
        type="password"
        icon={<LockClosedIcon height="16" width="16" />}
      />

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
