import React from "react";
import styled from "styled-components";

const BannerStyled = styled.div`
  width: 100%;
  height: 250px;
  position: relative;
  overflow: hidden;
  border-radius: 7px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out;
    transform: scale(0);
    opacity: 0;
  }

  &:hover .backdrop {
    transform: scale(1);
    opacity: 1;
  }
`;

export default function Banner({ image }) {
  return (
    <BannerStyled>
      <div className="backdrop"></div>
      <img src={image} alt="banner" />
    </BannerStyled>
  );
}
