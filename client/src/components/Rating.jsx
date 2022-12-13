import React from "react";
import styled from "styled-components";

const Icon = styled.i`
  font-size: 24px;
`;

export default function Rating({ rating }) {
  const ratings = [];

  for (let i = 0; i < rating; i++) {
    ratings.push({
      color: "var(--primary)",
    });
  }

  if (ratings.length < 5) {
    const diff = 5 - ratings.length;
    for (let i = 0; i < diff; i++) {
      ratings.push({
        color: "#ccc",
      });
    }
  }

  return (
    <div>
      {ratings.map((r, index) => (
        <Icon
          className="fa-solid fa-star"
          key={index}
          style={{ color: r.color }}
        ></Icon>
      ))}
    </div>
  );
}
