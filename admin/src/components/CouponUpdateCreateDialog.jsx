import React, { useState } from "react";
import FloatingTextField from "./FloatingTextField";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import PrimaryButton from "./UI/PrimaryButton";

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

export const CouponUpdateCreateDialog = ({ coupon, onCreated }) => {
  const [code, setCode] = React.useState(coupon ? coupon.code : "");
  const [percentage, setPercentage] = React.useState(
    coupon ? coupon.percentage : ""
  );

  const onSubmit = async () => {
    const body = {
      code,
      percentage,
    };

    if (coupon) {
      await HttpClient().post(`/api/coupons/${coupon.id}`, body);
      window.location = "/coupons";
    } else {
      await HttpClient().post("/api/coupons", body);
      if (onCreated) {
        onCreated();
      } else {
        window.location = "/coupons";
      }
    }
  };

  return (
    <CreateDialogStyled>
      <h1>{coupon ? "Update" : "New"} Coupon</h1>
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

      <PrimaryButton onClick={onSubmit}>Save</PrimaryButton>
    </CreateDialogStyled>
  );
};
