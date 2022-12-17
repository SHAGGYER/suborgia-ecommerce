import React from "react";
import styled from "styled-components";
import CartService from "../../services/CartService";

export const CartItemFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  border: 1px solid #efefef;
  border-top: none;
  padding: 1rem;
`;

export const CartItemHeader = styled.div`
  display: grid;
  grid-template-columns: 150px 200px 200px 200px 1fr 50px;
  gap: 1rem;
  margin-bottom: 0.25rem;
  border: 1px solid #efefef;

  div {
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    padding: 1rem;
  }
`;

const CartItemStyled = styled.div`
  display: grid;
  grid-template-columns: 150px 200px 200px 200px 1fr 50px;
  grid-template-rows: 150px;
  gap: 1rem;
  margin-bottom: 0.25rem;
  padding: 1rem;
  border: 1px solid #efefef;
  align-items: center;

  &.out-of-stock {
    opacity: 0.5;
  }

  &.slim {
    grid-template-columns: 75px 1fr 1fr;
    grid-template-rows: 75px;
  }

  .product-name {
    h3 {
      font-size: 20px;
      margin-bottom: 1rem;
    }

    article {
      font-size: 12px;
      display: flex;
      flex-direction: column;
    }
  }

  img {
    width: 150px;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &.slim img {
    width: 75px;
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

  .total {
    &.slim {
      justify-self: end;
    }
  }
`;

export default function CartItem({
  item,
  onCartChange,
  onItemChange,
  slim,
  outOfStockItems,
}) {
  const [isLoadingRemoveItem, setIsLoadingRemoveItem] = React.useState(false);
  const [usedItem, setUsedItem] = React.useState(item);

  const handleRemove = async () => {
    if (isLoadingRemoveItem) return;

    setIsLoadingRemoveItem(true);
    const { items, stock } = await CartService.removeCartItem(item);
    onCartChange({ items, stock });
    setIsLoadingRemoveItem(false);
  };

  const updateQuantity = (value) => {
    const newItem = { ...usedItem, quantity: value };
    setUsedItem(newItem);
    onItemChange(newItem);
  };

  const isOutOfStock = () => {
    return outOfStockItems.find((x) => x === item?.product?.id);
  };

  return (
    item && (
      <CartItemStyled
        className={slim ? "slim" : isOutOfStock() ? " out-of-stock" : ""}
      >
        <img src={item?.product?.images[0]?.file_path} alt="product image" />
        <div className="product-name">
          <span>
            {slim && <span>{item?.quantity} x </span>}
            {item?.product?.name} ({item?.product?.id})
          </span>
          <article>
            {item?.properties?.map((property) => (
              <span key={property.id}>
                {property?.property?.name}: {property?.value}
              </span>
            ))}
          </article>
        </div>
        {!slim && (
          <div className="price">
            <span>${item?.price}</span>
          </div>
        )}
        {!slim && (
          <div className="quantity">
            <input
              type="number"
              value={item?.quantity}
              onChange={(e) => updateQuantity(e.target.value)}
            />
          </div>
        )}
        <div className={"total " + (slim ? "slim" : "")}>
          <span>${CartService.getItemTotal(item)?.toFixed(2)}</span>
        </div>
        {!slim && (
          <div className="remove" onClick={() => handleRemove()}>
            {isLoadingRemoveItem ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-trash"></i>
            )}
          </div>
        )}
      </CartItemStyled>
    )
  );
}
