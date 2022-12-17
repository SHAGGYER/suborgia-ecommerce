import React from "react";
import Page from "../components/Page";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "../components/Stripe/CheckoutForm";
import cogoToast from "cogo-toast";
import { useHistory } from "react-router-dom";
import CartService from "../services/CartService";
import styled from "styled-components";
import { useEffect } from "react";
import HttpClient from "../services/HttpClient";
import CartItem from "../components/products/CartItem";
import PrimaryButton from "../components/UI/PrimaryButton";
import { Container } from "../components/Container";
import Skeleton from "react-loading-skeleton";
import { Wrapper } from "../components/Wrapper";

const CouponContainer = styled.div`
  margin-bottom: 1rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

  .header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: white;
    padding: 1rem;
    cursor: pointer;
    h3 {
      font-size: 16px;
    }
  }

  .coupon-code {
    transition: all 0.3s ease-in-out;
    max-height: 0;
    border: 1px solid #efefef;
    background-color: white;

    padding: 0 1rem;
    overflow: hidden;
    opacity: 0;

    .error {
      color: red;
      margin-bottom: 0.5rem;
    }

    article {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    input {
      padding: 0.5rem;
    }

    &.active {
      opacity: 1;
      max-height: 300px;
      padding: 1rem;
    }
  }
`;

const SummaryTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  background-color: black;
  color: white;
  padding: 1rem;
`;

const Summary = styled.div`
  display: grid;
  margin-bottom: 1rem;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  .summary {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    padding: 1rem;

    .subtotal,
    .tax,
    .total,
    .coupon {
      span:first-child {
        font-weight: bold;
      }
    }

    .total {
      font-size: 40px;
    }
  }
`;

export default function Payment() {
  const history = useHistory();
  const [cart, setCart] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [couponContainerActive, setCouponContainerActive] =
    React.useState(false);
  const [coupon, setCoupon] = React.useState(null);
  const [couponCode, setCouponCode] = React.useState("");
  const [couponError, setCouponError] = React.useState(null);
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    const cartId = localStorage.getItem("cartId");
    setLoading(true);
    const { data } = await HttpClient().get(`/api/cart/${cartId}`);
    if (!data.content.cart) {
      localStorage.setItem("cartId", null);
      return history.push("/cart");
    }

    setCart(data.content.cart);
    setItems(data.content.cart?.items);
    setLoading(false);
  };

  const verifyCoupon = async () => {
    try {
      setCouponError(null);
      setCouponLoading(true);
      const { data } = await HttpClient().post("/api/cart/verify-coupon", {
        code: couponCode,
      });
      setCouponLoading(false);
      setCoupon(data.content.coupon);
      cogoToast.success("Coupon applied successfully");
    } catch (error) {
      setCouponLoading(false);
      setCouponError(error.response?.data?.error);
    }
  };

  return (
    <Page>
      <Wrapper>
        <CouponContainer>
          <div
            className="header"
            onClick={() => setCouponContainerActive(!couponContainerActive)}
          >
            <i className="fa-solid fa-circle-info" />
            <span>Have a coupon? </span>
            <h3>Click here to enter your code</h3>
          </div>

          <div
            className={"coupon-code " + (couponContainerActive ? "active" : "")}
          >
            {couponError && (
              <div className="error">
                <p>{couponError}</p>
              </div>
            )}
            <article>
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                type="text"
                placeholder="Coupon code"
              />
              <PrimaryButton onClick={verifyCoupon} disabled={couponLoading}>
                {couponLoading ? "Verifying..." : "Apply"}
              </PrimaryButton>
              {coupon && (
                <PrimaryButton
                  onClick={() => {
                    setCoupon(null);
                    setCouponCode("");
                    setCouponError(null);
                  }}
                >
                  Remove Coupon
                </PrimaryButton>
              )}
            </article>
          </div>
        </CouponContainer>
        <>
          <Summary>
            <SummaryTitle>CUSTOMER DETAILS</SummaryTitle>
            <SummaryTitle>YOUR ORDER</SummaryTitle>
          </Summary>
          <Summary>
            {loading ? (
              <Skeleton height={300} width="100%" />
            ) : (
              <StripeProvider apiKey={import.meta.env.VITE_STRIPE_PUBLIC_KEY}>
                <Elements>
                  <CheckoutForm
                    discount={CartService.calculateDiscount(items, coupon)}
                    subtotal={CartService.calculateSubtotal(items)}
                    tax={CartService.calculateTax(items, coupon)}
                    total={CartService.calculateTotal(items, coupon)}
                    onSuccessfulPayment={() => {
                      window.location.href = "/cart";
                    }}
                  />
                </Elements>
              </StripeProvider>
            )}
            <div>
              <article className="items">
                {loading ? (
                  <>
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <Skeleton key={index} height={75} width="100%" />
                      ))}
                  </>
                ) : (
                  <>
                    {items.map((item) => (
                      <CartItem slim key={item.id} item={item} />
                    ))}
                  </>
                )}
              </article>
              <SummaryTitle>TOTALS</SummaryTitle>
              <article className="summary">
                {loading ? (
                  <>
                    <Skeleton height={20} width="100%" />
                    <Skeleton height={20} width="100%" />
                    <Skeleton height={20} width="100%" />
                    <Skeleton height={50} width="100%" />
                  </>
                ) : (
                  <>
                    <div className="subtotal">
                      <span>Subtotal: </span>
                      <span>
                        ${CartService.calculateSubtotal(items)?.toFixed(2)}
                      </span>
                    </div>
                    {coupon && (
                      <div className="coupon">
                        <span>Coupon: </span>
                        <span>
                          -$
                          {CartService.calculateDiscount(
                            items,
                            coupon
                          )?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="tax">
                      <span>Tax: </span>
                      <span>
                        ${CartService.calculateTax(items, coupon)?.toFixed(2)}
                      </span>
                    </div>

                    <div className="total">
                      <span>Total: </span>
                      <span>
                        ${CartService.calculateTotal(items, coupon)?.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </article>
            </div>
          </Summary>
        </>
      </Wrapper>
    </Page>
  );
}
