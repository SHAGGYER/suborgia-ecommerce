import React, { useRef } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import HttpClient from "../../services/HttpClient";
import Slider from "../Slider";
import Product from "./Product";

const BestSellersStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 1rem;
  width: 100%;
  border: 3px solid #efefef;
  margin-bottom: 1rem;
  position: relative;

  article {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem;
  }

  .title {
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .buttons {
      display: flex;
      gap: 0.5rem;

      i {
        font-size: 1rem;
        cursor: pointer;
        background-color: #efefef;
        padding: 0.5rem;
      }
    }
  }
`;

export default function BestSellers() {
  const [bestSellers, setBestSellers] = React.useState([]);

  const nextSlide = useRef(undefined);
  const prevSlide = useRef(undefined);

  useEffect(() => {
    getBestSellers();
  }, []);

  useEffect(() => {
    let intervalId;
    intervalId = setInterval(() => {
      getBestSellers();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [bestSellers]);

  const getBestSellers = async () => {
    const { data } = await HttpClient().get("/api/filters/bestSellers");
    setBestSellers([...bestSellers, ...data.content]);
  };

  const getBestSellerItems = () => {
    return Array(parseInt(bestSellers.length / 4))
      .fill()
      .map((x, i) => {
        return (
          <article key={i}>
            {bestSellers
              .filter((x, index) => index >= i * 4 && index < i * 4 + 4)
              .map((item, index) => (
                <Product key={index} product={item} slim size={100} />
              ))}
          </article>
        );
      });
  };

  return (
    <BestSellersStyled>
      <div className="title">
        <h3>Best Sellers</h3>

        <div className="buttons">
          <i
            onClick={() => prevSlide.current()}
            className="fa-solid fa-chevron-left"
          />
          <i
            onClick={() => nextSlide.current()}
            className="fa-solid fa-chevron-right"
          />
        </div>
      </div>

      <Slider
        onNextSlide={(next) => (nextSlide.current = next)}
        onPrevSlide={(prev) => (prevSlide.current = prev)}
        items={getBestSellerItems()}
      />
    </BestSellersStyled>
  );
}
