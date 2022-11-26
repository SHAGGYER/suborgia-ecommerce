import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  background-color: ${(props) =>
          !!props.success
                  ? "var(--green)"
                  : props.primary
                          ? "var(--primary)"
                          : props.error
                                  ? "var(--red)"
                                  : "black"};
  padding: 0.5rem 1rem;
  position: relative;
  margin-bottom: 1rem;
  border-radius: 10px;
  color: ${props => (props.error ? "white" : "black")};
`;

export default function ({success, primary, error, children, onClick}) {
  return (
    <Wrapper
      success={success}
      primary={primary}
      error={error}
      role="alert"
      onClick={onClick}
    >
      {children}
    </Wrapper>
  );
}
