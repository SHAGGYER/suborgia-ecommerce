import React from "react";
import styled from "styled-components";

const Styled = styled.div`
  border: 3px solid #efefef;
  margin-bottom: 1rem;
  padding: 1rem;

  h3 {
    margin-bottom: 1rem;
  }

  article {
    width: 100%;
    display: grid;
    gap: 0.25rem;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 0.25rem;

    input {
      width: 100%;
    }
  }
`;

export default function PriceFilter({ onApply }) {
  const [min, setMin] = React.useState("");
  const [max, setMax] = React.useState("");

  const handleOnApply = () => {
    onApply({ min, max });
  };

  return (
    <Styled>
      <h3>Price</h3>
      <article>
        <input
          type="number"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          placeholder="Min"
        />
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          placeholder="Max"
        />
      </article>
      <button onClick={handleOnApply}>Apply</button>
    </Styled>
  );
}
