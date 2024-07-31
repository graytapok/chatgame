import { PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsGearFill } from "react-icons/bs";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";
import { Flex, IconButton, Separator, AlertDialog } from "@radix-ui/themes";

import DarkmodeContext from "src/providers/ThemeProvider";
import Button from "src/components/ui/Button";
import AuthContext from "src/providers/AuthProvider";

const NavbarIcons = () => {
  const [darkTheme, setDarkTheme] = useContext(
    DarkmodeContext
  ) as DarkmodeContext;
  const navigate = useNavigate();

  const { user } = useContext(AuthContext) as AuthContext;

  return (
    <Flex
      justify="end"
      height="6rem"
      className="
    items-center justify-items-center text-center
    "
      gap="2"
    >
      <NavbarIcon text="Search">
        <IoSearch size="24" />
      </NavbarIcon>

      <NavbarIcon
        text={darkTheme ? "Light Mode" : "Dark Mode"}
        onClick={() => setDarkTheme(!darkTheme)}
      >
        {darkTheme ? <FaSun size="24" /> : <FaMoon size="24" />}
      </NavbarIcon>

      <NavbarIcon text="Settings">
        <BsGearFill size="24" />
      </NavbarIcon>

      <Separator orientation="vertical" size="2" />

      {user ? (
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <div>
              <NavbarIcon text="Logout" color="red">
                {user ? <FiLogOut size="24" /> : <FiLogIn size="24" />}
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
      ) : (
        <NavbarIcon onClick={() => navigate("/login")} text="Login">
          {user ? <FiLogOut size="24" /> : <FiLogIn size="24" />}
        </NavbarIcon>
      )}
    </Flex>
  );
};

interface NavbarIconProps extends PropsWithChildren {
  text: string;
  onClick?: () => void;
  className?: string;
  color?: "red";
}

const NavbarIcon = ({
  onClick,
  className,
  color,
  children,
}: NavbarIconProps) => (
  <IconButton
    size="3"
    radius="full"
    variant="soft"
    onClick={onClick}
    className={className + " hover:cursor-pointer"}
    color={color || undefined}
  >
    {children}
  </IconButton>
);

export default NavbarIcons;
