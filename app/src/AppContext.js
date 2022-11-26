import { createContext } from "react";

const AppContext = createContext({
  user: null,
  setUser: () => null,
  logout: () => null,
  installed: false,
  plans: [],
  appSettings: null,
  setAppSettings: () => null,
  socket: null,
  isAdmin: false,
  bookings: [],
  setBookings: () => null,
  shops: [],
  setShops: () => null,
});

export default AppContext;
