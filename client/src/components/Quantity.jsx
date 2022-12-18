import React from "react";
import styled from "styled-components";

const QuantityStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  h3 {
    font-size: 16px !important;
    margin-bottom: 0.5rem;
  }

  .controls {
    display: flex;

    > article,
    > input {
      border: 1px solid #ccc;
      padding: 0.25rem 1rem;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 20px;
      user-select: none;
    }

    .left {
      border-right: none;
      cursor: pointer;
    }

    .right {
      border-left: none;
      cursor: pointer;
    }

    > input {
      width: 100px;
    }
  }
`;

export default function Quantity({ onChange }) {
  const [quantity, setQuantity] = React.useState(1);

  const handleQuantityChange = (value) => {
    setQuantity(value);
    onChange(value);
  };

  return (
    <QuantityStyled>
      <h3>Quantity</h3>
      <div className="controls">
        <article
          className="left"
          onClick={() =>
            handleQuantityChange(quantity - 1 >= 1 ? quantity - 1 : 1)
          }
        >
          -
        </article>
        <input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(e)}
        />
        <article
          className="right"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          +
        </article>
      </div>
    </QuantityStyled>
  );
}
