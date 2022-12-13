import {createContext} from "react";

const AppContext = createContext({
  admin: null,
  setAdmin: () => null,
  logout: () => null,
  installed: false,
  appSettings: null,
  setAppSettings: () => null,
});

export default AppContext;
