import React, { useEffect } from "react";
import HttpClient from "../services/HttpClient";
import styled from "styled-components";
import PrimaryButton from "../components/UI/PrimaryButton";
import cogoToast from "cogo-toast";
import { Form } from "../components/UI/Form";
import { UI } from "../components/UI/UI";
import { Alert } from "../components/UI/Alert";

const Wrapper = styled.form`
  max-width: 800px;
`;

function ChangePassword(props) {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordAgain, setNewPasswordAgain] = React.useState("");
  const [error, setError] = React.useState({});

  const onSubmit = async (e) => {
    e.preventDefault();

    const body = {
      currentPassword,
      newPassword,
      newPasswordAgain,
    };

    try {
      await HttpClient().post("/api/user/change-password", body);
      cogoToast.success("Du har skiftet dit kodeord");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordAgain("");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError(error.response.data.errors);
      } else if (error.response && error.response.status === 400) {
        setError(error.response.data);
      }
    }
  };

  return (
    <>
      <Wrapper onSubmit={onSubmit}>
        <h3>Skift Kodeord</h3>
        <UI.Spacer bottom={1} />

        {!!error.error && (
          <>
            <Alert error>{error.error}</Alert>
            <UI.Spacer bottom={1} />
          </>
        )}

        <Form.TextField
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          label="Nuværende Kodeord"
          type="password"
          error={error.currentPassword}
        />
        <UI.Spacer bottom={1} />
        <Form.TextField
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          label="Nyt Kodeord"
          type="password"
          error={error.newPassword}
        />
        <UI.Spacer bottom={1} />

        <Form.TextField
          value={newPasswordAgain}
          onChange={(e) => setNewPasswordAgain(e.target.value)}
          label="Gentag Nyt Kodeord"
          type="password"
          error={error.newPasswordAgain}
        />
        <UI.Spacer bottom={1} />

        <PrimaryButton type="submit">Skift Kodeord</PrimaryButton>
      </Wrapper>
    </>
  );
}

export default ChangePassword;
