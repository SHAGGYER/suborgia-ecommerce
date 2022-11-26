import React from "react";
import styled from "styled-components";

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 0 8rem;

  @media (max-width: 768px) {
    padding: 0 1rem 2rem;
  }
`;

export default Page;