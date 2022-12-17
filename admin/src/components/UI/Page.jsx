import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  overflow-y: hidden;
  height: 100%;
  flex: 1;
  position: relative;
  background-color: ${(props) => (props.color ? props.color : "white")};
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
`;

export const Page = ({ children, padding, color, maxWidth }) => {
  return (
    <Wrapper padding={padding} maxWidth={maxWidth} color={color} id="page">
      {children}
    </Wrapper>
  );
};
