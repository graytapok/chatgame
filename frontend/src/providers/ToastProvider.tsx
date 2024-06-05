import { Slide, ToastContainer } from "react-toastify";

import DarkmodeContext from "./ThemeProvider";
import { useContext } from "react";

export function ToastProvider() {
  const [darkmode] = useContext(DarkmodeContext) as DarkmodeContext;

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={true}
        pauseOnHover
        theme={darkmode ? "dark" : "light"}
        transition={Slide}
        stacked
      />
    </>
  );
}
