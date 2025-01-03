import { Provider as ReduxProvider } from "react-redux";

import { store } from "src/store";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";
import { RoutingProvider } from "./RoutingProvider";

const Providers = () => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <ReduxProvider store={store}>
          <AuthProvider>
            <RoutingProvider />
            <ToastProvider />
          </AuthProvider>
        </ReduxProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};

export default Providers;
