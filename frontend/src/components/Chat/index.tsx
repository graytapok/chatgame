import { useEffect } from "react";

import { Flex, Spinner } from "@radix-ui/themes";
import { manager } from "src/api/sockets";
import { useAppDispatch, useAppSelector } from "src/hooks";
import {
  addMessage,
  Message as MessageType,
  reset,
  setTypedMessage,
} from "src/features/chatSlice";
import InputField from "./InputField";
import Messages from "./Messages";
import { Socket } from "socket.io-client";

const chatSocket = manager.socket("/chat");

interface Props {
  loading?: boolean;
  className?: string;
  socket?: Socket;
  height?: string;
}

function Chat({
  className,
  height,
  loading = false,
  socket = chatSocket,
}: Props) {
  const chat = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  const emitMessage = () => {
    if (chat.typedMessage !== "" && !loading) {
      socket.emit("message", chat.typedMessage);
      dispatch(setTypedMessage(""));
    }
  };

  useEffect(() => {
    const onMessage = (data: MessageType) => dispatch(addMessage(data));

    if (!loading) {
      socket.on("message", onMessage);
    }

    return () => {
      socket.off("message", onMessage);

      if (!loading) {
        dispatch(reset());
      }
    };
  }, [loading]);

  return (
    <Flex direction="column" className={className || ""}>
      {loading ? <Searching height={height} /> : <Messages height={height} />}
      <InputField emitMessage={emitMessage} />
    </Flex>
  );
}

const Searching = ({ height }: { height?: string }) => {
  return (
    <Flex
      className={`${
        height ? `h-[${height}]` : "h-96"
      } justify-center items-center flex-col gap-4`}
    >
      <span>Searching for opponents...</span>
      <Spinner size="3" />
    </Flex>
  );
};

export default Chat;
