import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContainer } from "../components/AuthContainer";
import FloatingTextField from "../components/FloatingTextField";
import Page from "../components/Page";
import PrimaryButton from "../components/UI/PrimaryButton";
import HttpClient from "../services/HttpClient";
import queryString from "query-string";
import { useContext } from "react";
import AppContext from "../AppContext";

export default function Register() {
  const query = queryString.parse(window.location.search);
  const { setRegisteredSuccessfully } = useContext(AppContext);
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    const body = {
      name,
      email,
      password,
      passwordAgain,
    };

    try {
      const { data } = await HttpClient().post("/api/auth/register", body);
      localStorage.setItem("token", data.token);

      if (query?.returnUrl) {
        return (window.location.href =
          "/register/success" +
          (query?.returnUrl ? "?returnUrl=" + query.returnUrl : ""));
      }

      setRegisteredSuccessfully(true);
      history.push("/register/success");
    } catch (error) {
      setError(error?.response?.data?.errors);

      console.log(error);
    }
  };
  return (
    <Page>
      <AuthContainer>
        <div className="content">
          <h1>Register</h1>
          <p className="header">
            Already have an account?{" "}
            <a href="#" onClick={() => history.push("/login")}>
              Sign in
            </a>
          </p>

          <form onSubmit={onSubmit}>
            <FloatingTextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name *"
              error={error?.name}
            />
            <FloatingTextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email *"
              error={error?.email}
            />
            <FloatingTextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={"password"}
              label="Password *"
              error={error?.password}
            />
            <FloatingTextField
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              type={"password"}
              label="Confirm Password *"
              error={error?.passwordAgain}
            />
            <PrimaryButton>Create Account</PrimaryButton>
          </form>
        </div>
      </AuthContainer>
    </Page>
  );
}
