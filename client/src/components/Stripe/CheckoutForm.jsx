import React, { useState } from "react";
import { injectStripe } from "react-stripe-elements";
import CardSection from "./CardSection";
import HttpClient from "../../services/HttpClient";
import Checkmark from "../Checkmark";
import PrimaryButton from "../UI/PrimaryButton";
import styled from "styled-components";
import { useEffect } from "react";

const Form = styled.form`
  width: 100%;
  border: 1px solid #efefef;
  padding: 1rem;
`;

const PaymentSuccess = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const CheckoutForm = ({
  stripe,
  subtotal,
  tax,
  total,
  onSuccessfulPayment,
  discount,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const [paymentSuccess, setPaymentSuccessful] = useState(false);

  useEffect(() => {
    if (paymentSuccess) {
      setTimeout(() => {
        onSuccessfulPayment();
      }, 2000);
    }
  }, [paymentSuccess]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError(null);

    setSubmitting(true);

    try {
      const sourceResponse = await stripe.createSource({ type: "card" });
      const { source, error } = sourceResponse;
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }

      const cartId = localStorage.getItem("cartId");

      const { data } = await HttpClient().post("/api/cart/pay", {
        source,
        cartId,
        orderData: {
          name,
          email,
          address,
          city,
          zip,
          country,
          subtotal,
          tax,
          total: total?.toFixed(2),
          discount,
        },
      });
      setPaymentSuccessful(true);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <Form onSubmit={handleSubmit}>
        {!paymentSuccess ? (
          <>
            <p style={{ fontWeight: "bold", marginBottom: "1rem" }}>
              Your Details
            </p>
            <input
              className="card__element mb-1"
              style={{ padding: "0.8rem" }}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="card__element mb-1"
              style={{ padding: "0.8rem" }}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="card__element mb-1"
              style={{ padding: "0.8rem" }}
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="card__element mb-1"
              style={{ padding: "0.8rem" }}
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="card__element mb-1"
              style={{ padding: "0.8rem" }}
              placeholder="Zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            <input
              className="card__element mb-1"
              style={{ padding: "0.8rem" }}
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <p style={{ fontWeight: "bold", marginBottom: "1rem" }}>
              Credit Card
            </p>
            {!!error && (
              <p style={{ marginBottom: "1rem", color: "red" }}>{error}</p>
            )}
            <CardSection />

            <PrimaryButton
              primary
              type="submit"
              disabled={!total || submitting}
            >
              {submitting && <i className="fas fa-spinner fa-spin" />}
              Pay Now
            </PrimaryButton>
          </>
        ) : (
          <PaymentSuccess>
            <Checkmark />
          </PaymentSuccess>
        )}
      </Form>
    </div>
  );
};

export default injectStripe(CheckoutForm);
