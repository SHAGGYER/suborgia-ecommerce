import { useEffect, useState } from "react";
import "./App.css";
import HttpClient from "./services/HttpClient";
import Navbar from "./components/Navbar";
import AppContext from "./AppContext";
import { Switch, Route, Redirect } from "react-router-dom";
import CustomerDashboard from "./pages/CustomerDashboard";
import Product from "./components/products/Product";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RegisterSuccess from "./pages/RegisterSuccess";

function App() {
  const [user, setUser] = useState(null);
  const [initiated, setInitiated] = useState(false);
  const [registeredSuccessfully, setRegisteredSuccessfully] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await HttpClient().get("/api/auth/init");

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
          registeredSuccessfully,
          setRegisteredSuccessfully,
        }}
      >
        <Navbar />
        <Switch>
          <Route path="/" exact>
            <CustomerDashboard />
          </Route>

          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register/success">
            <RegisterSuccess />
          </Route>
          <Route path="/register">
            <Register />
          </Route>

          <Route path="/cart">
            <Cart />
          </Route>

          <Route path="/payment">
            <Payment />
          </Route>

          <Route path="/products/:id" exact>
            <ProductDetail />
          </Route>

          <Route path="/categories/:categoryTitle" exact>
            <CustomerDashboard />
          </Route>

          <Route path="/categories/:categoryTitle/brand/:brand" exact>
            <CustomerDashboard />
          </Route>

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </AppContext.Provider>
    )
  );
}

export default App;
