import { PaperPlaneIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { IconButton, TextField } from "@radix-ui/themes";
import { setTypedMessage } from "src/features/chatSlice";
import { useAppDispatch, useAppSelector } from "src/hooks";

const InputField = ({ emitMessage }: { emitMessage: () => void }) => {
  const chat = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      emitMessage();
    }
  };
  return (
    <TextField.Root
      size="3"
      placeholder="Type in some message..."
      variant="surface"
      onChange={(e) => dispatch(setTypedMessage(e.target.value))}
      value={chat.typedMessage}
      className="outline-1"
      onKeyDown={handleKeyDown}
    >
      <TextField.Slot>
        <Pencil1Icon height="16" width="16" />
      </TextField.Slot>
      <TextField.Slot className="pr-1">
        <IconButton
          variant="soft"
          className="hover:cursor-pointer"
          onClick={emitMessage}
        >
          <PaperPlaneIcon height="16" width="16" />
        </IconButton>
      </TextField.Slot>
    </TextField.Root>
  );
};

export default InputField;
