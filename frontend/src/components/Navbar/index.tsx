import NavbarIcons from "./NavbarIcons";
import NavbarLinks from "./NavbarLinks";

import "./index.css";

const Navbar = () => {
  return (
    <div
      className="
        w-screen h-16 m-0
        flex flex-row
        bg-white dark:bg-primary shadow-lg
      "
    >
      <NavbarLabel />
      <NavbarLinks />
      <NavbarIcons />
    </div>
  );
};

const NavbarLabel = () => (
  <h1 className="font-sans my-auto ml-3 font-bold text-black text-3xl dark:text-white select-none">
    Chatgame
  </h1>
);

export default Navbar;
