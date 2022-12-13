import React from "react";
import { useHistory } from "react-router-dom";
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

export default function Filter({ brand, category, title, checked, onClick }) {
  const [isHovering, setIsHovering] = React.useState(false);
  const history = useHistory();

  const onMouseEnter = (e) => {
    setIsHovering(true);
  };

  const onMouseLeave = (e) => {
    setIsHovering(false);
  };

  const handleOnClick = (e) => {
    history.replace(`/categories/${category}${brand ? `/brand/${brand}` : ""}`);
    onClick({ brand, category });
  };

  return (
    <Wrapper
      onClick={handleOnClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <input
        readOnly
        checked={isHovering || checked}
        type="checkbox"
        className={isHovering ? "selected" : ""}
      />
      <h5>{title}</h5>
    </Wrapper>
  );
}
