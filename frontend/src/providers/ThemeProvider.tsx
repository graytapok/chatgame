import { createContext, PropsWithChildren } from "react";
import { Theme } from "@radix-ui/themes";

import useDarkMode from "src/hooks/useDarkMode";

type DarkmodeContext = ReturnType<typeof useDarkMode>;
const DarkmodeContext = createContext<DarkmodeContext | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const darkmode = useDarkMode();

  return (
    <DarkmodeContext.Provider value={darkmode}>
      <Theme
        accentColor="blue"
        grayColor="gray"
        panelBackground="solid"
        radius="large"
        scaling="110%"
      >
        {children}
      </Theme>
    </DarkmodeContext.Provider>
  );
}

export default DarkmodeContext;
