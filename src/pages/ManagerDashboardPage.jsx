import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DemandAlert from '../components/DemandAlert';
import Sidebar from '../components/Sidebar';
import { roomService } from '../services/roomService';

const managerItems = [
  { to: '/manager/dashboard', label: 'Overview' },
  { to: '/manager/rooms', label: 'Manage Rooms' },
  { to: '/manager/availability', label: 'Availability' },
  { to: '/manager/pricing', label: 'Pricing' },
  { to: '/manager/bookings', label: 'Bookings' },
  { to: '/manager/food-orders', label: 'Food Orders' },
  { to: '/manager/revenue', label: 'Revenue' },
  { to: '/manager/alerts', label: 'Alerts' },
];

const ManagerDashboardPage = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [customerFeedback, setCustomerFeedback] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const roomData = roomService.readStoredRooms ? roomService.readStoredRooms() : (await roomService.getRooms());
      const storedBookings = (() => {
        try {
          return JSON.parse(localStorage.getItem('grandvista_bookings') || '[]');
        } catch {
          return [];
        }
      })();
      const storedNotifications = (() => {
        try {
          return JSON.parse(localStorage.getItem('grandvista_notifications') || '[]');
        } catch {
          return [];
        }
      })();
      const storedFeedback = (() => {
        try {
          return JSON.parse(localStorage.getItem('grandvista_customer_feedback') || '[]');
        } catch {
          return [];
        }
      })();

      setRooms(Array.isArray(roomData) ? roomData : []);
      setBookings(Array.isArray(storedBookings) ? storedBookings : []);
      setNotifications(Array.isArray(storedNotifications) ? storedNotifications : []);
      setCustomerFeedback(Array.isArray(storedFeedback) ? storedFeedback : []);
    };

    loadData();
  }, []);

  const availableRoomCount = rooms.filter((room) => (room.status || '').toLowerCase() === 'available').length;
  const bookedRoomCount = rooms.filter((room) => (room.status || '').toLowerCase() === 'booked').length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.totalAmount || booking.price || 0), 0);

  return (
    <div className="dashboard-shell">
      <Sidebar items={managerItems} />
      <div className="page-shell">
        <div className="stats-grid">
          <StatCard title="Total Rooms" value={String(rooms.length || 0)} tone="primary" />
          <StatCard title="Available Rooms" value={String(availableRoomCount)} tone="success" />
          <StatCard title="Booked Rooms" value={String(bookedRoomCount)} tone="warning" />
          <StatCard title="Today's Bookings" value={String(bookings.length || 0)} tone="primary" />
          <StatCard title="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} tone="success" />
          <StatCard title="Notifications" value={String(notifications.length || 0)} tone="warning" />
        </div>

        <div className="card" style={{ padding: '22px', marginBottom: '20px' }}>
          <div className="section-header">
            <h3>Room status</h3>
          </div>
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="card" style={{ padding: '16px' }}>
                <img src={room.image} alt={room.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
                <h4 style={{ marginTop: '12px' }}>{room.name}</h4>
                <p>{room.hotelName || 'GrandVista Hotel'} · {room.city}</p>
                <p>Status: <strong>{(room.status || 'available').toUpperCase()}</strong></p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div className="section-header">
            <h3>Recent bookings</h3>
            <Link to="/manager/bookings">View all</Link>
          </div>
          {bookings.length ? bookings.map((booking) => (
            <div key={booking.id} style={{ borderBottom: '1px solid #e5e7eb', padding: '10px 0' }}>
              <strong>{booking.customerName}</strong> booked {booking.roomType} at {booking.hotelName} ({booking.city}) for {booking.durationHours || 4} hours. Payment: {booking.paymentMethod || 'UPI'}.
            </div>
          )) : <p>No bookings yet.</p>}
          {notifications.length ? notifications.map((notification) => (
            <div key={notification.id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', marginTop: '12px' }}>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
            </div>
          )) : null}
        </div>

        <div className="card" style={{ padding: '22px', marginTop: '20px' }}>
          <div className="section-header">
            <h3>Customer feedback</h3>
          </div>
          {customerFeedback.length ? customerFeedback.map((feedback) => (
            <div key={feedback.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <strong>{feedback.customerName}</strong>
                <span style={{ color: '#475569', fontSize: '0.85rem' }}>{new Date(feedback.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px', color: '#334155' }}>
                <span>Overall: {feedback.overallExperience}/5</span>
                <span>Room service: {feedback.roomService}/5</span>
                <span>Cleanliness: {feedback.cleanliness}/5</span>
                <span>Support: {feedback.staffSupport}/5</span>
              </div>
              <p style={{ marginTop: '10px', marginBottom: 0, color: '#0f172a' }}>{feedback.comments || 'No additional comments provided.'}</p>
            </div>
          )) : <p>No customer feedback submitted yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
