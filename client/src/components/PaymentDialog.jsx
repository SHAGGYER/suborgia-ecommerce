import React from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import SubscriptionForm from "./Stripe/SubscriptionForm";

export default function PaymentDialog({plan}) {
    const setPaymentSuccessfull = result => {
        console.log(result);
    }

  return (
      <StripeProvider apiKey={import.meta.env.VITE_STRIPE_PUBLIC_KEY}>
          <Elements locale="da">
              <SubscriptionForm
                  plan={plan}
                  onSuccessfulPayment={() => setPaymentSuccessfull(true)}
              />
          </Elements>
      </StripeProvider>
  );
}
