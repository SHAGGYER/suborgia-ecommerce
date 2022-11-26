import React from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "react-stripe-elements";
import "./CardSection.css";

const CardSection = () => {
  return (
    <>
      <CardNumberElement showIcon={true} className="card__element" />
      <div className="card__column">
        <CardExpiryElement className="card__element" />
        <CardCvcElement className="card__element" />
      </div>
    </>
  );
};

export default CardSection;
