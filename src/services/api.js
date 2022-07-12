import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.jsonbin.io/v3',
  timeout: 10000,
  headers: {'X-Master-key': '$2b$10$k4Tc.Fic9vKeoML8EB02Y.q1b/vPrOXzvJWULkB8.BlpV89nZ1NDC'}
});

export async function getProducts() {
  const response = await instance.get('/b/62cd4def5ecb581b56b70a69');

  return response.data.record.products;
}

export async function getProduct(productId) {
  const products = await getProducts();
  return products.find(product => product.id === Number.parseInt(productId));
}

export async function getOrders(merchantAddress) {
  const response = await instance.get('/b/62cd4ed8b34ef41b73ba2d2f');
  return response.data.record.orders.filter(item => item.merchant === merchantAddress);
}

export async function createOrder(merchantAddress, order) {
  const response = await instance.get('/b/62cd4ed8b34ef41b73ba2d2f');
  const record = response.data.record;
  record.orders.push({
    id: record.orders.length,
    merchant: merchantAddress,
    customer: {
      name: "Andrew",
    },
    ...order,
  });

  return instance.put('/b/62cd4ed8b34ef41b73ba2d2f', record);
}

export async function updateOrder(orderId, data) {
  const response = await instance.get('/b/62cd4ed8b34ef41b73ba2d2f');
  const record = response.data.record;
  record.orders[orderId] = {
    ...record.orders[orderId],
    ...data,
  };

  return instance.put('/b/62cd4ed8b34ef41b73ba2d2f', record);
}
