import { NavLink } from "react-router-dom";
import { useAppSelector } from "src/hooks";

interface INavbarLink {
  location: string;
  text: string;
}

function NavbarLink({ location, text }: INavbarLink) {
  return (
    <NavLink
      to={location}
      className={({ isActive }) =>
        isActive ? "navbar-link navbar-link-active" : "navbar-link"
      }
    >
      {text}
    </NavLink>
  );
}

function NavbarLinks() {
  const user = useAppSelector((state) => state.user);
  return (
    <ul className="flex items-center gap-4 pl-8 mt-1">
      <li>
        <NavbarLink location="/" text="Home" />
      </li>
      <li>
        <NavbarLink location="/game" text="Game" />
      </li>
      <li>
        <NavbarLink location="/leaderboard" text="Leaderboard" />
      </li>
      <li>
        <NavbarLink location="/about" text="About" />
      </li>
      {user.admin && (
        <li>
          <NavbarLink location="/test" text="Test" />
        </li>
      )}
    </ul>
  );
}

export default NavbarLinks;
