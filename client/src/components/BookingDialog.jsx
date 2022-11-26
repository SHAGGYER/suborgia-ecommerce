import React, { useContext } from "react";
import styled from "styled-components";
import { Form } from "./UI/Form";
import { UI } from "./UI/UI";
import moment from "moment";
import HttpClient from "../services/HttpClient";
import { useDialog } from "react-st-modal";
import cogoToast from "cogo-toast";
import PrimaryButton from "./UI/PrimaryButton";
import { ClipLoader } from "react-spinners";
import AppContext from "../AppContext";

const Wrapper = styled.div`
  background-color: var(--primary);
  padding: 1rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

const FieldsetWrapper = styled.fieldset`
  border: 1px solid var(--dark);
  padding: 1rem;
`;

export default function BookingDialog({
  shopId,
  services,
  start,
  serviceMinutes,
  onBookingError,
  socket,
}) {
  const dialog = useDialog();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({});

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError({});

    const _error = {};

    if (!name) _error.name = "Navn er påkrævet";
    if (!email) _error.email = "E-mail er påkrævet";
    if (!phone) _error.phone = "Telefon er påkrævet";

    if (Object.keys(_error).length) {
      setError(_error);
      setLoading(false);
      return;
    }

    try {
      const body = {
        email,
        name,
        phone,
        services,
        shopId,
        start: moment(start).format("YYYY-MM-DD HH:mm"),
        end: moment(start)
          .add(serviceMinutes, "minutes")
          .format("YYYY-MM-DD HH:mm"),
      };

      const { data } = await HttpClient().post("/api/booking", body);
      socket.emit("new-booking", data.content);

      cogoToast.success("Booking oprettet!");
      setLoading(false);
      dialog.close(true);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        cogoToast.error(e.response.data.error);
        onBookingError();
        dialog.close(false);
      }

      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <h2>Booking</h2>
      <form onSubmit={onSubmit}>
        <Form.TextField
          error={error.name}
          label="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <UI.Spacer bottom={1} />
        <Form.TextField
          error={error.email}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <UI.Spacer bottom={1} />
        <Form.TextField
          error={error.phone}
          label="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <UI.Spacer bottom={1} />
        <PrimaryButton type={"submit"}>
          <ClipLoader size={15} color={"#fff"} loading={loading} />
          Bestil tid
        </PrimaryButton>
      </form>
    </Wrapper>
  );
}
