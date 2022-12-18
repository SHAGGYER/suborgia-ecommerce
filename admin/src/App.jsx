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
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Coupons from "./pages/Coupons";
import CreateUpdateStockCollection from "./pages/CreateUpdateStockCollection";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import CreateBanner from "./pages/CreateBanner";
import Orders from "./pages/Orders";
import Banners from "./pages/Banners";
import Brands from "./pages/Brands";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = queryString.parse(location.search);

  const [admin, setAdmin] = useState(null);
  const [initiated, setInitiated] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [plans, setPlans] = useState([]);
  const [appSettings, setAppSettings] = useState(null);
  const [currentHelp, setCurrentHelp] = useState(0);

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
    const { data } = await HttpClient().get("/api/auth/init");

    if (data.user) {
      setAdmin(data.user);
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
          currentHelp,
          setCurrentHelp,
        }}
      >
        <>
          {admin ? (
            <>
              <Wrapper>
                <Sidebar />
                <Page>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/brands" element={<Brands />} />
                    <Route path="/coupons" element={<Coupons />} />
                    <Route path="/banners/create" element={<CreateBanner />} />
                    <Route path="/banners" element={<Banners />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route
                      path="/products/stock-collection/:id"
                      element={<CreateUpdateStockCollection />}
                    />
                    <Route path="/products" element={<Products />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Page>
              </Wrapper>
            </>
          ) : (
            <Login />
          )}
        </>
      </AppContext.Provider>
    )
  );
}

export default App;
