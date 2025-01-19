import { Provider as ReduxProvider } from "react-redux";

import { store } from "src/store";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";
import { RoutingProvider } from "./RoutingProvider";

const Providers = () => {
  return (
    <ReduxProvider store={store}>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider>
            <RoutingProvider />
            <ToastProvider />
          </ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </ReduxProvider>
  );
};

export default Providers;
