import { useEffect, useState } from "react";
import "./App.css";
import HttpClient from "./services/HttpClient";
import Navbar from "./components/Navbar";
import AppContext from "./AppContext";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import InstallationWizard from "./components/InstallationWizard";
import Sales from "./pages/Sales";
import NewAccount from "./pages/NewAccount";
import Shop from "./pages/Shop";
import CustomerDashboard from "./pages/CustomerDashboard";
import io from "socket.io-client";

function App() {
  const [user, setUser] = useState(null);
  const [initiated, setInitiated] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isDenmark, setIsDenmark] = useState(false);
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState(null);
  const [appSettings, setAppSettings] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await HttpClient().get("/api/auth/init");

    setInstalled(data.installed);
    setIsDenmark(data.isDenmark);
    setAppSettings(data.appSettings);
    setPlans(data.plans);

    const socket = io(import.meta.env.VITE_SERVER_URL, {
      transports: ["websocket"],
      upgrade: true,
    });
    setSocket(socket);

    if (data.user) {
      setUser(data.user);
    }
    setInitiated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
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
          plan,
          setPlan,
          appSettings,
          setAppSettings,
          plans,
          socket,
        }}
      >
        {isDenmark ? (
          <>
            {installed && (
              <Switch>
                <Route path="/new-account">
                  <Navbar />
                  <NewAccount />
                </Route>

                <Route path="/sales">
                  <Navbar />
                  <Sales />
                </Route>

                <Route path="/:slug">
                  <Shop />
                </Route>

                <Route path="/" exact>
                  <Navbar />
                  <CustomerDashboard />
                </Route>

                <Route path="*">
                  <Redirect to="/" />
                </Route>
              </Switch>
            )}
            {!installed && <InstallationWizard />}
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
