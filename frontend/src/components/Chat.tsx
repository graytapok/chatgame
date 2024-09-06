import { useEffect, useRef, useState } from "react";
import {
  Flex,
  IconButton,
  Strong,
  TextField,
  Text,
  ScrollArea,
  Spinner,
} from "@radix-ui/themes";
import { PaperPlaneIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { manager } from "src/api/sockets";

interface Message {
  type: "message" | "info";
  message: string;
  sender: string | null;
}

interface Props {
  room?: string;
  loading?: boolean;
  className?: string;
  namespace?: string;
}

function Chat({
  loading = false,
  room = "1",
  className,
  namespace = "/chat",
}: Props) {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const socket = manager.socket(namespace);

  const emitMessage = () => {
    if (typedMessage !== "" && !loading) {
      socket.emit("message", typedMessage, room);
      setTypedMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      emitMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const onInfo = (info: Message) => {
      setMessages((prev) => [
        ...prev,
        { type: "info", message: info.message, sender: null },
      ]);
    };

    const onMessage = (data: Message) => {
      setMessages((prev) => [...prev, { ...data, type: "message" }]);
    };

    if (!loading) {
      if (!namespace) {
        socket.connect();
      }
      socket.emit("join_room", room);

      socket.on("info", onInfo);
      socket.on("message", onMessage);
    }

    return () => {
      socket.off("info", onInfo);
      socket.off("message", onMessage);

      if (!loading) {
        setMessages([]);
        socket.emit("leave_room", room);
        if (!namespace) {
          socket.disconnect();
        }
      }
    };
  }, [loading]);

  return (
    <Flex direction="column" className={className || ""}>
      {!loading ? (
        <ScrollArea
          dir="rtl"
          type="auto"
          scrollbars="vertical"
          size="2"
          className="h-96"
        >
          <Flex direction="column">
            {messages.map((message, i) => (
              <Text key={i}>
                {message.type === "message" && (
                  <>
                    <Strong>{message.sender && `${message.sender}: `}</Strong>
                    {message.message}
                  </>
                )}
                {message.type === "info" && <Strong>{message.message}</Strong>}
              </Text>
            ))}
          </Flex>
          <div ref={messagesEndRef} />
        </ScrollArea>
      ) : (
        <Flex className="h-96 justify-center items-center flex-col gap-4">
          <span>Searching for opponents...</span>
          <Spinner size="3" />
        </Flex>
      )}

      <TextField.Root
        size="3"
        placeholder="Type in some message..."
        variant="surface"
        value={typedMessage}
        onChange={(e) => setTypedMessage(e.target.value)}
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
    </Flex>
  );
}

export default Chat;
