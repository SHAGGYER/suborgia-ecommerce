import HttpClient from "../services/HttpClient";

export const useCart = () => {
  const addToCart = async ({ name, quantity, type, price, id }) => {
    const body = {
      product: {
        name,
        quantity,
        type,
        price,
        id,
      },
      updateType: "add-item",
    };

    await HttpClient().post("/api/billing/update-cart", body);
  };

  return {
    addToCart,
  };
};
