import { Outlet } from "react-router-dom";

function Test() {
  return (
    <>
      <h1 className="text-4xl">Test</h1>
      <Outlet />
    </>
  );
}

export default Test;
