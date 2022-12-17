import React from "react";
import Page from "../components/Page";
import HttpClient from "../services/HttpClient";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import PrimaryButton from "../components/UI/PrimaryButton";
import cogoToast from "cogo-toast";
import { useHistory } from "react-router-dom";
import CartService from "../services/CartService";
import CartItem, {
  CartItemFooter,
  CartItemHeader,
} from "../components/products/CartItem";
import { Container } from "../components/Container";
import { Wrapper } from "../components/Wrapper";

const CartEmpty = styled.div`
  text-align: center;
  font-size: 30px;
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #efefef;
  margin-top: 1rem;
  margin-bottom: 1rem;

  .total {
    font-size: 40px;
    font-weight: bold;
    text-align: right;
  }
`;

const TAX = 25;

export default function Cart() {
  const history = useHistory();
  const [cart, setCart] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [outOfStockItemIds, setOutOfStockItemIds] = React.useState([]);
  const [outOfStockItemNames, setOutOfStockItemNames] = React.useState([]);

  React.useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    setLoading(true);
    const cartId = localStorage.getItem("cartId");
    const { data } = await HttpClient().get(`/api/cart/${cartId}`);

    if (!data.content.cart) {
      setLoading(false);
      localStorage.setItem("cartId", null);
      return;
    }

    setCart(data.content.cart);
    setItems(data.content.cart?.items);
    setOutOfStockItemIds(data.content.stock.ids);
    setOutOfStockItemNames(data.content.stock.names);
    setLoading(false);
  };

  const isCartEmpty = () => {
    return items.length === 0;
  };

  const updateCart = async () => {
    try {
      setError(null);
      setLoadingUpdate(true);
      const { data } = await HttpClient().put(`/api/cart/${cart.id}`, {
        items,
      });
      setItems(data.content.items);
      setOutOfStockItemIds(data.content.stock.ids);
      setOutOfStockItemNames(data.content.stock.names);
      setLoadingUpdate(false);
      cogoToast.success("Cart updated");
    } catch (e) {
      console.log(e);
      setError(e?.response?.data?.error);
      setLoadingUpdate(false);
    }
  };

  return (
    <Page>
      <Wrapper>
        {loading && (
          <>
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={250} width={"100%"} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Skeleton height={50} width={200} />
              <Skeleton height={50} width={200} />
            </div>
          </>
        )}
        {!isCartEmpty() ? (
          <>
            {!isCartEmpty() && (
              <div>
                {error && (
                  <div style={{ color: "red", marginBottom: "1rem" }}>
                    {error}
                  </div>
                )}
                {outOfStockItemIds.length > 0 && (
                  <div style={{ color: "red", marginBottom: "1rem" }}>
                    Following products are out of stock:{" "}
                    {outOfStockItemNames.join(", ")}
                  </div>
                )}
                <CartItemHeader>
                  <div></div>
                  <div>Product</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div>Total</div>
                  <div></div>
                </CartItemHeader>
                {items?.map((item, index) => (
                  <CartItem
                    key={item.id}
                    outOfStockItems={outOfStockItemIds}
                    item={item}
                    onItemChange={(item) => {
                      const newItems = [...items];
                      newItems[index] = item;
                      setItems(newItems);
                    }}
                    onCartChange={({ items, stock }) => {
                      setItems(items);
                      setOutOfStockItemIds(stock.ids);
                      setOutOfStockItemNames(stock.names);
                    }}
                  />
                ))}
                <CartItemFooter>
                  <div>
                    <PrimaryButton
                      disabled={loadingUpdate}
                      onClick={updateCart}
                    >
                      {loadingUpdate && (
                        <i className="fas fa-spinner fa-spin"></i>
                      )}
                      Update Cart
                    </PrimaryButton>
                  </div>
                </CartItemFooter>

                <div
                  style={{ display: "flex", justifyContent: "flex-end" }}
                ></div>

                <Summary>
                  <span className="subtotal">
                    Subtotal: ${CartService.calculateSubtotal(items).toFixed(2)}
                  </span>
                  <span className="tax">
                    Tax ({TAX}%): ${CartService.calculateTax(items).toFixed(2)}
                  </span>
                  <span className="total">
                    Total: ${CartService.calculateTotal(items).toFixed(2)}
                  </span>
                  <PrimaryButton
                    disabled={!!outOfStockItemIds.length}
                    onClick={() => history.push("/payment")}
                  >
                    To Payment
                  </PrimaryButton>
                </Summary>
              </div>
            )}
          </>
        ) : (
          !loading && <CartEmpty>Your cart is empty</CartEmpty>
        )}
      </Wrapper>
    </Page>
  );
}
