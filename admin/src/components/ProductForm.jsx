import React, { useEffect, useState } from "react";
import HttpClient from "../services/HttpClient";
import FloatingTextField from "./FloatingTextField";
import PrimaryButton from "./UI/PrimaryButton";
import Select from "./Select";
import { useDialog } from "react-st-modal";

function ProductForm({ row, onCreated, onUpdated, shops }) {
  const dialog = useDialog();
  const [title, setTitle] = useState(row ? row.title : "");
  const [buyPrice, setBuyPrice] = useState(row ? row.buyPrice : "");
  const [sellPrice, setSellPrice] = useState(row ? row.sellPrice : "");
  const [quantity, setQuantity] = useState(row ? row.quantity : "");
  const [sku, setSku] = useState(row ? row.sku : "");
  const [error, setError] = useState({});
  const [selectedShop, setSelectedShop] = useState(shops[0]?._id);

  useEffect(() => {
    if (!sku) {
      generateRandomSku();
    }
  }, [sku]);

  const onSubmit = async () => {
    setError({});
    try {
      const body = {
        title,
        buyPrice: parseFloat(buyPrice),
        sellPrice: parseFloat(sellPrice),
        quantity,
        sku,
        shopId: selectedShop,
      };

      if (!row) {
        await HttpClient().post("/api/products", body);
        dialog.close(true);
      } else {
        await HttpClient().put(`/api/products/${row._id}`, body);
        dialog.close(true);
      }
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
      }
    }
  };

  const generateRandomSku = async () => {
    const { data } = await HttpClient().get("/api/products/random-sku");
    setSku(data.content);
  };

  return (
    <div
      className="relative p-4 flex flex-col gap-4 items-start"
      style={{
        position: "relative",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "start",
      }}
    >
      <h3>{row ? "Update" : "Create"} Product</h3>

      <Select
        error={error.shopId}
        label="Butik"
        value={selectedShop}
        onChange={(e) => setSelectedShop(e.target.value)}
      >
        <option value="">Vælg én</option>
        {shops.map((shop) => (
          <option key={shop._id} value={shop._id}>
            {shop.name}
          </option>
        ))}
      </Select>

      <FloatingTextField
        error={error.title}
        label="Title"
        value={title}
        width="100%"
        onChange={(e) => setTitle(e.target.value)}
      />
      <div
        className="flex gap-4 items-end w-full"
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          width: "100%",
        }}
      >
        <PrimaryButton onClick={generateRandomSku}>Generate</PrimaryButton>
        <FloatingTextField
          error={error.sku}
          label="SKU"
          value={sku}
          width="100%"
          onChange={(e) => setSku(e.target.value)}
        />
      </div>
      <FloatingTextField
        error={error.buy_price}
        width="100%"
        label="Buy Price"
        value={buyPrice}
        onChange={(e) => setBuyPrice(e.target.value)}
      />
      <FloatingTextField
        error={error.sell_price}
        label="Sell Price"
        width="100%"
        value={sellPrice}
        onChange={(e) => setSellPrice(e.target.value)}
      />
      <FloatingTextField
        width="100%"
        error={error.quantity}
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <PrimaryButton onClick={onSubmit}>Save</PrimaryButton>
    </div>
  );
}

export default ProductForm;
