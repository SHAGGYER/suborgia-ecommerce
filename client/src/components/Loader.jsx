import React from "react";

export default function Loader({ loading }) {
  return (
    <i
      className="fa-solid fa-spinner fa-spin"
      style={{ fontSize: 40, marginBottom: "1rem" }}
    />
  );
}
