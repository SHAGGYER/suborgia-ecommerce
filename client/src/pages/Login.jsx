import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { AuthContainer } from "../components/AuthContainer";
import FloatingTextField from "../components/FloatingTextField";
import Page from "../components/Page";
import PrimaryButton from "../components/UI/PrimaryButton";
import HttpClient from "../services/HttpClient";
import queryString from "query-string";

export default function Login() {
  const query = queryString.parse(window.location.search);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generalError, setGeneralError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    const body = {
      email,
      password,
    };

    try {
      setLoading(true);
      const { data } = await HttpClient().post("/api/auth/login", body);
      localStorage.setItem("token", data.token);

      if (query?.returnUrl) {
        return (window.location.href = query.returnUrl);
      }

      window.location.href = "/";
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.errors);
      setGeneralError(error?.response?.data?.message);
      setLoading(false);
    }
  };
  return (
    <Page>
      <AuthContainer>
        <div className="content">
          <h1>Sign in</h1>
          <p className="header">
            Need an account?{" "}
            <a
              href="#"
              onClick={() =>
                history.push(
                  "/register" +
                    (query?.returnUrl ? `?returnUrl=${query.returnUrl}` : "")
                )
              }
            >
              Sign up
            </a>
          </p>
          <div className="header">
            Forgot Password?{" "}
            <a href="#" onClick={() => history.push("/forgot-password")}>
              Reset password
            </a>
          </div>

          {generalError && <p style={{ color: "red" }}>{generalError}</p>}

          <form onSubmit={onSubmit}>
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

            <PrimaryButton disabled={loading}>
              {loading && <i className="fa fa-spinner fa-spin"></i>}
              Login
            </PrimaryButton>
          </form>
        </div>
      </AuthContainer>
    </Page>
  );
}
