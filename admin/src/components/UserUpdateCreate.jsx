import React, { useState } from "react";
import FloatingTextField from "./FloatingTextField";
import HttpClient from "../services/HttpClient";
import PrimaryButton from "./UI/PrimaryButton";
import styled from "styled-components";
import { Form } from "./UI/Form";
import { Confirm } from "react-st-modal";
import cogoToast from "cogo-toast";
import SaveButton from "./SaveButton";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
  padding: 1rem;

  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    align-items: flex-start;
  }
`;

export default function UserUpdateCreate({
  row,
  onUpdated,
  onCreated,
  onDeleted,
  onClose,
}) {
  const [name, setName] = useState(row ? row.name : "");
  const [email, setEmail] = useState(row ? row.email : "");
  const [role, setRole] = useState(row ? row.role : "user");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState(null);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (close = false) => {
    const body = {
      name,
      email,
      password,
      passwordAgain,
      role,
    };

    try {
      if (row?.id) {
        setLoading(true);
        const { data } = await HttpClient().post("/api/users/" + row?.id, body);
        onUpdated(data.content);
        setLoading(false);
      } else {
        setLoading(true);
        const { data } = await HttpClient().post("/api/users", body);
        onCreated(data.content);
        setLoading(false);
      }
      if (close) {
        onClose();
      }
    } catch (error) {
      setError(error?.response?.data?.errors);
      setLoading(false);
    }
  };

  const confirmPasswordResetEmail = async () => {
    const result = await Confirm(
      "Are you sure you want to send a password reset email to this user?",
      "Confirm"
    );

    if (result) {
      try {
        setPasswordResetLoading(true);
        await HttpClient().post("/api/users/password-reset/" + row.id);
        setPasswordResetLoading(false);
        cogoToast.success("Password reset email sent");
      } catch (error) {
        console.log(error);
        setPasswordResetLoading(false);
      }
    }
  };

  const onDelete = async () => {
    const result = await Confirm(
      "Are you sure you want to delete this user?",
      "Confirm"
    );

    if (result) {
      try {
        await HttpClient().delete("/api/users/" + row.id);
        onDeleted();
        onClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container>
      <h1>{row?.id ? row.name : "Create User"}</h1>
      {row?.id && (
        <PrimaryButton
          disabled={passwordResetLoading}
          onClick={confirmPasswordResetEmail}
        >
          Send Password Reset Email
        </PrimaryButton>
      )}
      <div className="form" style={{ width: "100%" }}>
        <Form.Select
          label={"Role *"}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value={"admin"}>Admin</option>
          <option value={"user"}>User</option>
        </Form.Select>

        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
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
        </div>

        {!row?.id && (
          <div style={{ width: "100%", display: "flex", gap: "1rem" }}>
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
          </div>
        )}
        {row?.id ? (
          <SaveButton
            loading={loading}
            onSaveAndClose={() => onSubmit(true)}
            onDelete={onDelete}
          />
        ) : (
          <PrimaryButton
            loading={loading}
            onClick={() => {
              onSubmit(true);
            }}
          >
            Create
          </PrimaryButton>
        )}
      </div>
    </Container>
  );
}
