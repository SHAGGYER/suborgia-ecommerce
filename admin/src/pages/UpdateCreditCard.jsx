import React, {useContext, useState} from 'react';
import UpdateCardForm from "../components/Stripe/UpdateCardForm";
import {Elements, StripeProvider} from "react-stripe-elements";
import {Stepper, Step} from "react-form-stepper";
import Checkmark from "../components/Checkmark";
import styled from "styled-components";
import AppContext from "../AppContext";
import {Alert} from "../components/UI/Alert";

const Wrapper = styled.section`
  max-width: 800px;
  background-color: var(--primary);
`

const PaymentSuccessful = styled.div`
  background-color: var(--primary);
  display: flex;
  padding: 2rem;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`

function UpdateCreditCard(props) {
  const {user} = useContext(AppContext)
  const [currentStep, setCurrentStep] = useState(0)

  const onSuccess = () => {
    setCurrentStep(currentStep + 1)
  }

  return (
    <Wrapper>
      {!user.stripeCustomerId ? (
        <>
          <Alert error>
            Du er ikke en oprettet betaler.
          </Alert>
        </>
      ) : (
        <>
          <Stepper activeStep={currentStep}>
            <Step label="Kort Oplysninger"/>
            <Step label="Opsummering"/>
          </Stepper>

          {currentStep === 0 && (
            <StripeProvider apiKey={import.meta.env.VITE_STRIPE_PUBLIC_KEY}>
              <Elements locale="da">
                <UpdateCardForm onSuccess={onSuccess}/>
              </Elements>
            </StripeProvider>

          )}

          {currentStep === 1 && (
            <>
              <PaymentSuccessful>
                <h2>Dine betalingsoplysninger er blevet opdateret</h2>
                <div>
                  <Checkmark/>
                </div>
              </PaymentSuccessful>
            </>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default UpdateCreditCard;