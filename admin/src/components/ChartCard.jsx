import React from "react";
import styled from "styled-components";

export const ChartCard = styled.div`
  background: white;
  border-radius: 10px;
  color: black;
  font-size: 14px;
  width: 350px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 1rem;
  .content {
  }

  .number-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;

    i {
      font-size: 20px;
      color: #2fcc2f;
    }

    .number {
      font-size: 40px;
      font-weight: 700;
    }
  }

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .chart {
    width: 100%;
  }

  .badge {
    background: #e2e8f0;
    color: #4a5568;
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
  }
`;
