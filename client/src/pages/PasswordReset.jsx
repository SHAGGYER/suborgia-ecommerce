import React from "react";
import Page from "../../../admin/src/components/Page";
import FloatingTextField from "../components/FloatingTextField";
import PrimaryButton from "../components/UI/PrimaryButton";
import queryString from "query-string";
import HttpClient from "../services/HttpClient";
import { useEffect } from "react";
import { useState } from "react";
import { Wrapper } from "../components/Wrapper";

export default function PasswordReset() {
  const { code } = queryString.parse(window.location.search);

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [generalError, setGeneralError] = useState(null);

  useEffect(() => {
    verifyCode();
  }, []);

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await HttpClient().post("/api/auth/reset-password", {
        id: user?.id,
        password,
        passwordAgain,
        code,
      });
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  };

  const verifyCode = async () => {
    try {
      const { data } = await HttpClient().get(
        "/api/auth/verify-password-reset-code?code=" + code
      );
      setUser(data.content);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        setError(error.response?.data?.errors);
      } else if (error.response?.data?.message) {
        setGeneralError(error.response?.data?.message);
      }
    }
  };

  return (
    <Page>
      <Wrapper>
        {user && (
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "start",
            }}
            onSubmit={resetPassword}
          >
            <h1>Password Reset</h1>
            {generalError && <p>{generalError}</p>}
            <FloatingTextField
              label={"Password"}
              value={password}
              error={error?.password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <FloatingTextField
              label={"Confirm Password"}
              value={passwordAgain}
              error={error?.passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              type="password"
            />
            <PrimaryButton>Save</PrimaryButton>
          </form>
        )}
      </Wrapper>
    </Page>
  );
}
