import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import Product from "./products/Product";

const SliderStyled = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;

  div {
    width: 100%;
    height: 100%;
    transition: all 0.5s ease-in-out;

    &.active {
      border: 2px solid var(--primary);
    }
  }

  .item {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .next {
    position: absolute;
    transform: translateX(100%);
    border: none !important;
  }

  .prev {
    position: absolute;
    transform: translateX(-100%);
    border: none !important;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageSliderStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ImageSlider = ({
  items,
  height,
  onNextSlide,
  onPrevSlide,
  onItemsChange,
}) => {
  const [current, setCurrent] = React.useState(0);

  useEffect(() => {
    if (onNextSlide) {
      onNextSlide(nextSlide);
    }
  }, [onNextSlide, current]);

  useEffect(() => {
    if (onPrevSlide) {
      onPrevSlide(prevSlide);
    }
  }, [onPrevSlide, current]);

  const nextSlide = () => {
    setCurrent(current === items.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? items.length - 1 : current - 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [current]);

  const isInRangeBefore = (index) => {
    return index === current - 1;
  };

  return (
    <section>
      <SliderStyled style={{ height }}>
        {items.map((item, index) => (
          <div
            key={index}
            className={index < current ? "prev" : index > current ? "next" : ""}
          >
            <div style={{ width: 400, height: 400 }}>{item}</div>
          </div>
        ))}
      </SliderStyled>
      <SliderStyled>
        <div className="item">
          {items.map((item, index) => (
            <div
              key={index}
              data-index={index + " " + current}
              className={
                "item " + current - 1 === index
                  ? ""
                  : index < current - 1
                  ? "prev"
                  : index > current + 1 === index
                  ? ""
                  : index > current + 1
                  ? "next"
                  : ""
              }
            >
              <div>{item}</div>
            </div>
          ))}
        </div>
      </SliderStyled>
    </section>
  );
};

export default function Slider({ items, height, onNextSlide, onPrevSlide }) {
  const [current, setCurrent] = React.useState(0);

  useEffect(() => {
    if (onNextSlide) {
      onNextSlide(nextSlide);
    }
  }, [onNextSlide, current]);

  useEffect(() => {
    if (onPrevSlide) {
      onPrevSlide(prevSlide);
    }
  }, [onPrevSlide, current]);

  const nextSlide = () => {
    setCurrent(current === items.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? items.length - 1 : current - 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <SliderStyled style={{ height }}>
      {items.map((item, index) => (
        <div
          key={index}
          className={index < current ? "prev" : index > current ? "next" : ""}
        >
          {item}
        </div>
      ))}
    </SliderStyled>
  );
}
