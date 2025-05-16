import { useContext, useEffect } from "react";

import { FiLogIn } from "react-icons/fi";
import { FaSun, FaMoon, FaUserFriends } from "react-icons/fa";
import { Flex, Separator } from "@radix-ui/themes";

import DarkmodeContext from "src/providers/ThemeProvider";
import { useAppSelector } from "src/hooks";
import { NavbarIcon } from "./NavbarIcon";
import { AuthIcon } from "./AuthIcon";
import { Balance } from "src/components/Balance";
import { useLocation } from "react-router";

const NavbarIcons = () => {
  const [darkTheme, setDarkTheme] = useContext(
    DarkmodeContext
  ) as DarkmodeContext;

  const user = useAppSelector((state) => state.user);

  const { pathname } = useLocation();

  useEffect(() => {}, [pathname]);

  return (
    <Flex
      justify="end"
      height="6rem"
      className="
    items-center justify-items-center text-center
    "
      gap="2"
    >
      {user.id && !pathname.startsWith("/store") && <Balance link />}

      <NavbarIcon
        text={darkTheme ? "Light Mode" : "Dark Mode"}
        onClick={() => setDarkTheme(!darkTheme)}
      >
        {darkTheme ? <FaSun size="24" /> : <FaMoon size="24" />}
      </NavbarIcon>

      {user.id && (
        <NavbarIcon text="Friends" path="/friends">
          <FaUserFriends size="24" />
        </NavbarIcon>
      )}

      <Separator orientation="vertical" size="2" />

      {user.id ? (
        <AuthIcon />
      ) : (
        <NavbarIcon path="/login" text="Login">
          <FiLogIn size="24" />
        </NavbarIcon>
      )}
    </Flex>
  );
};

export default NavbarIcons;
