import { Scheduler } from "@9h/lib";
import { createContext, useMemo } from "react";
import { Lazy, useLazyValue } from "./useLazyValue";

class PenpalEngine {
  initialised = false;

  context = new AudioContext();
  scheduler = new Scheduler(this.context, 120);

  init() {}
}

interface AppContextValue {
  engine: Lazy<PenpalEngine>;
}

const appContextDefaultValue: AppContextValue = {
  // @ts-ignore
  engine: null,
};

export const AppContext = createContext(appContextDefaultValue);

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const engine = useLazyValue(() => new PenpalEngine());

  const value = useMemo(() => ({ engine }), []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
