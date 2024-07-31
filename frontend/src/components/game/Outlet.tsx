import { Heading } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";

function GameOutlet() {
  return (
    <>
      <Heading>GameOutlet</Heading>
      <Outlet />
    </>
  );
}

export default GameOutlet;
