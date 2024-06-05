import { Flex, Heading } from "@radix-ui/themes";

function Footer() {
  return (
    <Flex
      width="screen"
      position="absolute"
      bottom="0"
      height="64px"
      justify="center"
      className=" w-full justify-center bg-white dark:bg-primary shadow-lg"
    >
      <Flex
        justify="between"
        width="screen"
        className="
    mx-5 h-16 m-0 max-w-screen-xl items-center justify-between w-full
  "
      >
        <Heading size="6">Footer</Heading>
        Coming soon...
      </Flex>
    </Flex>
  );
}

export default Footer;
