import { Slide, ToastContainer } from "react-toastify";
import { useContext } from "react";

import DarkmodeContext from "./ThemeProvider";

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
