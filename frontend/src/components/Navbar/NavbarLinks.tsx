import { NavLink } from "react-router-dom";

interface INavbarLink {
  location: string;
  text: string;
}

function NavbarLink({ location, text }: INavbarLink) {
  return (
    <NavLink
      to={location}
      className={({ isActive }) =>
        isActive ? "navbar-link active" : "navbar-link"
      }
    >
      {text}
    </NavLink>
  );
}

function NavbarLinks() {
  return (
    <ul className="flex items-center gap-2 pl-4">
      <li>
        <NavbarLink location="/" text="Home" />
      </li>
      <li>
        <NavbarLink location="/about" text="About" />
      </li>
      <li>
        <NavbarLink location="/test" text="Test" />
      </li>
    </ul>
  );
}

export default NavbarLinks;
