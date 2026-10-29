const FOOD_ORDERS_KEY = 'grandvista_food_orders';

const getOrders = () => {
  const rawOrders = localStorage.getItem(FOOD_ORDERS_KEY);

  if (!rawOrders) return [];

  const orders = JSON.parse(rawOrders);
  if (!Array.isArray(orders)) {
    throw new Error('Saved food orders are not in the expected format.');
  }

  return orders;
};

const saveOrders = (orders) => {
  localStorage.setItem(FOOD_ORDERS_KEY, JSON.stringify(orders));
};

const placeOrder = (order) => {
  const orders = getOrders();
  const savedOrder = {
    ...order,
    id: `FOOD-${Date.now()}`,
    status: 'NEW',
    createdAt: new Date().toISOString(),
  };

  saveOrders([savedOrder, ...orders]);
  return savedOrder;
};

const updateOrderStatus = (orderId, status) => {
  const orders = getOrders();
  const orderExists = orders.some((order) => order.id === orderId);

  if (!orderExists) {
    throw new Error('Food order could not be found.');
  }

  const updatedOrders = orders.map((order) => (
    order.id === orderId ? { ...order, status } : order
  ));
  saveOrders(updatedOrders);
  return updatedOrders;
};

export const foodOrderService = {
  getOrders,
  placeOrder,
  updateOrderStatus,
};
