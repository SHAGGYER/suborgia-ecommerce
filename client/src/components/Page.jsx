import React from "react";
import styled from "styled-components";

const Page = styled.div`
  padding: 2rem 1rem;
  background-color: #f1f5f9;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 1100px) {
    padding: 1rem;
  }
`;

export default Page;
