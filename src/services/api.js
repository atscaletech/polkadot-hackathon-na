import products from "./fixtures/products.json";
import orders from "./fixtures/orders.json";

// const wait = (time) => new Promise((resolve) => {
//   setTimeout(resolve, time);
// });

export async function getProducts() {
  return products;
}

export async function getProduct(productId) {
  return products.find(product => product.id === Number.parseInt(productId));
}

export async function getOrders() {
  return orders;
}