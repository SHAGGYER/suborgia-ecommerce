import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: var(--primary-light);
  padding: 1rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

const FieldsetWrapper = styled.fieldset`
  border: 1px solid var(--dark);
  padding: 1rem;
`;

export default function HelpDialog() {
  return (
    <Wrapper>
      <h2>Hjælp</h2>
      <FieldsetWrapper>
        <legend>Måltider</legend>
        <p>Du kan trykke på måltidet for at ændre dets navn.</p>
      </FieldsetWrapper>
    </Wrapper>
  );
}
