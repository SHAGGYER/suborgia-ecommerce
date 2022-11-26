import React, {useEffect, useState} from 'react';
import {UI} from "./UI/UI"
import PrimaryButton from "./UI/PrimaryButton";
import {Confirm, CustomDialog} from "react-st-modal";
import HttpClient from "../services/HttpClient";
import {Elements, StripeProvider} from "react-stripe-elements";
import UpdateCardForm from "./Stripe/UpdateCardForm";
import moment from "moment";
import styled from "styled-components";

const PaymentsTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  
  td, th {
    border: 1px solid black;
    padding: 10px;
    text-align: left;
  }
`

const PaymentsDialog = () => {
    const [invoices, setPayments] = useState()

    useEffect(() => {
        HttpClient().get('/api/billing/invoices').then(res => {
            setPayments(res.data.invoices)
        })
    }, [])


    return (
        <div style={{padding: "1rem"}}>
            <h2 style={{marginBottom: "1rem"}}>Betalinger</h2>
            <PaymentsTable>
                <thead>
                <tr>
                    <th>Dato</th>
                    <th>Sum</th>
                    <th>Beskrivelse</th>
                </tr>
                </thead>
                <tbody>
                {invoices && invoices.map(invoice => (
                    <tr key={invoice._id}>
                        <td>{moment(invoice.createdAt).format('DD.MM.YYYY')}</td>
                        <td>{invoice.amountPaid / 100} kr.</td>
                        <td>{invoice.lines[0].description}</td>
                    </tr>
                ))}
                </tbody>
            </PaymentsTable>

        </div>
    )
}

const UpdateCardDialog = () => {
    return (
        <StripeProvider apiKey={import.meta.env.VITE_STRIPE_PUBLIC_KEY}>
            <Elements locale="da">
                <UpdateCardForm/>
            </Elements>
        </StripeProvider>
    )
}

function BillingDialog({user, setUser}) {

    const openUpdateCardDialog = async () => {
        const result = await CustomDialog(<UpdateCardDialog/>)
    }

    const openUnsubscribeDialog = async () => {
        const result = await Confirm("Du er ved at anmelde dit abonnement", "Er du sikker?")
        if (result) {
            await HttpClient().post("/api/billing/unsubscribe", {});
            window.location.reload();
        }
    }

    const openResumePaymentsDialog = async () => {
        const result = await Confirm("Du er ved at genoprette dit abonnement", "Er du sikker?")
        if (result) {
            await HttpClient().post("/api/billing/resume-subscription", {});
            window.location.reload();
        }
    }

    const openPaymentDialog = async () => {
        const result = await Confirm("Du er ved at betale for dit abonnement", "Er du sikker?")
        if (result) {
            await HttpClient().post("/api/billing/payment-past-due", {});
        }
    }

    const openPaymentsDialog = async () => {
        const result = await CustomDialog(<PaymentsDialog />)
    }

    return (
        <div style={{padding: "2rem"}}>
            <h2 style={{marginBottom: "1rem"}}>Abonnement</h2>
            <UI.FlexBox gap={"1rem"} align={"center"}>
                <PrimaryButton success onClick={openUpdateCardDialog}>Opdatér dit kort</PrimaryButton>
                {(user.stripeSubscriptionStatus === "active" || user.stripeSubscriptionStatus === "trialing") && !user.stripeSubscriptionCanceled ? (
                    <PrimaryButton error onClick={openUnsubscribeDialog}>Afmeld Abonnement</PrimaryButton>
                ) : (user.stripeSubscriptionStatus === "active" || user.stripeSubscriptionStatus === "trialing") && user.stripeSubscriptionCanceled ?
                    <PrimaryButton primary onClick={openResumePaymentsDialog}>Genoptag Abonnement</PrimaryButton>
                    : user.stripeSubscriptionStatus === "past_due" && (
                    <PrimaryButton error onClick={openPaymentDialog}>Betal</PrimaryButton>
                )}
                <PrimaryButton onClick={openPaymentsDialog}>Se dine betalinger</PrimaryButton>
            </UI.FlexBox>

            {user.stripeSubscriptionStatus === "active" && user.stripeSubscriptionCanceled && (
                <>
                    <UI.Spacer bottom="1"/>
                    <UI.Text>
                        Du har afmeldt abonnementet. Du kan bruge det indtil
                        d. {moment(user.stripeSubscriptionCurrentPeriodEnd).format("DD-MM-YYYY")}.
                    </UI.Text>
                </>
            )}
        </div>
    );
}

export default BillingDialog;