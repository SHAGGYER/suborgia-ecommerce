import React from "react";
import { useId } from "react";
import styled from "styled-components";

const ErrorStyle = styled.span`
  color: #de1511;
  text-align: left;
`;

const FloatingTextFieldStyled = styled.div`
  &.field {
    width: 100%;
    position: relative;
  }

  label,
  input {
    transition: all 0.2s;
  }

  input {
    font-size: 14px;
    border: 1px solid #ccc;
    padding: 1.25rem 0.75rem 0.75rem;
    border-radius: 7px;
    z-index: 0;
    width: 100%;

    &:hover {
      border: 1px solid #ccc;
    }
  }

  input:focus {
    outline: 0;
    border: 1px solid #464dff;
  }

  label {
    color: #3d5471;
    position: absolute;
    left: 0.5rem;
    top: 1rem;
  }

  input:placeholder-shown + label {
    cursor: text;
  }

  input::placeholder {
    opacity: 0;
    transition: inherit;
  }

  input:not(:placeholder-shown) + label,
  input:focus + label {
    top: 0.25rem;
    color: #464dff;
    left: 0.75rem;
    font-size: 14px;
  }
`;

function FloatingTextField({ label, onChange, value, type, error, ...props }) {
  const uuid = useId();

  return (
    <FloatingTextFieldStyled className="field" {...props}>
      <input
        id={uuid}
        type={type}
        value={value}
        onChange={onChange}
        placeholder="Type here..."
      />
      <label htmlFor={uuid}>{label}</label>
      {!!error && <ErrorStyle>{error}</ErrorStyle>}
    </FloatingTextFieldStyled>
  );
}

export default FloatingTextField;
