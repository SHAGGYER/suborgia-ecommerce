import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import CartService from "../../services/CartService";
import PrimaryButton from "../UI/PrimaryButton";
import Skeleton from "react-loading-skeleton";
import { CustomDialog, useDialog } from "react-st-modal";
import ProductProperties from "./ProductProperties";
import Slider from "../Slider";

const PropertiesDialogStyled = styled.div`
  padding: 1rem;

  h2 {
    margin-bottom: 1rem;
  }
`;

const PropertiesDialog = ({ product }) => {
  const dialog = useDialog();
  const [selectedProperties, setSelectedProperties] = React.useState({});
  const [outOfStock, setOutOfStock] = React.useState(false);
  const [stockCollection, setStockCollection] = React.useState(null);

  const onChange = ({ properties, stockCollection }) => {
    setSelectedProperties(properties);
    setStockCollection(stockCollection);
  };

  return (
    <PropertiesDialogStyled>
      <h1>{product.name}</h1>

      <h2>Choose Properties</h2>

      <ProductProperties
        properties={product.properties}
        stockCollections={product.stock_collections}
        onChange={onChange}
        getOutOfStock={(outOfStock) => setOutOfStock(outOfStock)}
      />

      <PrimaryButton
        disabled={outOfStock}
        onClick={() => dialog.close({ selectedProperties, stockCollection })}
      >
        Add to cart
      </PrimaryButton>
    </PropertiesDialogStyled>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  transition: all 0.5s ease-in-out;

  &:hover:not(.slim):not(.featured) {
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

  h3 {
    font-size: 16px;
    text-align: center;
    word-break: break-word;
  }

  h5 {
    color: darkgoldenrod;
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    object-position: center;
  }

  &.slim img {
    height: 100px;
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

    .wrapper {
      margin-bottom: 1rem;
      width: 100%;
    }

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

export default function Product({ product, loading, slim, featured }) {
  const history = useHistory();
  const [showSlider, setShowSlider] = React.useState(false);

  const handleAddToCart = async () => {
    if (product?.properties?.length > 0) {
      const result = await CustomDialog(<PropertiesDialog product={product} />);
      if (result) {
        const { price } = CartService.getPrice(
          product,
          result.selectedProperties
        );

        CartService.addToCart(
          product.id,
          price,
          1,
          result.selectedProperties,
          result.stockCollection?.collectionId
        );
      }
      return;
    }
    await CartService.addToCart(product, 1);
  };

  const redirectToProduct = () => {
    history.push(`/products/${product.id}`);
  };

  return (
    <Container
      className={`${slim ? "slim" : ""} ${featured ? "featured" : ""}`}
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
      onClick={() => (slim || featured ? redirectToProduct() : null)}
    >
      {loading ? (
        <Skeleton height={200} width={"100%"} />
      ) : (
        <ProductStyled
          className={
            "product" + (slim ? " slim" : "") + (featured ? " featured" : "")
          }
        >
          <div className="image-container">
            <div className="wrapper">
              {showSlider ? (
                <Slider
                  items={product?.images?.map((image, index) => (
                    <img key={index} src={image.file_path} alt="product" />
                  ))}
                />
              ) : (
                <img src={product?.images?.[0]?.file_path} alt="product" />
              )}
            </div>
            {!slim && (
              <a
                href="#"
                className="quick-view"
                onClick={() => redirectToProduct()}
              >
                <i className="fa-solid fa-eye" />
                Quick View
              </a>
            )}
          </div>

          <h5>{product?.category?.name}</h5>
          <h3>
            {product?.name} ({product?.id})
          </h3>
          <p className="price">
            ${product?.price}
            {product?.base_price && product?.base_price > product?.price ? (
              <s>${product.base_price}</s>
            ) : (
              ""
            )}
          </p>
        </ProductStyled>
      )}
      {!slim && !featured && (
        <div className="hover-content">
          <PrimaryButton onClick={handleAddToCart}>
            <i className="fa-solid fa-cart-plus" />
            Add to cart
          </PrimaryButton>
        </div>
      )}
    </Container>
  );
}
