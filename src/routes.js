import Home from './pages/Home';

import ShopProducts from './pages/customer/Products';
import ShopCheckout from './pages/customer/Checkout';
import CheckoutSuccess from './pages/customer/CheckoutSuccess';

import MerchantOrders from './pages/merchants/Orders';

export default [
  {
    path: '/',
    name: 'Home',
    element: Home,
    exact: true,
  },
  {
    path: '/shop',
    name: 'ShopProducts',
    element: ShopProducts,
    exact: true,
  },
  {
    path: '/shop/checkout',
    name: 'ShopCheckout',
    element: ShopCheckout,
    exact: true,
  },
  {
    path: '/shop/checkout/success',
    name: 'CheckoutSuccess',
    element: CheckoutSuccess,
    exact: true,
  },
  {
    path: '/merchant/orders',
    name: 'MerchantOrders',
    element: MerchantOrders,
    exact: true,
  }
]