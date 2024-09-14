import { Flex, ScrollArea } from "@radix-ui/themes";
import { Strong, Text } from "@radix-ui/themes";
import { useEffect, useRef } from "react";

import { useAppSelector } from "src/hooks";
import { Message as MessageType } from "src/features/chatSlice";

const Message = ({ message }: { message: MessageType }) => {
  return (
    <Text>
      {message.type === "message" && (
        <>
          <Strong>{message.sender && `${message.sender}: `}</Strong>
          {message.message}
        </>
      )}
      {message.type === "info" && <Strong>{message.message}</Strong>}
    </Text>
  );
};

const Messages = ({ height }: { height?: string }) => {
  const chat = useAppSelector((state) => state.chat);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [chat.messages]);

  return (
    <ScrollArea
      dir="rtl"
      type="auto"
      scrollbars="vertical"
      size="2"
      className={height ? `h-[${height}]` : "h-96"}
    >
      <Flex direction="column">
        {chat.messages.map((message, i) => (
          <Message message={message} key={i} />
        ))}
      </Flex>
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

export default Messages;
