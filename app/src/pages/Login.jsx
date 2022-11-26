import React, { useState } from "react";
import { useDialog } from "react-st-modal";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import { Form } from "../components/UI/Form";
import { UI } from "../components/UI/UI";
import { Alert } from "../components/UI/Alert";
import PrimaryButton from "../components/UI/PrimaryButton";
import { ClipLoader } from "react-spinners";

const Wrapper = styled.div`
  background-color: var(--primary);
  padding: 1rem;
  max-width: 600px;
  margin: 2rem auto 0;

  h2 {
    margin: 0 0 1rem;
    font-size: 40px;
  }
`;

export default function Login() {
  const dialog = useDialog();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const login = async (event) => {
    event.preventDefault();
    try {
      const body = {
        email,
        password,
      };

      setLoading(true);
      const { data } = await HttpClient().post("/api/auth/login", body);
      localStorage.setItem("token", data.token);
      dialog.close();
      setTimeout(() => {
        window.location.href = "/barber?isLoggedIn=true";
      }, 1000);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data);
      }

      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <h2>Login</h2>
      {!!error.error && (
        <Alert error color="white">
          {error.error}
        </Alert>
      )}
      <form onSubmit={login}>
        <Form.TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label={"Email"}
          error={error.email}
        />
        <UI.Spacer bottom={1} />
        <Form.TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label={"Password"}
          error={error.password}
        />
        <UI.Spacer bottom={1} />
        <PrimaryButton onClick={login} disabled={loading}>
          <ClipLoader loading={loading} size={20} />
          Login
        </PrimaryButton>
      </form>
    </Wrapper>
  );
}
