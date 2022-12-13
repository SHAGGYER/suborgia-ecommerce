import React, { useContext, useEffect, useState } from "react";
import { UI } from "../components/UI/UI";
import PrimaryButton from "../components/UI/PrimaryButton";
import AppContext from "../AppContext";
import HttpClient from "../services/HttpClient";
import { Confirm } from "react-st-modal";
import moment from "moment";
import styled from "styled-components";
import cogoToast from "cogo-toast";
import IconCheck from "../images/icon_check.svg";
import { Elements, StripeProvider } from "react-stripe-elements";
import SubscriptionForm from "../components/Stripe/SubscriptionForm";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import PricingTable from "../components/PricingTable";
import Checkmark from "../components/Checkmark";

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

const PaymentSuccessful = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const SubscriptionWrapper = styled.div`
  max-width: 900px;
  background-color: var(--primary);
  padding: 2rem;

  article {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: start;
  }
`;

function Subscription(props) {
  const navigate = useNavigate();
  const { user, setUser, plans } = useContext(AppContext);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [paymentSuccess, setPaymentSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      user.stripeSubscriptionStatus === "active" &&
      !user.stripeSubscriptionCanceled
    ) {
      const plan = plans.find((x) => x._id === user.planId);
      setChosenPlan(plan);
    }
  }, [user]);

  const handlePaymentSuccessful = (user) => {
    setUser(user);
    setPaymentSuccessful(true);
  };

  const openUnsubscribeDialog = async () => {
    const result = await Confirm(
      "Du er ved at anmelde dit abonnement",
      "Er du sikker?"
    );
    if (result) {
      setLoading(true);
      await HttpClient().post("/api/billing/unsubscribe", {});
      setUser({
        ...user,
        stripeSubscriptionCanceled: true,
      });
      setLoading(false);
    }
  };

  const openResumePaymentsDialog = async () => {
    const result = await Confirm(
      "Du er ved at genoprette dit abonnement",
      "Er du sikker?"
    );
    if (result) {
      setLoading(true);
      await HttpClient().post("/api/billing/resume-subscription", {});
      setUser({
        ...user,
        stripeSubscriptionCanceled: false,
      });
      setLoading(false);
    }
  };

  const openPaymentDialog = async (mode = "past_due") => {
    const result = await Confirm(
      "Du er ved at betale for dit abonnement",
      "Er du sikker?"
    );
    if (result) {
      try {
        setLoading(true);
        if (mode === "swap") {
          await swapPlans(chosenPlan);
        } else if (mode === "past_due") {
          // We're not swapping, so the only other possibility
          // left is to pay past due
          await HttpClient().post("/api/billing/payment-past-due", {});
          window.location.reload();
        } else if (mode === "create") {
          const { data } = await HttpClient().post(
            "/api/billing/create-subscription",
            {
              plan: chosenPlan,
            }
          );
          window.location.reload();
        }
      } catch (e) {
        if (e.response && e.response.status === 400) {
          cogoToast.error(e.response.data.error);
        }

        setLoading(false);
      }
    }
  };

  const swapPlans = async (plan) => {
    setLoading(true);
    await HttpClient().post("/api/billing/swap-plans", { plan });
    setUser({
      ...user,
      planId: plan._id,
    });
    setLoading(false);
  };

  return (
    <div>
      <SubscriptionWrapper>
        {user.stripeCustomerId && (
          <>
            {user.stripeSubscriptionStatus === "active" &&
            !user.stripeSubscriptionCanceled ? (
              <article>
                <h2>Du har et aktivt abonnement</h2>
                <h3>
                  Næste betaling:{" "}
                  {moment(user.stripeSubscriptionCurrentPeriodEnd).format(
                    "DD-MM-YYYY"
                  )}
                </h3>
                <PrimaryButton error onClick={openUnsubscribeDialog}>
                  <ClipLoader loading={loading} size={20} />
                  Afmeld Abonnement
                </PrimaryButton>
              </article>
            ) : user.stripeSubscriptionStatus === "active" &&
              user.stripeSubscriptionCanceled ? (
              <article>
                <h2>Du har opsagt dit abonnement</h2>
                <h3>
                  Du må bruge det indtil:{" "}
                  {moment(user.stripeSubscriptionCurrentPeriodEnd).format(
                    "DD-MM-YYYY"
                  )}
                </h3>
                <PrimaryButton primary onClick={openResumePaymentsDialog}>
                  <ClipLoader loading={loading} size={20} />
                  Genoptag Abonnement
                </PrimaryButton>
              </article>
            ) : (
              user.stripeSubscriptionStatus === "past_due" && (
                <article>
                  <h2>Du har ikke et aktivt abonnement</h2>
                  <PrimaryButton
                    error
                    onClick={() => openPaymentDialog("past_due")}
                  >
                    <ClipLoader loading={loading} size={20} />
                    Betal for abonnement
                  </PrimaryButton>
                </article>
              )
            )}
          </>
        )}

        <>
          {!paymentSuccess ? (
            <>
              <PricingTable
                noUserComparison
                btnText="Vælg"
                onClick={(plan) => setChosenPlan(plan)}
              />

              {user.stripePaymentMethodId ? (
                <PrimaryButton
                  disabled={!chosenPlan}
                  onClick={() =>
                    openPaymentDialog(
                      user.stripeSubscriptionStatus === "active"
                        ? "swap"
                        : "create"
                    )
                  }
                >
                  <ClipLoader loading={loading} size={20} />
                  Betal for abonnement
                </PrimaryButton>
              ) : (
                chosenPlan && (
                  <StripeProvider
                    apiKey={import.meta.env.VITE_STRIPE_PUBLIC_KEY}
                  >
                    <Elements locale="da">
                      <SubscriptionForm
                        plan={chosenPlan}
                        onSuccessfulPayment={(user) =>
                          handlePaymentSuccessful(user)
                        }
                      />
                    </Elements>
                  </StripeProvider>
                )
              )}
            </>
          ) : (
            <>
              <PaymentSuccessful>
                <h2>Betalingen blev gennemført</h2>
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
      </SubscriptionWrapper>
    </div>
  );
}

export default Subscription;
