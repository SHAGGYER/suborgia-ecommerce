import React from "react";
import Page from "../components/Page";
import HttpClient from "../services/HttpClient";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import PrimaryButton from "../components/UI/PrimaryButton";

const CartEmpty = styled.div`
  text-align: center;
  font-size: 30px;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 1fr 50px;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #efefef;
  align-items: center;

  img {
    width: 100%;
  }

  .quantity {
    display: flex;
    gap: 1rem;
    align-items: center;

    input {
      padding: 1rem;
      width: 100px;
    }
  }

  .remove {
    cursor: pointer;
    border: 1px solid #efefef;
    padding: 1rem;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
    font-size: 20px;
    font-weight: bold;
    text-align: right;
  }
`;

const TAX = 25;

export default function Cart() {
  const [cart, setCart] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);
  const [loadingRemove, setLoadingRemove] = React.useState(false);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [loadingRemoveItems, setLoadingRemoveItems] = React.useState([]);

  React.useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    setLoading(true);
    const cartId = localStorage.getItem("cartId");
    const { data } = await HttpClient().get(`/api/cart/${cartId}`);
    setCart(data.content.cart);
    setItems(data.content.cart?.items);
    setLoading(false);
  };

  const updateQuantity = (index, value) => {
    const newItems = [...items];
    newItems[index].quantity = value;
    setItems(newItems);
  };

  const getItemTotal = (item) => {
    return item.quantity * item.product.price;
  };

  const removeItem = async (index) => {
    try {
      setLoadingRemoveItems((prev) => [...prev, index]);
      const { data } = await HttpClient().delete(
        `/api/cart/cart-items/${items[index].id}`
      );
      setItems(data.content.items);
      setLoadingRemoveItems((prev) => prev.filter((i) => i !== index));
    } catch (e) {
      console.log(e);
      setLoadingRemoveItems((prev) => prev.filter((i) => i !== index));
    }
  };

  const isLoadingRemoveItem = (index) => {
    return loadingRemoveItems.includes(index);
  };

  const isCartEmpty = () => {
    return items.length === 0;
  };

  const calculateSubtotal = () => {
    let total = 0;
    items.forEach((item) => {
      total += getItemTotal(item);
    });
    return total;
  };

  const updateCart = async () => {
    try {
      setLoadingUpdate(true);
      const { data } = await HttpClient().put(`/api/cart/${cart.id}`, {
        items,
      });
      setItems(data.content.items);
      setLoadingUpdate(false);
    } catch (e) {
      console.log(e);
      setLoadingUpdate(false);
    }
  };

  const calculateTax = () => {
    return ((calculateSubtotal() * TAX) / 100).toFixed(2);
  };

  const calculateTotal = () => {
    return (calculateSubtotal() + Number(calculateTax())).toFixed(2);
  };

  return (
    <Page>
      {loading ? (
        <>
          <Skeleton height={250} width={"100%"} />
        </>
      ) : (
        <>
          {isCartEmpty() ? (
            <CartEmpty>Your cart is empty</CartEmpty>
          ) : (
            <div>
              <CartItem>
                <div></div>
                <div>Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
                <div></div>
              </CartItem>
              {items?.map((item, index) => (
                <CartItem key={item.id}>
                  <img src={item.product?.image} alt="product image" />
                  <div>
                    <h3>{item.product?.name}</h3>
                  </div>
                  <div className="price">
                    <span>${item.product?.price}</span>
                  </div>
                  <div className="quantity">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, e.target.value)}
                    />
                  </div>
                  <div className="total">
                    <span>{getItemTotal(item)}</span>
                  </div>
                  <div className="remove" onClick={() => removeItem(index)}>
                    {isLoadingRemoveItem(index) ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                  </div>
                </CartItem>
              ))}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <PrimaryButton disabled={loadingUpdate} onClick={updateCart}>
                  {loadingUpdate && <i className="fas fa-spinner fa-spin"></i>}
                  Update Cart
                </PrimaryButton>
              </div>

              <Summary>
                <span className="subtotal">
                  Subtotal: ${calculateSubtotal()}
                </span>
                <span className="tax">
                  Tax ({TAX}%): ${calculateTax()}
                </span>
                <span className="total">Total: ${calculateTotal()}</span>
                <PrimaryButton>Pay Now</PrimaryButton>
              </Summary>
            </div>
          )}
        </>
      )}
    </Page>
  );
}
