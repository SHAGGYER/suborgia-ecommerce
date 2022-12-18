import React from "react";
import styled from "styled-components";
import { useClickOutside } from "../hooks/ClickOutside";

const Container = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  visibility: hidden;
  opacity: 0;
  top: 5rem;
  z-index: 99;
  transition: all 0.5s ease-in-out;
  width: 200px;

  @media (max-width: 1100px) {
    right: auto;
    left: 0;
    width: 100%;

    > div {
      width: 100% !important;
    }
  }

  .submenu-link {
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: black;

    &:hover {
      background-color: var(--primary);
      color: white;
    }
  }

  &.open {
    visibility: visible;
    opacity: 1;
    top: 3rem;

    @media (max-width: 1100px) {
      left: 0;
    }
  }
`;

export default function NavbarSubmenu({ title, content, icon }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();

  useClickOutside(ref, () => setOpen(false));

  return (
    <li className="navlink no-close" onClick={() => setOpen(!open)} ref={ref}>
      {icon ? icon : title}
      <Container className={open ? "open" : ""}>{content()}</Container>
    </li>
  );
}
