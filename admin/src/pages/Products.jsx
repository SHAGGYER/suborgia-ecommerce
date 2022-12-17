import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import PrimaryButton from "../components/UI/PrimaryButton";
import { ProductUpdateCreateDialog } from "../components/ProductUpdateCreateDialog";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { Container } from "../components/Container";

const StockStyled = styled.div`
  width: 5px;
  height: 20px;
  background-color: #ccc;
  position: relative;
`;

const Stock = ({ stock }) => {
  return (
    <StockStyled stock={stock}>
      <div
        style={{
          backgroundColor:
            stock < 25 ? "red" : stock < 50 ? "orange" : "lightgreen",
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: `${stock <= 100 ? stock : 100}%`,
        }}
      ></div>
    </StockStyled>
  );
};

const Pagination = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;

  .controls {
    display: flex;
    gap: 1rem;

    i {
      cursor: pointer;

      &.disabled {
        color: #e2e8f0;
      }
    }
  }
`;

const CreateEditProduct = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  z-index: 99;
  box-shadow: 0 10px 5px 0 rgba(0, 0, 0, 0.1);
`;

const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: 50px 200px 1fr 150px 150px 100px;
  padding: 1rem;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;

  &.header {
    background-color: #f8fafc;
  }

  .image {
    img {
      width: 50px;
      height: 50px;
    }
  }
`;

const PER_PAGE = 15;

export default function Products() {
  const navigate = useNavigate();
  const { page: pageQuery } = queryString.parse(window.location.search);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(parseInt(pageQuery) || 1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    navigate(`?page=${page}`);
  }, [page]);

  useEffect(() => {
    getProducts(pageQuery);
  }, [pageQuery]);

  const getProducts = async (page = 1) => {
    const { data } = await HttpClient().get("/api/products?page=" + page);
    setProducts(data.content.data);
    setTotalRows(data.content.total);
    setLastPage(data.content.last_page);
  };

  const isPreviousPageDisabled = () => {
    return page === 1;
  };

  const isNextPageDisabled = () => {
    return page === lastPage;
  };

  return (
    <Page>
      <Container>
        <h1>Products</h1>
        <PrimaryButton>New Product</PrimaryButton>
        <ProductsContainer className="header">
          <div></div>
          <div>SKU</div>
          <div>Name</div>
          <div>Price</div>
          <div>Stock</div>
          <div>Details</div>
        </ProductsContainer>
        <div style={{ flex: "1 1 auto", overflowY: "auto" }}>
          {products.map((product, index) => (
            <div style={{ position: "relative" }} key={index}>
              <ProductsContainer>
                <div className="image">
                  <img
                    src={product.images?.[0]?.file_path}
                    alt={product.name}
                  />
                </div>
                <div>{product.id}</div>
                <div>{product.name}</div>
                <div>${product.price.toFixed(2)}</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{product.stock}</span>
                  <Stock stock={product.stock} />
                </div>
                <div>
                  <i
                    className="fa-solid fa-chevron-down"
                    onClick={() =>
                      setSelectedProduct(
                        selectedProduct?.id === product.id ? null : product
                      )
                    }
                  />
                </div>
              </ProductsContainer>
              {selectedProduct?.id === product.id && (
                <CreateEditProduct>
                  <ProductUpdateCreateDialog product={product} />
                </CreateEditProduct>
              )}
            </div>
          ))}
        </div>
        <Pagination>
          <div className="header">
            {page * PER_PAGE - PER_PAGE + 1} - {page * PER_PAGE} of {totalRows}
          </div>
          <div className="controls">
            <i
              className={
                "fa-solid fa-angle-left" +
                (isPreviousPageDisabled() ? " disabled" : "")
              }
              onClick={() =>
                isPreviousPageDisabled() ? null : setPage(page - 1)
              }
            />
            <i
              className={
                "fa-solid fa-angle-right" +
                (isNextPageDisabled() ? " disabled" : "")
              }
              onClick={() => (isNextPageDisabled() ? null : setPage(page + 1))}
            />
          </div>
        </Pagination>
      </Container>
    </Page>
  );
}
