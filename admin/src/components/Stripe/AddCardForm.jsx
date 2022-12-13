import React, {useContext, useState} from "react";
import {injectStripe} from "react-stripe-elements";
import CardSection from "./CardSection";
import HttpClient from "../../services/HttpClient";
import AppContext from "../../Contexts/AppContext";

const AddCardForm = ({stripe, elements, setModalOpen}) => {
  const {setUser} = useContext(AppContext);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setSubmitting(true);
    const sourceResponse = await stripe.createSource({type: "card"});
    const {source, error} = sourceResponse;
    if (error) {
      setErrors([error.message]);
      setSubmitting(false);
      return;
    }

    const response = await HttpClient().post("/api/payment/add-card", {
      source,
    });
    setUser(response.data);
    setSubmitting(false);
    setModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardSection/>
    </form>
  );
};

export default injectStripe(AddCardForm);
