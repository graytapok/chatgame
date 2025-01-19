import { Outlet } from "react-router";
import { Box, Flex } from "@radix-ui/themes";

function Main() {
  return (
    <Flex className="justify-center p-4 w-full dark:bg-black mt-16">
      <Box width="screen" className="max-w-screen-xl w-full h-full">
        <Outlet />
      </Box>
    </Flex>
  );
}

export default Main;
