import HttpClient from "./HttpClient";

const TAX = 25;
export default class CartService {
  static async getCart(id) {
    return HttpClient().get("/api/cart/" + id);
  }

  static getPrice(product, selectedProperties) {
    const getProductPrice = () => {
      if (!product || !selectedProperties) return 0;

      let additives = 0;
      let subtractives = 0;

      product.properties.forEach((property) => {
        const selectedValue = selectedProperties[property.id];
        const selectedField = property.fields.find(
          (field) => field.name === selectedValue
        );
        if (selectedField) {
          if (selectedField.type === "additive") {
            additives += selectedField.adjusted_price;
          } else if (selectedField.type === "subtractive") {
            subtractives += selectedField.adjusted_price;
          }
        }
      });

      return product.price + additives - subtractives;
    };

    return { price: getProductPrice() };
  }

  static async addToCart(
    productId,
    price,
    quantity,
    selectedProperties,
    stockCollectionId
  ) {
    const cartId = localStorage.getItem("cartId");

    const { data } = await HttpClient().post("/api/cart", {
      item: {
        productId: productId,
        quantity,
        price,
        properties: selectedProperties,
        stockCollectionId,
      },
      cartId,
    });

    localStorage.setItem("cartId", data.content.cartId);
  }

  static getItemTotal(item) {
    return item.quantity * item.price;
  }

  static calculateSubtotal(items) {
    let total = 0;
    items.forEach((item) => {
      total += this.getItemTotal(item);
    });
    return total;
  }

  static calculateTax(items, coupon) {
    const subtotal = this.calculateSubtotal(items);
    const discount = this.calculateDiscount(items, coupon);
    const tax = (subtotal - discount) * (TAX / 100);
    return tax;
  }

  static calculateTotal(items, coupon) {
    const subtotal = this.calculateSubtotal(items);
    const tax = this.calculateTax(items, coupon);
    const discount = this.calculateDiscount(items, coupon);
    return subtotal - discount + tax;
  }

  static calculateDiscount(items, coupon) {
    const couponPercentage = coupon ? coupon.percentage : 0;
    const subtotal = this.calculateSubtotal(items);
    const discount = subtotal * (couponPercentage / 100);
    return discount;
  }

  static async removeCartItem(item) {
    const { data } = await HttpClient().delete(
      `/api/cart/cart-items/${item.id}`
    );

    return {
      items: data.content.items,
      stock: data.content.stock,
    };
  }
}
