import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import HttpClient from "../services/HttpClient";
import Page from "../components/Page";
import moment from "moment";

const OrderStatusStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;

  article {
    position: relative;
    width: 20%;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    z-index: 1;

    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 5px;
      background-color: #ee5435;
      position: absolute;
      top: 12px;
      z-index: 0;
      left: 0;
    }

    &.next::after {
      background-color: #ccc;
    }

    .status-icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid #ee5435;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      position: relative;
      z-index: 99;
      background-color: white;
      margin-bottom: 0.5rem;
    }

    &.next .status-icon {
      border-color: #ccc;
    }

    &.previous .status-icon {
      background-color: #ee5435;

      i {
        color: white;
      }
    }

    span {
      font-size: 1.2rem;
      text-transform: capitalize;
    }
  }
`;

const OrderStatus = ({ status }) => {
  const statuses = ["pending", "shipped", "delivered"];

  const isPreviousStatusCompleted = (s) => {
    return statuses.indexOf(s) < statuses.indexOf(status);
  };

  const isNextStatus = (s) => {
    return statuses.indexOf(s) > statuses.indexOf(status);
  };

  return (
    <OrderStatusStyled>
      {statuses.map((s, index) => (
        <article
          key={s}
          className={
            isNextStatus(s)
              ? " next"
              : isPreviousStatusCompleted(s)
              ? " previous"
              : ""
          }
        >
          <div className={"status-icon"}>
            {status === s || isPreviousStatusCompleted(s) ? (
              <i className="fa-solid fa-check"></i>
            ) : (
              <i className="fa-regular fa-question"></i>
            )}
          </div>
          <span>{s}</span>
        </article>
      ))}
    </OrderStatusStyled>
  );
};

const OrderDetailStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.1);
  padding: 1rem;

  p {
    font-size: 1.2rem;
  }

  h2 {
    span {
      text-transform: capitalize;
    }
  }
`;

export default function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = React.useState(null);

  React.useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    const { data } = await HttpClient().get(`/api/orders/${id}`);
    setOrder(data.content);
  };

  return (
    <Page>
      <h1 style={{ marginBottom: "1rem" }}>Order Tracking</h1>
      <OrderDetailStyled>
        <p>Order ID: {order?.uuid}</p>
        {(order?.status === "pending" ||
          order?.status === "shipped" ||
          order?.status === "delivered") && (
          <OrderStatus status={order?.status} />
        )}
        {order?.status === "pending" || order?.status === "shipped" ? (
          <p>
            Your ordered will be delivered on{" "}
            {moment(order?.created_at).add(5, "days").format("DD-MM-YYYY")}.
          </p>
        ) : (
          <>
            <p>Your ordered is now {order?.status}</p>
            <p>
              Latest status update:{" "}
              {moment(order?.updated_at).format("DD-MM-YYYY")}.
            </p>
          </>
        )}
      </OrderDetailStyled>
    </Page>
  );
}
