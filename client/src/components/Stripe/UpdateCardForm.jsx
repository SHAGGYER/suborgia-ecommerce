import React, {useContext, useState} from "react";
import {injectStripe} from "react-stripe-elements";

import CardSection from "./CardSection";
import HttpClient from "../../services/HttpClient";
import Alert from "../UI/Alert";
import {Form} from "../UI/Form";
import {UI} from "../UI/UI"

const UpdateCardForm = ({stripe, elements, onSuccess}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();
  const [name, setName] = useState("");
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
    <Form width="600px" margin="0 auto" padding="2rem" onSubmit={handleSubmit}>
      <h2 size="36" center>
        Opdatér Kort
      </h2>

      {!!error && <Alert error>{error}</Alert>}
      <input
        className="card__element mb-1"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <CardSection/>

      <div className="mt-2">
        <UI.Button success type="submit" loading={submitting}>
          Opdatér Kort
        </UI.Button>
      </div>
    </Form>
  );
};

export default injectStripe(UpdateCardForm);
