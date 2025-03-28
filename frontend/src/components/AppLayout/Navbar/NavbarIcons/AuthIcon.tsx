import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { NavbarIcon } from "./NavbarIcon";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router";

export const AuthIcon = () => {
  const navigate = useNavigate();

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <div>
          <NavbarIcon text="Logout" color="red">
            <FiLogOut size="24" />
          </NavbarIcon>
        </div>
      </AlertDialog.Trigger>

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Logout</AlertDialog.Title>

        <AlertDialog.Description size="2">
          Are you sure you want to logout?
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <div>
              <Button
                variant="soft"
                color="gray"
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </AlertDialog.Cancel>

          <AlertDialog.Action>
            <div>
              <Button
                variant="solid"
                color="red"
                onClick={() => navigate("/logout")}
                className="hover:cursor-pointer"
              >
                Logout
              </Button>
            </div>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
