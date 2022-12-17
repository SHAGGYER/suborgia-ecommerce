import React, { useEffect, useId, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.section`
  position: relative;
  overflow: hidden;
`;

const Wrapper = styled.li`
  position: relative;

  .title {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .item {
    padding: 0.5rem 0.5rem 0.5rem 2rem;
    background-color: var(--primary);
  }
`;

const WrapperItems = styled.div`
  user-select: none;
  transition: all 0.3s ease-in-out;
  position: relative;
  max-height: ${(props) => (props.isOpen ? props.height : 0)}px;

  .item {
    padding: 0.75rem 1rem;
    padding-left: 2.5rem;
    margin: ${(props) => (props.isOpen ? "0.5rem 0" : 0)};
    border-radius: 0.5rem;
    background-color: transparent;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    color: #c6c8cc;

    &:hover,
    &.active {
      background-color: #2c3344;
      color: white;
    }
  }
`;

function SidebarMenu({
  title,
  items,
  close,
  icon,
  triggerClose,
  currentOpen,
  setCurrentOpen,
  defaultOpen,
}) {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(defaultOpen || false);
  const navigate = useNavigate();
  const [height, setHeight] = useState(0);
  const id = useId();

  useEffect(() => {
    console.log(close);
    if (close && currentOpen !== id) {
      setIsOpen(false);
    }
  }, [close, currentOpen]);

  const getItemsHeight = () => {
    let height = 0;

    const items = document.getElementById(id).querySelectorAll(".item");
    items.forEach((item) => {
      height += item.offsetHeight + 15;
    });

    return height;
  };

  useEffect(() => {
    setHeight(getItemsHeight());
  }, []);

  return (
    <Container id={id}>
      <Wrapper
        onClick={() => {
          triggerClose && triggerClose();
          setIsOpen(!isOpen);
          setCurrentOpen(id);
        }}
      >
        <div className="title">
          {icon}
          {title}
        </div>
      </Wrapper>
      <WrapperItems height={height} isOpen={isOpen}>
        {items.map((item, index) => (
          <div
            key={index}
            className={
              "item " + (location.pathname === item.to ? "active" : "")
            }
            onClick={() => navigate(item.to)}
          >
            {item.title}
          </div>
        ))}
      </WrapperItems>
    </Container>
  );
}

export default SidebarMenu;
