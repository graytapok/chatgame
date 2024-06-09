import { Heading, Flex } from "@radix-ui/themes";

import NavbarIcons from "./NavbarIcons";
import NavbarLinks from "./NavbarLinks";

import "./index.css";

const Navbar = () => {
  return (
    <Flex
      width="screen"
      justify="center"
      top="0"
      position="absolute"
      height="64px"
      className="w-full justify-center bg-white dark:bg-primary shadow-lg"
    >
      <Flex
        justify="between"
        width="screen"
        className="
        mx-5 h-16 m-0 max-w-screen-xl items-center justify-between w-full
      "
      >
        <Flex>
          <NavbarLabel />
          <NavbarLinks />
        </Flex>
        <NavbarIcons />
      </Flex>
    </Flex>
  );
};

const NavbarLabel = () => (
  <Heading
    className="
       my-auto ml-3 
       text-black dark:text-white select-none
    "
    size="7"
    weight="bold"
  >
    Chatgame
  </Heading>
);

export default Navbar;
