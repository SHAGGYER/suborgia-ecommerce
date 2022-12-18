import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import PrimaryButton from "../components/UI/PrimaryButton";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { Container } from "../components/Container";
import { Pagination } from "../components/Pagination";
import UpdateOrder from "../components/UpdateOrder";
import cogoToast from "cogo-toast";
import MyResourceBrowser from "../components/MyResourceBrowser";
import { Form } from "../components/UI/Form";
import FloatingTextField from "../components/FloatingTextField";

const EditRow = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  z-index: 99;
  box-shadow: 0 10px 5px 0 rgba(0, 0, 0, 0.1);
`;

const RowsContainer = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 200px 150px 150px;
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

export default function Orders() {
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState("");
  const [totalOperator, setTotalOperator] = useState("=");
  const [id, setId] = useState("");
  const [uuid, setUuid] = useState("");

  return (
    <Page>
      <MyResourceBrowser
        title={"Orders"}
        url="/api/orders"
        templateColumns={"50px 200px 200px 1fr"}
        columns={[
          { key: "id", name: "ID" },
          { key: "name", name: "User", cell: (row) => row.name },
          { key: "status", name: "Status" },
          {
            name: "Total",
            cell: (row) => <span>${parseFloat(row.total).toFixed(2)}</span>,
          },
        ]}
        component={UpdateOrder}
        noCreate
        noDefaultSearch
        order={[
          {
            key: "created_at",
            name: "Created At",
          },
          {
            key: "total",
            name: "Total",
          },
        ]}
        additionalSearch={[
          {
            key: "id",
            title: "ID",
          },
          {
            key: "uuid",
            title: "UUID",
          },
          {
            key: "status",
            title: "Status",
            valueType: "select",
            options: [
              {
                key: "pending",
                name: "Pending",
              },
              {
                key: "shipped",

                name: "Shipped",
              },
              {
                key: "processing",

                name: "Processing",
              },
              {
                key: "completed",

                name: "Completed",
              },
              {
                key: "cancelled",

                name: "Cancelled",
              },
            ],
          },
          {
            key: "total",
            title: "Total",
          },
        ]}
      />
    </Page>
  );
}
