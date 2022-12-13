import { useEffect, useState } from "react";
import "./App.css";
import HttpClient from "./services/HttpClient";
import AppContext from "./AppContext";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Wrapper } from "./components/UI/Wrapper";
import { Page } from "./components/UI/Page";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import queryString from "query-string";
import cogoToast from "cogo-toast";
import ChangePassword from "./pages/ChangePassword";
import Settings from "./pages/Settings";
import UpdateCreditCard from "./pages/UpdateCreditCard";
import Subscription from "./pages/Subscription";
import Sidebar from "./components/Sidebar";
import Calendar from "./components/Calendar";
import io from "socket.io-client";
import SuccessSound from "./sounds/success.mp3";
import LiveFeed from "./pages/LiveFeed";
import moment from "moment";
import Products from "./pages/Products";
import Purchases from "./pages/Purchases";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, adminAsUserToken } = queryString.parse(location.search);

  const [user, setUser] = useState(null);
  const [initiated, setInitiated] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isDenmark, setIsDenmark] = useState(false);
  const [plans, setPlans] = useState([]);
  const [appSettings, setAppSettings] = useState(null);
  const [socket, setSocket] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (adminAsUserToken) {
      localStorage.setItem("token", adminAsUserToken);
      init();
    }
  }, [adminAsUserToken]);

  useEffect(() => {
    if (isLoggedIn) {
      cogoToast.success("Du er nu logget ind");
      navigate("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (socket && user) {
      socket.on("new-booking", (booking) => {
        if (moment().isSame(booking.start, "day")) {
          const successSound = document.getElementById("audio");
          audio.src = SuccessSound;
          successSound.play();
          setBookings((prev) => [...prev, booking]);
        }
      });

      return () => {
        socket.off("new-booking");
      };
    }
  }, [socket, user]);

  useEffect(() => {
    if (socket && user) {
      socket.on("connection-successful", (data) => {
        socket.emit("join-admin", {
          adminId: user._id,
          shopIds: shops.map((x) => x._id),
        });
      });
    }
  }, [socket, user, shops]);

  const init = async () => {
    const { data } = await HttpClient().get("/api/auth/init");

    setInstalled(data.installed);
    setIsDenmark(data.isDenmark);
    setPlans(data.plans);
    setAppSettings(data.appSettings);

    if (data.user) {
      setUser(data.user);
      const socket = io(import.meta.env.VITE_SERVER_URL, {
        transports: ["websocket"],
        upgrade: true,
      });
      setSocket(socket);
      setShops(data.shops);

      setIsAdmin(data.isAdmin);
    }

    setInitiated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    initiated && (
      <AppContext.Provider
        value={{
          user,
          setUser,
          logout,
          installed,
          plans,
          appSettings,
          setAppSettings,
          socket,
          isAdmin,
          bookings,
          setBookings,
          shops,
          setShops,
        }}
      >
        {isDenmark ? (
          <>
            {installed && (
              <>
                {user ? (
                  <>
                    <Wrapper>
                      <Sidebar />
                      <Page>
                        <Routes>
                          <Route path="/live-feed" element={<LiveFeed />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/purchases" element={<Purchases />} />
                          <Route
                            path="/change-password"
                            element={<ChangePassword />}
                          />
                          <Route path="/calendar" element={<Calendar />} />
                          <Route
                            path="/subscription"
                            element={<Subscription />}
                          />
                          <Route
                            path="/update-card"
                            element={<UpdateCreditCard />}
                          />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/" exact element={<Dashboard />} />
                        </Routes>
                        {/*<HelpDesk/>*/}
                      </Page>
                    </Wrapper>
                  </>
                ) : (
                  <Login />
                )}
              </>
            )}
          </>
        ) : (
          <div>
            <h1>You must be located in Denmark in order to use this app.</h1>
          </div>
        )}
      </AppContext.Provider>
    )
  );
}

export default App;
