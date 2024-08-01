import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import {
  QueryProvider,
  RoutingProvider,
  ToastProvider,
  ThemeProvider,
} from "./providers";
import "./index.css";
import { store } from "./store";
import AuthProvider from "./providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
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
