import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import PrimaryButton from "../components/UI/PrimaryButton";
import { ProductUpdateCreateDialog } from "../components/ProductUpdateCreateDialog";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { Container } from "../components/Container";
import MyResourceBrowser from "../components/MyResourceBrowser";

const StockStyled = styled.div`
  width: 5px;
  height: 20px;
  background-color: #ccc;
  position: relative;
`;

const Stock = ({ stock }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span>{stock}</span>
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
    </div>
  );
};

export default function Products() {
  return (
    <Page>
      <MyResourceBrowser
        title={"Products"}
        url="/api/products"
        component={ProductUpdateCreateDialog}
        templateColumns="50px 100px 1fr 150px 150px"
        newRow={{
          name: "A new product",
          description: "",
          properties: [],
          price: 0,
          stock: 0,
        }}
        columns={[
          {
            name: "",
            width: "50px",
            cell: (row) =>
              row?.images?.length ? (
                <img
                  src={row?.images?.[0]?.file_path}
                  alt={row?.name}
                  style={{ width: 50, height: 50, objectFit: "cover" }}
                />
              ) : (
                <span />
              ),
          },
          {
            name: "ID",
            key: "id",
            width: "100px",
          },
          {
            name: "Name",
            key: "name",
            width: "100%",
          },
          {
            name: "Price",
            cell: (row) =>
              `$${row.price >= 0 ? parseFloat(row.price).toFixed(2) : ""}`,
            width: "150px",
          },
          {
            name: "Stock",
            cell: (row) => <Stock stock={row.stock} />,
          },
        ]}
        order={[
          {
            key: "price",
            name: "Price",
          },
          {
            key: "stock",
            name: "Stock",
          },
        ]}
        additionalSearch={[
          {
            title: "ID",
            key: "id",
          },
          {
            title: "Stock",
            key: "stock",
            options: [
              {
                title: "Equals",
                key: "=",
              },
              {
                title: "Greater than",
                key: ">",
              },
              {
                title: "Less than",
                key: "<",
              },
            ],
          },
          {
            title: "Name",
            key: "name",
            options: [
              {
                title: "Contains",
                key: "like",
              },
              {
                title: "Equals",
                key: "=",
              },
            ],
          },
          {
            title: "Price Start",
            key: "price",
          },
          {
            title: "Price End",
            key: "price",
          },
        ]}
      />
    </Page>
  );
}
