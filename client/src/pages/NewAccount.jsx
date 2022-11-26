import React, { useContext, useEffect, useState } from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import SubscriptionForm from "../components/Stripe/SubscriptionForm";
import AppContext from "../AppContext";
import { Stepper, Step } from "react-form-stepper";
import RegisterDialog from "../components/RegisterDialog";
import Checkmark from "../components/Checkmark";
import { UI } from "../components/UI/UI";
import { Form } from "../components/UI/Form";
import PrimaryButton from "../components/UI/PrimaryButton";
import IconCheck from "../images/icon_check.svg";
import FloatingTextField from "../components/FloatingTextField";

const PaymentPlanWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 2rem;
  margin-top: 1rem;

  h2 {
    font-size: 20px;
    margin-bottom: 1rem;
  }

  > article {
    cursor: pointer;
    border-radius: 0;
    background-color: var(--primary-light);
    padding: 1rem;
    position: relative;

    img {
      width: 50px;
      position: absolute;
      top: -20px;
      right: -5px;
    }

    :hover {
      background-color: var(--primary-dark);
    }

    &.active {
      background-color: var(--primary-dark);
    }
  }
`;

const DetailsForm = styled.form`
  background-color: var(--primary);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: start;

  h2 {
    margin-bottom: 1rem;
  }
`;

const PaymentSuccessful = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const PaymentHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;

  h1 {
    font-size: 40px;
  }

  h3 {
    font-family: Roboto, sans-serif;
  }
`;

export default function NewAccount() {
  const { plan, user, appSettings, setUser } = useContext(AppContext);

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    city: "",
    zip: "",
    address: "",
    phone: "",
  });
  const [userDetailsError, setUserDetailsError] = useState({});

  const [currentStep, setCurrentStep] = useState(user ? 2 : 0);
  const [paymentSuccess, setPaymentSuccessful] = useState(false);
  const [chosenPlan, setChosenPlan] = useState(plan || null);
  const [registerSuccessful, setRegisterSuccessful] = useState(false);

  useEffect(() => {
    if (registerSuccessful) {
      setCurrentStep(3);
      setTimeout(() => {
        window.location.href = import.meta.env.VITE_USER_URL;
      }, 3000);
    }
  }, [registerSuccessful]);

  useEffect(() => {
    if (user && registerSuccessful && appSettings?.appEnv !== "production") {
      setCurrentStep(2);
      setTimeout(() => {
        window.location.href = import.meta.env.VITE_USER_URL;
      }, 3000);
    }
  }, [appSettings, registerSuccessful, user]);

  const onRegisterSuccessful = (user) => {
    setUser(user);
    setRegisterSuccessful(true);
  };

  const handleStepName = (e) => {
    e.preventDefault();

    const errors = {};
    setUserDetailsError(errors);

    if (!userDetails.firstName) {
      errors.firstName = "Fornavn er påkrævet";
    }

    if (!userDetails.lastName) {
      errors.lastName = "Efternavn er påkrævet";
    }

    if (Object.keys(errors).length > 0) {
      setUserDetailsError(errors);
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleStepDetails = (e) => {
    e.preventDefault();

    const errors = {};
    setUserDetailsError(errors);

    if (!userDetails.city) {
      errors.city = "By er påkrævet";
    }

    if (!userDetails.zip) {
      errors.zip = "Postnummer er påkrævet";
    }

    if (!userDetails.address) {
      errors.address = "Adresse er påkrævet";
    }

    if (!userDetails.phone) {
      errors.phone = "Telefon er påkrævet";
    }

    if (Object.keys(errors).length > 0) {
      setUserDetailsError(errors);
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleChangeDetails = (prop, event) => {
    const _userDetails = { ...userDetails };
    _userDetails[prop] = event.target.value;
    setUserDetails(_userDetails);
  };

  return (
    <div
      style={{ maxWidth: 540, margin: "1.5rem auto 0", paddingBottom: "2rem" }}
    >
      <PaymentHeader>
        <h1 style={{ fontFamily: "var(--form-header-text)" }}>Ny Konto</h1>
      </PaymentHeader>

      <>
        <Stepper activeStep={currentStep}>
          <Step label="Dit Navn" />
          <Step label="Din Adresse" />
          <Step label="Konto" />
          <Step label="Opsummering" />
        </Stepper>
      </>

      <>
        {currentStep === 0 && (
          <>
            <DetailsForm onSubmit={handleStepName}>
              <h2>Dit Navn</h2>
              <FloatingTextField
                value={userDetails.firstName}
                onChange={(e) => handleChangeDetails("firstName", e)}
                label={"Fornavn"}
                error={userDetailsError.firstName}
              />
              <FloatingTextField
                value={userDetails.lastName}
                onChange={(e) => handleChangeDetails("lastName", e)}
                label={"Efternavn"}
                error={userDetailsError.lastName}
              />
              <PrimaryButton type={"submit"}>Næste</PrimaryButton>
            </DetailsForm>
          </>
        )}

        {currentStep === 1 && (
          <DetailsForm onSubmit={handleStepDetails}>
            <h2>Din Adresse</h2>
            <FloatingTextField
              label="By"
              error={userDetailsError.city}
              value={userDetails.city}
              onChange={(e) => handleChangeDetails("city", e)}
            />
            <FloatingTextField
              label="Vej & Husnummer"
              error={userDetailsError.address}
              value={userDetails.address}
              onChange={(e) => handleChangeDetails("address", e)}
            />
            <FloatingTextField
              label="Postnr."
              error={userDetailsError.zip}
              value={userDetails.zip}
              onChange={(e) => handleChangeDetails("zip", e)}
            />
            <FloatingTextField
              label="Telefon"
              error={userDetailsError.phone}
              value={userDetails.phone}
              onChange={(e) => handleChangeDetails("phone", e)}
            />
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <PrimaryButton type={"submit"}>Næste</PrimaryButton>
              <PrimaryButton
                type={"button"}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Tilbage
              </PrimaryButton>
            </div>
          </DetailsForm>
        )}

        {currentStep === 2 && (
          <RegisterDialog
            details={userDetails}
            onRegisterSuccessful={(user) => onRegisterSuccessful(user)}
            onBack={() => setCurrentStep(currentStep - 1)}
          />
        )}

        {/*         {currentStep === 2 && (
          <>
            <StripeProvider apiKey={import.meta.env.VITE_STRIPE_PUBLIC_KEY}>
              <Elements locale="da">
                <SubscriptionForm
                  user={user}
                  plan={chosenPlan}
                  onSuccessfulPayment={() => setPaymentSuccessful(true)}
                />
              </Elements>
            </StripeProvider>
          </>
        )} */}
        {currentStep === 3 && (
          <>
            <PaymentSuccessful>
              <h2>Succes</h2>
              <div>
                <Checkmark />
              </div>
              <div>
                <h3>Du bliver omdirigeret om lidt...</h3>
              </div>
            </PaymentSuccessful>
          </>
        )}
      </>
    </div>
  );
}
