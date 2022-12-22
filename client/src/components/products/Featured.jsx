import React from "react";
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
  width: 100%;
  margin-bottom: 1rem;
  margin-top: 3rem;

  h3 {
    font-size: 25px;
    margin-bottom: 1rem;
  }

  article {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.25rem;
  }
`;

export default function Featured() {
  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    getBestSellers();
  }, []);

  useEffect(() => {
    let intervalId;
    intervalId = setInterval(() => {
      getBestSellers();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [products]);

  const getBestSellers = async () => {
    const { data } = await HttpClient().get("/api/filters/featured");
    setProducts([...products, ...data.content]);
  };

  const getItems = () => {
    return Array(parseInt(products.length / 3))
      .fill()
      .map((x, i) => {
        return (
          <article key={i}>
            {products
              .filter((x, index) => index >= i * 3 && index < i * 3 + 3)
              .map((item, index) => (
                <Product key={index} featured product={item} size={100} />
              ))}
          </article>
        );
      });
  };

  return (
    <BestSellersStyled>
      <h3>Featured</h3>

      <Slider items={getItems()} />
    </BestSellersStyled>
  );
}
