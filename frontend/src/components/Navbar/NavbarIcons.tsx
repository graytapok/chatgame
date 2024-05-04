import { BsGearFill } from "react-icons/bs";
import { FiLogIn } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";

import useDarkMode from "../../hooks/useDarkMode";

interface NavbarIconProps {
  icon: any;
  text: string;
  onClick?: () => void;
}

const NavbarIcons = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <div
      className="
        fixed top-0 right-0
        flex flex-row justify-end
      "
    >
      <NavbarIcon icon={<IoSearch size="28" />} text="Search" />
      <NavbarIcon
        onClick={handleMode}
        icon={darkTheme ? <FaSun size="24" /> : <FaMoon size="24" />}
        text={darkTheme ? "Light Mode" : "Dark Mode"}
      />
      <NavbarIcon icon={<BsGearFill size="24" />} text="Settings" />
      <NavbarIconsDivider />
      <NavbarIcon icon={<FiLogIn size="28" />} text="Login" />
    </div>
  );
};

const NavbarIcon = ({ icon, text = "tooltip", onClick }: NavbarIconProps) => (
  <div className="navbar-icon group" onClick={onClick}>
    {icon}
    <span className="navbar-tooltip group-hover:scale-100 whitespace-nowrap">
      {text}
    </span>
  </div>
);

const NavbarIconsDivider = () => (
  <div
    className="
          h-12 min-h-[1em] my-auto
          w-px self-stretch border-t-0 bg-gradient-to-tr 
          from-transparent via-neutral-500 to-transparent opacity-25 
          dark:via-neutral-400 lg:block
      "
  ></div>
);

export default NavbarIcons;
