import { useContext } from "react";

import { FiLogIn } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { FaSun, FaMoon, FaUserFriends } from "react-icons/fa";
import { Flex, Separator } from "@radix-ui/themes";

import DarkmodeContext from "src/providers/ThemeProvider";
import { useAppSelector } from "src/hooks";
import { NavbarIcon } from "./NavbarIcon";
import { AuthIcon } from "./AuthIcon";

const NavbarIcons = () => {
  const [darkTheme, setDarkTheme] = useContext(
    DarkmodeContext
  ) as DarkmodeContext;

  const user = useAppSelector((state) => state.user);

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

      {user.authenticated && (
        <NavbarIcon text="Friends" path="/friends">
          <FaUserFriends size="24" />
        </NavbarIcon>
      )}

      <Separator orientation="vertical" size="2" />

      {user.authenticated ? (
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
