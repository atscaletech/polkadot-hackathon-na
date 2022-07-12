export function formatOrderId(orderId) {
  const zero = 6 - orderId.toString().length + 1;
  return '#' + Array(+(zero > 0 && zero)).join('0') + orderId;
}
