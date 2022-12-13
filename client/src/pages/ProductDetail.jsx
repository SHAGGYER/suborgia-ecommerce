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
    margin-bottom: 1.5rem;

    h3 {
      font-size: 30px;
    }

    h2 {
      font-size: 40px;
      margin-bottom: 3rem;
    }
  }

  .description {
    margin-bottom: 1.5rem;
  }

  .image-container {
    display: flex;
    position: relative;
  }

  .properties {
    .property {
      margin-bottom: 2rem;
      h3 {
        font-size: 20px;
        margin-bottom: 1rem;
      }
      .fields {
        display: flex;
        gap: 1rem;
      }
      .field {
        border: 2px solid #efefef;
        padding: 1rem;
      }
    }
  }
`;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    setLoading(true);
    const { data } = await HttpClient().get(`/api/filters/products/${id}`);
    setProduct(data.content);
    setLoading(false);
  };

  return (
    <Page>
      <ContentStyled>
        <div>
          {loading ? (
            <Skeleton height={500} width={400} />
          ) : (
            <ImageSlider
              height={"500px"}
              items={[
                <article className="image-container">
                  <img src="/assets/images/img-3.jpg" alt="product image" />
                </article>,
                <article className="image-container">
                  <img src="/assets/images/img-3.jpg" alt="product image" />
                </article>,
                <article className="image-container">
                  <img src="/assets/images/img-3.jpg" alt="product image" />
                </article>,
                <article className="image-container">
                  <img src="/assets/images/img-3.jpg" alt="product image" />
                </article>,
                <article className="image-container">
                  <img src="/assets/images/img-3.jpg" alt="product image" />
                </article>,
              ]}
            />
          )}
        </div>
        <div>
          <div className="rating">
            {loading ? (
              <Skeleton height={30} width={250} />
            ) : (
              <>
                <Rating rating={4} />
                <span>5 reviews</span>
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
              <h2>${product?.price}</h2>
            )}
            {loading ? (
              <Skeleton height={30} width={200} />
            ) : (
              <PrimaryButton
                onClick={() => CartService.addToCart(product, quantity)}
              >
                <i className="fa-solid fa-shopping-cart"></i>
                Add to cart
              </PrimaryButton>
            )}
          </div>

          <div className="description">
            {loading ? (
              <Skeleton height={70} width={"100%"} />
            ) : (
              <p>{product?.description}</p>
            )}
          </div>

          {loading ? (
            <div style={{ marginBottom: "2rem" }}>
              <Skeleton height={30} width={200} />
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Skeleton height={30} width={100} />
                <Skeleton height={30} width={100} />
                <Skeleton height={30} width={100} />
              </div>

              <Skeleton height={30} width={200} />
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Skeleton height={30} width={100} />
                <Skeleton height={30} width={100} />
                <Skeleton height={30} width={100} />
              </div>

              <Skeleton height={30} width={200} />
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Skeleton height={30} width={100} />
                <Skeleton height={30} width={100} />
                <Skeleton height={30} width={100} />
              </div>
            </div>
          ) : (
            <div className="properties">
              {product?.properties?.map((property) => (
                <div className="property" key={property.id}>
                  <article>
                    <h3>{property.name}</h3>
                    <div className="fields">
                      {property.fields?.map((field) => (
                        <div key={field.id} className="field">
                          <span>{field.name}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </ContentStyled>
      {loading ? (
        <Skeleton height={500} width={"100%"} />
      ) : (
        <p style={{ fontSize: 20, lineHeight: 1.6 }}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum
          ratione veritatis laboriosam quam fugiat et officiis, possimus quo
          omnis repellendus. Dolor, debitis? Dolores nulla quis impedit ut autem
          repellat ullam, expedita eaque aperiam perspiciatis, asperiores
          provident corrupti harum minima quibusdam fuga ex debitis voluptas
          obcaecati maxime, architecto id. Deserunt nisi harum ea ipsam et.
          Error ipsa sed, asperiores eveniet odit consequatur quam voluptatibus
          debitis similique dolorum, labore maxime tenetur quaerat possimus
          praesentium delectus qui voluptates consequuntur officiis alias
          perspiciatis omnis incidunt iusto dolores.
        </p>
      )}
    </Page>
  );
}
