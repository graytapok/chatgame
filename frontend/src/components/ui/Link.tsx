import { Text } from "@radix-ui/themes";
import { NavLink, NavLinkProps } from "react-router-dom";

interface LinkProps extends NavLinkProps {
  to: string;
  size?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  className?: string;
  children?: React.ReactNode;
}

export function Link({ to, children, className, size }: LinkProps) {
  return (
    <NavLink to={to}>
      <Text
        className={className + " hover:underline" || "hover:underline"}
        color="blue"
        size={size || undefined}
      >
        {children}
      </Text>
    </NavLink>
  );
}
