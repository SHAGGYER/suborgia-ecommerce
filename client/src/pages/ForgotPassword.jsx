import React from "react";
import Page from "../../../admin/src/components/Page";
import FloatingTextField from "../components/FloatingTextField";
import PrimaryButton from "../components/UI/PrimaryButton";
import HttpClient from "../services/HttpClient";
import { useState } from "react";
import { Wrapper } from "../components/Wrapper";
import cogoToast from "cogo-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [generalError, setGeneralError] = useState(null);

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      await HttpClient().post("/api/auth/forgot-password", {
        email,
      });
      cogoToast.success("Email sent");
      setEmail("");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        setError(error.response?.data?.errors);
      }

      if (error.response?.data?.message) {
        setGeneralError(error.response?.data?.message);
      }
    }
  };

  return (
    <Page>
      <Wrapper>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "start",
          }}
          onSubmit={sendEmail}
        >
          <h1>Password Reset</h1>
          {generalError && <p>{generalError}</p>}
          <FloatingTextField
            label={"Email"}
            value={email}
            error={error?.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PrimaryButton>Request Password Reset</PrimaryButton>
        </form>
      </Wrapper>
    </Page>
  );
}
