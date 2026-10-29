import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { foodOrderService } from '../services/foodOrderService';

const managerItems = [
  { to: '/manager/dashboard', label: 'Overview' },
  { to: '/manager/rooms', label: 'Manage Rooms' },
  { to: '/manager/availability', label: 'Availability' },
  { to: '/manager/pricing', label: 'Pricing' },
  { to: '/manager/bookings', label: 'Bookings' },
  { to: '/manager/food-orders', label: 'Food Orders' },
  { to: '/manager/feedback', label: 'Feedback' },
  { to: '/manager/revenue', label: 'Revenue' },
  { to: '/manager/alerts', label: 'Alerts' },
];

const orderStatuses = ['NEW', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const readOrders = () => {
  try {
    return { orders: foodOrderService.getOrders(), error: '' };
  } catch (loadError) {
    return { orders: [], error: loadError.message || 'Food orders could not be loaded.' };
  }
};

const ManagerFoodOrdersPage = () => {
  const [orderState, setOrderState] = useState(readOrders);
  const { orders, error } = orderState;

  const handleStatusChange = (orderId, status) => {
    try {
      setOrderState({ orders: foodOrderService.updateOrderStatus(orderId, status), error: '' });
    } catch (updateError) {
      setOrderState((current) => ({ ...current, error: updateError.message || 'Order status could not be updated.' }));
    }
  };

  return (
    <div className="dashboard-shell">
      <Sidebar items={managerItems} />
      <div className="page-shell">
        <div className="food-manager-header">
          <div>
            <span className="eyebrow eyebrow-dark">Room service</span>
            <h1>Food orders</h1>
            <p>Review incoming orders, guest customizations, and delivery status.</p>
          </div>
          <button type="button" className="btn btn-outline" onClick={() => setOrderState(readOrders())}>Refresh orders</button>
        </div>

        {error ? <div className="food-alert food-alert-error" role="alert">{error}</div> : null}
        {orders.length ? (
          <div className="food-manager-orders">
            {orders.map((order) => (
              <article className="card food-manager-order" key={order.id}>
                <div className="food-manager-order-top">
                  <div>
                    <span className="food-order-id">{order.id}</span>
                    <h2>{order.customerName || 'Guest'} <span>· Room {order.roomNumber}</span></h2>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <label className="food-status-field">
                    Order status
                    <select value={order.status} onChange={(event) => handleStatusChange(order.id, event.target.value)}>
                      {orderStatuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
                    </select>
                  </label>
                </div>
                <div className="food-manager-items">
                  {order.items.map((item) => (
                    <div className="food-manager-item" key={item.id}>
                      <div>
                        <strong>{item.quantity} × {item.name}</strong>
                        <span>{item.spiceLevel} spice{item.specialInstructions ? ` · ${item.specialInstructions}` : ''}</span>
                      </div>
                      <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                    </div>
                  ))}
                </div>
                <div className="food-manager-total"><span>Order total</span><strong>₹{Number(order.total).toLocaleString('en-IN')}</strong></div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card empty-state food-no-orders">
            <span aria-hidden="true">🍽️</span>
            <h2>No food orders yet</h2>
            <p>New room-service orders will show up here as soon as a guest places one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerFoodOrdersPage;
