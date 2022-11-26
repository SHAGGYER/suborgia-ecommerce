import React, {useState} from "react";
import {injectStripe} from "react-stripe-elements";
import StripePurple from "../../Images/stripe_purple.svg";
import Dankort from "../../Images/dankort.svg";
import Mastercard from "../../Images/mastercard.svg";
import Maestro from "../../Images/maestro.svg";
import Visa from "../../Images/visa.svg";
import CardSection from "./CardSection";
import HttpClient from "../../services/HttpClient";
import Alert from "../UI/Alert";
import {Form} from "../UI/Form";
import {UI} from "../UI/UI";
import Checkmark from "../Checkmark";

const CheckoutForm = ({stripe, credits, total, onSuccessfulPayment}) => {
  console.log(credits);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();
  const [name, setName] = useState("");

  const [paymentSuccess, setPaymentSuccessfull] = useState(false);

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

      const {data} = await HttpClient().post("/api/billing/charge", {
        source,
        name,
        total,
        credits,
      });
      onSuccessfulPayment(data.user);
      setPaymentSuccessfull(true);
    } catch (error) {
      setSubmitting(false);
      if (
        error.response.status === 400 &&
        error.response.data.errorCode === "OUT_OF_STOCK"
      ) {
        onOutOfStock(error.response.data.errors);
      } else if (error.response) {
        setError(error.response?.data?.error);
      }
    }
  };

  return (
    <React.Fragment>
      <Form width="600px" padding="1.3rem 2rem" onSubmit={handleSubmit}>

        {!paymentSuccess ? (
          <>
            {/* 
      <h2 className="text-md mb-1">Betaling</h2> */}
            <h3
              className="text-3xl mb-4"
              style={{fontFamily: "var(--form-header-text)"}}
            >
              DKK {parseFloat(total).toFixed(2)}
            </h3>
            {!!error && <Alert error>{error}</Alert>}
            <input
              className="card__element mb-1"
              style={{padding: "0.8rem"}}
              placeholder="Navn på kort"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CardSection/>

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <div style={{display: "flex", gap: "0.25rem", marginTop: "0.5rem"}}>
                <img src={Dankort} style={{height: 25}}/>
                <img src={Visa} style={{height: 25}}/>
                <img src={Maestro} style={{height: 25}}/>
                <img src={Mastercard} style={{height: 25}}/>
              </div>
              <img src={StripePurple} style={{height: 25}}/>
            </div>
            <div style={{marginTop: "1.5rem"}}>
              <UI.Button
                primary
                type="submit"
                disabled={!total}
                loading={submitting}
              >
                Betal
              </UI.Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center flex-col items-center">
            <h2 className="mb-4 text-lg">Betalingen blev gennemført</h2>
            <div>
              <Checkmark/>
            </div>
          </div>
        )}
      </Form>
    </React.Fragment>
  );
};

export default injectStripe(CheckoutForm);
