import { createContext } from "react";

const AppContext = createContext({
  user: null,
  setUser: () => null,
  logout: () => null,
  plans: [],
  plan: null,
  setPlan: () => null,
  installed: false,
  appSettings: null,
  setAppSettings: () => null,
  socket: null,
});

export default AppContext;
