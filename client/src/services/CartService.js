import HttpClient from "./HttpClient";

export default class CartService {
  static async getCart(id) {
    return HttpClient().get("/api/cart/" + id);
  }

  static async addToCart(product, quantity) {
    const cartId = localStorage.getItem("cartId");

    const { data } = await HttpClient().post("/api/cart", {
      item: {
        productId: product.id,
        quantity,
        price: product.price,
      },
      cartId,
    });

    localStorage.setItem("cartId", data.content.cartId);
  }
}
