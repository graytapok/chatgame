import { Heading, Text } from "@radix-ui/themes";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  title: string;
  text: string;
}

export const PageHeading = ({ children, text, title }: Props) => {
  return (
    <>
      <div className="mt-16 flex justify-center mb-8 relative">
        <div className="flex justify-center flex-col gap-4 items-center">
          <Heading as="h1" size="9">
            {title}
          </Heading>
          <Text size="4">{text}</Text>
          {children}
        </div>
      </div>
    </>
  );
};
