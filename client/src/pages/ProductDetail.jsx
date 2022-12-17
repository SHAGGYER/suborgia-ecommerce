import React from "react";
import Page from "../components/Page";
import styled from "styled-components";
import Slider, { ImageSlider } from "../components/Slider";
import { useParams } from "react-router-dom";
import HttpClient from "../services/HttpClient";
import Rating from "../components/Rating";
import PrimaryButton from "../components/UI/PrimaryButton";
import Skeleton from "react-loading-skeleton";
import CartService from "../services/CartService";
import ProductProperties from "../components/products/ProductProperties";
import cogoToast from "cogo-toast";
import { Wrapper } from "../components/Wrapper";
import Reviews from "../components/Reviews";

const ContentStyled = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;

  .rating {
    display: flex;
    gap: 2rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .title {
    margin-bottom: 2rem;
    h3 {
      font-size: 30px;
    }

    h2 {
      font-size: 40px;
      margin-bottom: 1rem;
    }
  }

  .description {
    margin-bottom: 1.5rem;
  }

  .image-container {
    display: flex;
    position: relative;
  }
`;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedProperities, setSelectedProperities] = React.useState({});
  const [addToCartLoading, setAddToCartLoading] = React.useState(false);
  const [outOfStock, setOutOfStock] = React.useState(false);
  const [stockCollection, setStockCollection] = React.useState(null);

  const { price } = CartService.getPrice(product, selectedProperities);

  React.useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    setLoading(true);
    const { data } = await HttpClient().get(`/api/filters/products/${id}`);
    setProduct(data.content);
    setLoading(false);
  };

  const handleAddToCart = async () => {
    setAddToCartLoading(true);

    await CartService.addToCart(
      product.id,
      price,
      quantity,
      selectedProperities,
      stockCollection?.collectionId
    );
    setAddToCartLoading(false);
    cogoToast.success("Product added to cart");
  };

  return (
    <Page>
      <Wrapper>
        <ContentStyled>
          <div>
            {loading ? (
              <Skeleton height={500} width={400} />
            ) : (
              <ImageSlider
                height={"500px"}
                items={product?.images.map((image) => (
                  <img
                    key={image.id}
                    src={image?.file_path}
                    alt="product image"
                  />
                ))}
              />
            )}
          </div>
          <div>
            <div className="rating">
              {loading ? (
                <Skeleton height={30} width={250} />
              ) : (
                <>
                  <Rating rating={product.rating} />
                  <span>{product.reviews_count} reviews</span>
                </>
              )}
            </div>

            <div className="title">
              {loading ? (
                <Skeleton height={30} width={200} />
              ) : (
                <h3>{product?.name}</h3>
              )}
              {loading ? (
                <Skeleton
                  height={50}
                  width={200}
                  style={{ marginBottom: "2rem" }}
                />
              ) : (
                <h2>${price}</h2>
              )}
              <div className="description">
                {loading ? (
                  <Skeleton height={70} width={"100%"} />
                ) : (
                  <p>{product?.description}</p>
                )}
              </div>
              {loading ? (
                <Skeleton height={30} width={200} />
              ) : (
                <PrimaryButton
                  disabled={addToCartLoading || outOfStock}
                  onClick={() => handleAddToCart()}
                >
                  {addToCartLoading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fa-solid fa-shopping-cart"></i>
                  )}
                  Add to cart
                </PrimaryButton>
              )}
            </div>

            {loading ? (
              <div style={{ marginBottom: "2rem" }}>
                <Skeleton height={30} width={200} />
                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                >
                  <Skeleton height={30} width={100} />
                  <Skeleton height={30} width={100} />
                  <Skeleton height={30} width={100} />
                </div>

                <Skeleton height={30} width={200} />
                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                >
                  <Skeleton height={30} width={100} />
                  <Skeleton height={30} width={100} />
                  <Skeleton height={30} width={100} />
                </div>

                <Skeleton height={30} width={200} />
                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                >
                  <Skeleton height={30} width={100} />
                  <Skeleton height={30} width={100} />
                  <Skeleton height={30} width={100} />
                </div>
              </div>
            ) : (
              <ProductProperties
                getOutOfStock={(outOfStock) => setOutOfStock(outOfStock)}
                stockCollections={product?.stock_collections}
                properties={product?.properties}
                onChange={({ properties, stockCollection }) => {
                  setSelectedProperities(properties);
                  setStockCollection(stockCollection);
                }}
              />
            )}
          </div>
        </ContentStyled>
        {loading ? (
          <Skeleton height={500} width={"100%"} />
        ) : (
          <p
            dangerouslySetInnerHTML={{ __html: product?.long_description }}
            style={{ lineHeight: 2, marginTop: "3rem" }}
          ></p>
        )}

        {product && <Reviews product={product} />}
      </Wrapper>
    </Page>
  );
}
