import React from "react";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import SaveButton from "./SaveButton";
import { Form } from "./UI/Form";
import PrimaryButton from "./UI/PrimaryButton";

const SHOULD_SEND_MAIL = 1;

const UpdateOrderStyled = styled.div`
  width: 100%;
  background-color: white;
  z-index: 99;
  box-shadow: 0 10px 5px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
`;

export default function UpdateOrder({ row, onUpdated, onClose }) {
  const [status, setStatus] = React.useState(row.status);
  const [loading, setLoading] = React.useState(false);
  const [sendMail, setSendMail] = React.useState(false);

  const updateOrder = async () => {
    const body = {
      status,
    };

    if (sendMail) {
      body.sendMail = SHOULD_SEND_MAIL;
    }

    setLoading(true);
    await HttpClient().put(`/api/orders/${row.id}`, body);
    setLoading(false);
    onUpdated({ ...row, status });
    onClose();
  };

  return (
    <UpdateOrderStyled>
      <Form.Select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        label="Status"
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
        <option value="returned">Returned</option>
      </Form.Select>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span>Send Mail?</span>
        <Form.Switch
          checked={sendMail}
          onChange={(e) => setSendMail(e.target.checked)}
        />
      </div>
      <SaveButton
        noDelete
        loading={loading}
        onSaveAndClose={() => updateOrder()}
      />
    </UpdateOrderStyled>
  );
}
