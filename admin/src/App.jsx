import { useEffect, useState } from "react";
import "./App.css";
import HttpClient from "./services/HttpClient";
import AppContext from "./AppContext";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Wrapper } from "./components/UI/Wrapper";
import Sidebar from "./components/Sidebar";
import { Page } from "./components/UI/Page";
import Login from "./pages/Login";

import queryString from "query-string";
import cogoToast from "cogo-toast";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Plans from "./pages/Plans";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = queryString.parse(location.search);

  const [admin, setAdmin] = useState(null);
  const [initiated, setInitiated] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isDenmark, setIsDenmark] = useState(false);
  const [plans, setPlans] = useState([]);
  const [forbiddenDomains, setForbiddenDomains] = useState([]);
  const [appSettings, setAppSettings] = useState(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      cogoToast.success("Du er nu logget ind");
      navigate("/");
    }
  }, [isLoggedIn]);

  const init = async () => {
    const { data } = await HttpClient().get("/api/admin/auth/init");

    setInstalled(data.installed);
    setIsDenmark(data.isDenmark);
    setAppSettings(data.appSettings);

    if (data.admin) {
      setAdmin(data.admin);
    }
    setInitiated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAdmin(null);
  };

  return (
    initiated && (
      <AppContext.Provider
        value={{
          admin,
          setAdmin,
          logout,
          installed,
          plans,
          appSettings,
          setAppSettings,
        }}
      >
        {isDenmark ? (
          <>
            {installed && (
              <>
                {admin ? (
                  <>
                    <Wrapper>
                      <Sidebar />
                      <Page>
                        <Routes>
                          <Route path="/users" element={<Users />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/plans" element={<Plans />} />
                        </Routes>
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
