import { Text } from "@radix-ui/themes";
import { NavLink, NavLinkProps } from "react-router-dom";

import { ThemeColor } from "src/types/ui";

interface LinkProps extends NavLinkProps {
  to: string;
  size?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  color?: ThemeColor;
  className?: string;
  children?: React.ReactNode;
}

function Link({ to, children, color = "blue", className, size }: LinkProps) {
  return (
    <NavLink to={to}>
      <Text
        className={className + " hover:underline" || "hover:underline"}
        color={color}
        size={size || undefined}
      >
        {children}
      </Text>
    </NavLink>
  );
}

export default Link;
