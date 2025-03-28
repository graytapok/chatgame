import { CopyIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { FC } from "react";
import {
  Flex,
  DataList,
  Badge,
  Code,
  IconButton,
  Link,
  Button,
} from "@radix-ui/themes";

import { useLogout, useLogin } from "src/hooks/api/auth";
import { useAppSelector } from "src/hooks";

const HelloIcon: FC = () => "👋";

function TestQueryButtons() {
  const user = useAppSelector((state) => state.user);
  const login = useLogin();
  const logout = useLogout();

  return (
    <>
      <Flex gap="2">
        <Button
          onClick={() =>
            toast.info("React Toastify is awesome!", {
              icon: HelloIcon,
              toastId: "helloMessage",
            })
          }
        >
          Message
        </Button>
        <Button
          onClick={() =>
            login
              .mutateAsync({
                login: "Wadim",
                password: "Wadim2204!",
                remember: true,
              })
              .catch(() => {
                toast.error("No login required", {
                  toastId: "loginError",
                });
              })
          }
        >
          Login
        </Button>
        <Button
          onClick={() =>
            logout.mutateAsync().catch((e) =>
              toast.error(e.response.data.message, {
                toastId: "logoutError",
              })
            )
          }
        >
          Logout
        </Button>
      </Flex>

      {user.authenticated && (
        <DataList.Root className="m-3">
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Status</DataList.Label>
            <DataList.Value>
              <Badge color="jade" variant="soft" radius="full">
                Authorized
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">ID</DataList.Label>
            <DataList.Value>
              <Flex align="center" gap="2">
                <Code variant="ghost">{user.id}</Code>
                <IconButton
                  size="1"
                  aria-label="Copy value"
                  color="gray"
                  variant="ghost"
                >
                  <CopyIcon />
                </IconButton>
              </Flex>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Username</DataList.Label>
            <DataList.Value>{user.username}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Email</DataList.Label>
            <DataList.Value>
              <Link href="mailto:vlad@workos.com">{user.email}</Link>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Admin</DataList.Label>
            <DataList.Value>
              {user.admin ? <CheckIcon /> : <Cross2Icon color="red" />}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      )}
      <Button color="gray" disabled={true}>
        {"    "}
      </Button>
    </>
  );
}

export default TestQueryButtons;
