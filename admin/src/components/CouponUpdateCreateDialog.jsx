import React, { useState } from "react";
import FloatingTextField from "./FloatingTextField";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import PrimaryButton from "./UI/PrimaryButton";
import SaveButton from "./SaveButton";

const CreateDialogStyled = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;

  .image-container {
    width: 100%;

    img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      object-position: center;
    }
  }
`;

export const CouponUpdateCreateDialog = ({
  row,
  onCreated,
  onClose,
  onUpdated,
  onDeleted,
}) => {
  const [code, setCode] = React.useState(row ? row.code : "");
  const [percentage, setPercentage] = React.useState(row ? row.percentage : "");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const body = {
      code,
      percentage,
    };

    if (row?.id) {
      setLoading(true);
      const { data } = await HttpClient().put(`/api/coupons/${row.id}`, body);
      onUpdated(data.content);
      onClose();
      setLoading(false);
    } else {
      setLoading(true);
      const { data } = await HttpClient().post("/api/coupons", body);
      onCreated(data.content);
      onClose();
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);

    await HttpClient().delete(`/api/coupons/${row.id}`);
    onDeleted();
    onClose();
    setLoading(false);
  };

  return (
    <CreateDialogStyled>
      <h1>{row ? "Update" : "New"} Coupon</h1>
      <FloatingTextField
        label="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <FloatingTextField
        label="Percentage"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
      />

      {!row?.id && (
        <PrimaryButton loading={loading} onClick={onSubmit}>
          Save
        </PrimaryButton>
      )}
      {row?.id && (
        <SaveButton
          loading={loading}
          onSaveAndClose={onSubmit}
          onDelete={onDelete}
        />
      )}
    </CreateDialogStyled>
  );
};
