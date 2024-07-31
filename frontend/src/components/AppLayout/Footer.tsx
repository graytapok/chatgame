import { Flex, Heading } from "@radix-ui/themes";

function Footer() {
  return (
    <Flex className="h-[64px] flex justify-center items-center bg-white dark:bg-neutral-900 shadow-lg">
      <Flex
        justify="between"
        width="screen"
        className="mx-5 h-16 m-0 max-w-screen-xl items-center justify-between w-full"
      >
        <Heading size="6">Footer</Heading>
        Coming soon...
      </Flex>
    </Flex>
  );
}

export default Footer;
