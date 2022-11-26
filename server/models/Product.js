const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    shopId: mongoose.Types.ObjectId,
    title: String,
    buyPrice: Number,
    sellPrice: Number,
    quantity: Number,
    sku: String,
    type: String,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema, "products");
module.exports = Product;
