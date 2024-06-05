import { Card, Flex, Heading } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  width?: string;
  className?: string;
  heading: string;
}

function CenterCard({ width, children, className, heading }: Props) {
  return (
    <Flex
      justify="center"
      className="top-[50%] transform -translate-y-[50%]"
      position="relative"
    >
      <Card
        className={`flex flex-col w-[${
          width ? width : "500px"
        }] gap-3 pt-10 pb-16 px-10 ${className ? className : ""}`}
      >
        <Heading size="7" className="text-center mb-4">
          {heading}
        </Heading>
        {children}
      </Card>
    </Flex>
  );
}

export default CenterCard;
