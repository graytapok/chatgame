import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box, Flex } from "@radix-ui/themes";

function AppLayout() {
  return (
    <>
      <Navbar />
      <Flex className="justify-center w-full h-[100vh] py-[70px]">
        <Box width="screen" className="m-0 max-w-screen-xl w-full h-full">
          <Outlet />
        </Box>
      </Flex>
      <Footer />
    </>
  );
}

export default AppLayout;
