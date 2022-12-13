import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import CartService from "../../services/CartService";
import PrimaryButton from "../UI/PrimaryButton";

const Container = styled.div`
  position: relative;
  width: 100%;
  transition: all 0.5s ease-in-out;

  &:hover {
    border-bottom: none;
    box-shadow: 0 10px 7px 0 rgba(0, 0, 0, 0.2);
    .hover-content {
      visibility: visible;
      opacity: 1;
      box-shadow: 0 10px 5px 0 rgba(0, 0, 0, 0.2);
    }

    .image-container {
      .quick-view {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  .hover-content {
    z-index: 99;

    position: absolute;
    width: 100%;
    visibility: hidden;
    left: 0;
    right: 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;
    opacity: 0;
    transition: all 0.5s ease-in-out;
    background-color: white;
  }
`;

const ProductStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border: none;

  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.5s linear;

  &:hover {
  }

  h3 {
    font-size: 16px;
  }

  h5 {
    color: darkgoldenrod;
  }

  img {
    margin-bottom: 1rem;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .price {
    font-size: 17px;
    display: flex;
    gap: 0.5rem;
    align-items: center;

    s {
      color: #999;
      font-size: 14px;
    }
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;

    .quick-view {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.5s ease-in-out;
      opacity: 0;
      visibility: hidden;
      padding: 10px 30px;
      background-color: rgba(237, 43, 43, 0.5);
      text-align: center;
      color: white;
      text-decoration: none;

      &:hover {
        background-color: rgba(237, 43, 43, 0.8);
      }
    }
  }
`;

export default function Product({ product, size }) {
  const history = useHistory();

  return (
    <Container>
      <ProductStyled className="product">
        <div className="image-container">
          <img src={product?.image} alt="product" />
          <a
            href="#"
            className="quick-view"
            onClick={() => history.push(`/products/${product.id}`)}
          >
            <i className="fa-solid fa-eye" />
            Quick View
          </a>
        </div>

        <h5>{product?.category?.name}</h5>
        <h3>{product?.name}</h3>
        <p className="price">
          ${product?.price}
          {product?.oldPrice ? <s>${product.oldPrice}</s> : ""}
        </p>
      </ProductStyled>
      <div className="hover-content">
        <PrimaryButton onClick={() => CartService.addToCart(product, 1)}>
          <i className="fa-solid fa-cart-plus" />
          Add to cart
        </PrimaryButton>
      </div>
    </Container>
  );
}
