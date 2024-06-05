import {
  QueryProvider,
  RoutingProvider,
  AuthProvider,
  ToastProvider,
  ThemeProvider,
} from "./providers";

import "./index.css";

const App = () => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <RoutingProvider />
          <ToastProvider />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};

export default App;
