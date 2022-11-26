import React, {useContext, useState} from "react";
import {injectStripe} from "react-stripe-elements";

import CardSection from "./CardSection";
import HttpClient from "../../services/HttpClient";
import {Alert} from "../UI/Alert";
import {UI} from "../UI/UI"
import styled from "styled-components";
import {ClipLoader} from "react-spinners";
import PrimaryButton from "../UI/PrimaryButton";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 0 2rem 2rem;

  h2 {
    margin-bottom: 1rem;
  }
`

const UpdateCardForm = ({stripe, elements, onSuccess}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();
  const [name, setName] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError(null);

    setSubmitting(true);

    try {
      const sourceResponse = await stripe.createSource({type: "card"});
      const {source, error} = sourceResponse;
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }

      const {data} = await HttpClient().post("/api/billing/update-card", {
        source,
        name,
      });
      onSuccess(data);
    } catch (error) {
      setSubmitting(false);
      if (error.response) {
        setError(error.response?.data?.error);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>
        Opdatér Kort
      </h2>

      {!!error && <Alert error>{error}</Alert>}
      <CardSection/>

      <div className="mt-2">
        <PrimaryButton type="submit" disabled={submitting}>
          <ClipLoader loading={submitting} size={20}/>

          {submitting ? "Indlæser..." : "Opdater Kort"}
        </PrimaryButton>
      </div>
    </Form>
  );
};

export default injectStripe(UpdateCardForm);
