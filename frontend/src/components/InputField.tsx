import {
  EyeNoneIcon,
  EyeOpenIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Callout, IconButton, TextField } from "@radix-ui/themes";
import { ReactNode, useState } from "react";

interface Props {
  onChange: (e: any) => void;
  value: string;
  placeholder: string;
  type?:
    | "number"
    | "text"
    | "search"
    | "time"
    | "hidden"
    | "date"
    | "datetime-local"
    | "email"
    | "month"
    | "password"
    | "tel"
    | "url"
    | "week";
  icon: ReactNode;
  callout?: boolean;
  calloutMsg?: string;
  children?: ReactNode;
}

export const InputField = (p: Props) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((prev) => !prev);
  };

  return (
    <>
      <TextField.Root
        size="3"
        type={visible ? undefined : p.type}
        placeholder={p.placeholder}
        onChange={(e) => p.onChange(e.target.value)}
        value={p.value}
      >
        <TextField.Slot>{p.icon}</TextField.Slot>
        <TextField.Slot>
          {p.type === "password" ? (
            <IconButton
              variant="ghost"
              color="gray"
              className="hover:cursor-pointer"
              onClick={toggleVisibility}
            >
              {visible ? <EyeOpenIcon /> : <EyeNoneIcon />}
            </IconButton>
          ) : (
            p.children
          )}
        </TextField.Slot>
      </TextField.Root>

      {p.callout && (
        <Callout.Root color="red" variant="surface" size="1" className="mb-2">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{p.calloutMsg}</Callout.Text>
        </Callout.Root>
      )}
    </>
  );
};
