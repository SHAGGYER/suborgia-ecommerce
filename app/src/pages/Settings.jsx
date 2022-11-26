import cogoToast from "cogo-toast";
import React, { useContext, useState } from "react";
import { Confirm } from "react-st-modal";
import styled from "styled-components";
import PrimaryButton from "../components/UI/PrimaryButton";
import HttpClient from "../services/HttpClient";
import { Form } from "../components/UI/Form";
import { UI } from "../components/UI/UI";
import AppContext from "../AppContext";
import ChangePassword from "./ChangePassword";

const Container = styled.section`
  h1 {
    font-size: 40px;
    font-family: "Anton", sans-serif;
    margin-bottom: 1rem;
  }
`;

const Wrapper = styled.div`
  background-color: var(--primary-dark);
  padding: 1rem;
  max-width: 800px;
  margin-bottom: 1rem;

  h3 {
    margin-bottom: 1rem;
  }
`;

export default function Settings() {
  const { user } = useContext(AppContext);
  const [city, setCity] = useState(user?.city || "");
  const [zip, setZip] = useState(user?.zip || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const deleteAccount = async () => {
    const result = await Confirm(
      "Er du sikker på at du vil slette din konto?",
      "Bekræft"
    );
    if (!result) return;

    try {
      await HttpClient().post("/api/user/remove-account");
      cogoToast.success("Du har slettet din konto");
      window.location.href = "/";
    } catch (error) {
      console.log(error.message);
      cogoToast.error("Der skete en fejl");
    }
  };

  const saveDetails = async (e) => {
    e.preventDefault();

    const body = {
      city,
      zip,
      address,
      phone,
    };

    try {
      await HttpClient().post("/api/user/save-details", body);
      cogoToast.success("Dine oplysninger er gemt");
    } catch (error) {
      console.log(error.message);
      cogoToast.error("Der skete en fejl");
    }
  };

  return (
    <Container>
      <h1>Settings</h1>

      <Wrapper>
        <h3>Dine informationer</h3>
        <form onSubmit={saveDetails}>
          <UI.FlexBox gap={"1rem"} style={{ marginBottom: "1rem" }}>
            <Form.TextField
              label="By"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Form.TextField
              label="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </UI.FlexBox>
          <UI.FlexBox gap={"1rem"}>
            <Form.TextField
              label="Postnr."
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            <Form.TextField
              label="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </UI.FlexBox>

          <UI.Spacer bottom={1} />

          <PrimaryButton type={"submit"}>Gem</PrimaryButton>
        </form>
      </Wrapper>

      <Wrapper>
        <ChangePassword />
      </Wrapper>

      <Wrapper>
        <h3>Her kan du slette din bruger</h3>
        <PrimaryButton onClick={deleteAccount}>Slet bruger</PrimaryButton>
      </Wrapper>
    </Container>
  );
}
