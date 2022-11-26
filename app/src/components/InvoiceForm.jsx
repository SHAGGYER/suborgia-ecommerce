import React, { useContext, useState } from "react";
import PrimaryButton from "./UI/PrimaryButton";
import moment from "moment";
import HttpClient from "../services/HttpClient";
import { getTotal } from "../pages/Purchases";
import styled from "styled-components";
import FloatingTextField from "./FloatingTextField";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  article {
    span {
      font-size: 20px;
    }
  }

  > section {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    align-items: start;
  }
`;

export const INVOICE_TYPES = {
  "credit-note": "Credit Note",
  sell: "Sell Invoice",
  buy: "Buy Invoice",
};

const getAbsoluteTotal = (total) => {
  return Math.round(total / 0.5) * 0.5;
};

function InvoiceForm({ row, onFinished }) {
  const [lines, setLines] = useState(row ? row.lines : []);
  const [saveLoading, setSaveLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState({});
  const [usedRow, setUsedRow] = useState(row ? row : undefined);
  const [amountPaid, setAmountPaid] = useState(
    getAbsoluteTotal(getTotal(row?.lines))
  );
  const [payment, setPayment] = useState(null);

  const registerPayment = async () => {
    const paidAt = moment().format("YYYY-MM-DD");
    const { data } = await HttpClient().post(`/api/payments`, {
      paidAt,
      total: getTotal(row?.lines),
      lines: row?.lines,
      amountPaid,
    });

    setPayment(data);
    setUsedRow({ ...usedRow, paidAt });
  };

  return (
    <div>
      <h2>Betal</h2>
      {usedRow.paidAt && payment ? (
        <article>
          <div>
            <span>Betalt den: </span>
            <span className="font-bold">
              {moment(usedRow.paidAt).format("DD-MM-YYYY k:mm")}
            </span>
          </div>
          <div>Total Beløb: {payment.total}kr.</div>
          <div>Betalt Beløb: {payment.amountPaid}kr.</div>
          <div>Byttepenge: {payment.change}kr.</div>
          <PrimaryButton onClick={onFinished}>Færdig</PrimaryButton>
        </article>
      ) : (
        <Container>
          <article>
            <span>Beløb at betale: {getTotal(lines)}kr.</span>
          </article>
          {!usedRow.paidAt && (
            <section>
              <FloatingTextField
                label="Beløb betalt"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                type="number"
              />
              <PrimaryButton onClick={registerPayment}>
                Betal Kontant
              </PrimaryButton>
            </section>
          )}
        </Container>
      )}
    </div>
  );
}

export default InvoiceForm;
