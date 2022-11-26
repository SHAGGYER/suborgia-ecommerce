import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  padding: 0.75rem 0;
  position: relative;
  width: 100%;

  ::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #ccc;
  }

  h5 {
    font-size: 15px;
  }

  input[type="checkbox"] {
    height: 20px;
    width: 20px;
    background-color: var(--red);
  }
`;

export default function Filter({ title }) {
  const [isHovering, setIsHovering] = React.useState(false);
  const onMouseEnter = (e) => {
    setIsHovering(true);
  };

  const onMouseLeave = (e) => {
    setIsHovering(false);
  };

  return (
    <Wrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <input
        checked={isHovering}
        type="checkbox"
        className={isHovering ? "selected" : ""}
      />
      <h5>{title}</h5>
    </Wrapper>
  );
}
