import React from "react";
import styled from "styled-components";

const CardStyled = styled.div`
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 250px;

  h2 {
    text-align: center;
    margin-top: 2rem;
    font-size: 50px;
  }

  h4 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .footer {
    text-align: center;
  }
`;

export default function SummaryCard({ title, subtitle, number, color }) {
  return (
    <CardStyled>
      <div className="header">
        <h3>{subtitle}</h3>
      </div>
      <div className="content">
        <h2 style={{ color }}>{number}</h2>
        <h4 style={{ color }}>{title}</h4>
      </div>
      <div className="footer">
        <p>Under construction</p>
      </div>
    </CardStyled>
  );
}
