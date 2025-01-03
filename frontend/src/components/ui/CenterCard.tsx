import { Card, Flex, Heading } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  className?: string;
  heading: string;
}

export function CenterCard({ children, className, heading }: Props) {
  return (
    <Flex
      justify="center"
      className="top-[50%] transform -translate-y-[50%]"
      position="relative"
    >
      <Card
        className={`w-[500px] flex flex-col gap-3 pt-10 pb-16 px-10 ${
          className || ""
        }`}
      >
        <Heading size="7" className="text-center mb-4">
          {heading}
        </Heading>
        {children}
      </Card>
    </Flex>
  );
}
