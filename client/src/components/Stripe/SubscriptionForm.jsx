import React, {useEffect, useState} from "react";
import {injectStripe} from "react-stripe-elements";
import StripePurple from "../../images/stripe_purple.svg";
import Dankort from "../../images/dankort.svg";
import Mastercard from "../../images/mastercard.svg";
import Maestro from "../../images/maestro.svg";
import Visa from "../../images/visa.svg";
import CardSection from "./CardSection";
import HttpClient from "../../services/HttpClient";
import Alert from "../UI/Alert";
import {Form} from "../UI/Form";
import Checkmark from "../Checkmark";
import PrimaryButton from "../UI/PrimaryButton";
import {ClipLoader} from "react-spinners"

const SubscriptionForm = ({stripe, plan, onSuccessfulPayment}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();
  const [name, setName] = useState("");

  const [paymentSuccess, setPaymentSuccessful] = useState(false);

  useEffect(() => {
    console.log(paymentSuccess)
  }, [paymentSuccess])

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError(null);

    if (!plan) {
      setError("Vælg en plan");
      return;
    }

    setSubmitting(true);

    try {
      const sourceResponse = await stripe.createSource({type: "card"});
      const {source, error} = sourceResponse;
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }

      const {data} = await HttpClient().post(
        "/api/billing/create-subscription",
        {
          source,
          name,
          plan,
        }
      );
      onSuccessfulPayment(data.user);
      setPaymentSuccessful(true);
    } catch (error) {
      console.log(error)
      setSubmitting(false);
      if (error.response) {
        setError(error.response?.data?.error);
      }
    }
  };

  return (
    <React.Fragment>
      <Form width="600px" padding="1.3rem 2rem" onSubmit={handleSubmit}>
        <>
          <h2 style={{marginBottom: "1rem"}}>Til betaling nu: {plan?.price} kr.</h2>
          {!!error && <Alert error>{error}</Alert>}
          <input
            className="card__element mb-1"
            style={{padding: "0.8rem", width: "100%"}}
            placeholder="Navn på kort"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CardSection/>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{display: "flex", gap: "0.25rem", marginTop: "0.5rem", marginBottom: "1rem"}}
            >
              <img src={Dankort} style={{height: 25}}/>
              <img src={Visa} style={{height: 25}}/>
              <img src={Maestro} style={{height: 25}}/>
              <img src={Mastercard} style={{height: 25}}/>
            </div>
            <img src={StripePurple} style={{height: 25}}/>
          </div>
          <p><i>Fortrydelsesretten løber fra det øjeblik, at betalingen er gået igennem.</i></p>
          <div style={{marginTop: "1.5rem"}}>
            <PrimaryButton
              disabled={submitting}
              $loading={submitting}
            >
              <ClipLoader loading={submitting} size={20}/>
              Betal
            </PrimaryButton>
          </div>
        </>
      </Form>
    </React.Fragment>
  );
};

export default injectStripe(SubscriptionForm);
