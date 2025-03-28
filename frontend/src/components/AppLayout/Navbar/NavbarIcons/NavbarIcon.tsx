import { IconButton, Tooltip } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import { useNavigate } from "react-router";

interface NavbarIconProps extends PropsWithChildren {
  text: string;
  path?: string;
  className?: string;
  onClick?: () => void;
  color?: "red";
}

export const NavbarIcon = ({
  text,
  path,
  onClick,
  className,
  color,
  children,
}: NavbarIconProps) => {
  const navigate = useNavigate();

  return (
    <Tooltip content={text}>
      <IconButton
        size="3"
        radius="full"
        variant="soft"
        onClick={path ? () => navigate(path) : onClick}
        className={className + " hover:cursor-pointer"}
        color={color || undefined}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
};
