import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "src/providers/AuthProvider";

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
  const { user } = useContext(AuthContext) as AuthContext;
  return (
    <ul className="flex items-center gap-4 pl-8 mt-1">
      <li>
        <NavbarLink location="/" text="Home" />
      </li>
      <li>
        <NavbarLink location="/about" text="About" />
      </li>
      {user?.admin && (
        <li>
          <NavbarLink location="/test" text="Test" />
        </li>
      )}
    </ul>
  );
}

export default NavbarLinks;
