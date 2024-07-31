import { Button as TButton } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

import { ThemeColor } from "src/types/ui";

interface ButtonProps extends PropsWithChildren {
  size?: "1" | "2" | "3" | "4";
  variant?: "classic" | "solid" | "soft" | "surface" | "outline" | "ghost";
  highContrast?: boolean;
  radius?: "none" | "small" | "medium" | "large" | "full";
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  color?: ThemeColor;
  id?: string;
  onClick?: (...args: any[]) => void;
}

function Button({
  className,
  loading = false,
  disabled = false,
  onClick,
  children,
  color,
  highContrast = false,
  size,
  variant,
  radius,
  id,
}: ButtonProps) {
  return (
    <TButton
      size={size || undefined}
      variant={variant || undefined}
      radius={radius || undefined}
      highContrast={highContrast}
      className={className + " hover:cursor-pointer"}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      color={color || undefined}
      id={id}
    >
      {children}
    </TButton>
  );
}

export default Button;
