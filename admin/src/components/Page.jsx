import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  padding-left: 4rem;
  display: flex;
  flex-direction: column;
  background-color: #f1f5f9;
`;

export default function Page({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
