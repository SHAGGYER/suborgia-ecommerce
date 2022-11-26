import React from "react";
import styled from "styled-components";
import { useClickOutside } from "../hooks/ClickOutside";

const Container = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
`;

export default function NavbarSubmenu({ title, content, icon }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();

  useClickOutside(ref, () => setOpen(false));

  return (
    <li className="navlink" onClick={() => setOpen(!open)} ref={ref}>
      <img src={icon} alt={title} />
      {title}
      {open && <Container>{content()}</Container>}
    </li>
  );
}
