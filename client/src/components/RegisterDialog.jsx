import React, { useState } from "react";
import { useDialog } from "react-st-modal";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import { Form } from "./UI/Form";
import { UI } from "./UI/UI";
import cogoToast from "cogo-toast";
import PrimaryButton from "./UI/PrimaryButton";
import FloatingTextField from "./FloatingTextField";

const Wrapper = styled.div`
  background-color: var(--primary);
  padding: 2rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

const Plan = styled.div`
  background-color: var(--primary-dark);
  display: inline-block;
  padding: 1rem;
  margin-bottom: 1rem;

  h2 {
    font-family: "Anton", sans-serif;
    font-size: 25px;
    margin-bottom: 0.5rem;
  }

  h4 {
    font-size: 20px;
    margin-bottom: 0;
  }
`;

export default function RegisterDialog({
  details,
  onRegisterSuccessful,
  onBack,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState({});

  const register = async (ev) => {
    ev.preventDefault();

    try {
      const body = {
        name,
        email,
        password,
        passwordAgain,
        ...details,
      };

      const { data } = await HttpClient().post("/api/auth/register", body);
      localStorage.setItem("token", data.token);
      onRegisterSuccessful(data.user);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
      }
    }
  };

  return (
    <Wrapper>
      <h2>Din Konto</h2>

      <form onSubmit={register}>
        <UI.Spacer bottom={1} />
        <FloatingTextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label={"Email"}
          error={error.email}
        />
        <UI.Spacer bottom={1} />
        <FloatingTextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label={"Password"}
          error={error.password}
        />
        <UI.Spacer bottom={1} />
        <FloatingTextField
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
          type="password"
          label={"Password Again"}
          error={error.passwordAgain}
        />
        <UI.Spacer bottom={1} />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <PrimaryButton type={"submit"}>Næste</PrimaryButton>
          <PrimaryButton type={"button"} onClick={onBack}>
            Back
          </PrimaryButton>
        </div>
      </form>
    </Wrapper>
  );
}
