import { createContext } from "react";

const AppContext = createContext({
  admin: null,
  setAdmin: () => null,
  logout: () => null,
  installed: false,
  appSettings: null,
  setAppSettings: () => null,
  currentHelp: 0,
  setCurrentHelp: () => null,
});

export default AppContext;
