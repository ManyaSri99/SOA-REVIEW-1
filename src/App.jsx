import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchRoomsPage from './pages/SearchRoomsPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import ProfilePage from './pages/ProfilePage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import ManageRoomsPage from './pages/ManageRoomsPage';
import AddRoomPage from './pages/AddRoomPage';
import EditRoomPage from './pages/EditRoomPage';
import RoomAvailabilityPage from './pages/RoomAvailabilityPage';
import PricingDashboardPage from './pages/PricingDashboardPage';
import BookingManagementPage from './pages/BookingManagementPage';
import RevenueDashboardPage from './pages/RevenueDashboardPage';
import AlertsPage from './pages/AlertsPage';
import FeedbackPage from './pages/FeedbackPage';
import FoodOrderPage from './pages/FoodOrderPage';
import ManagerFoodOrdersPage from './pages/ManagerFoodOrdersPage';
import ManagerFeedbackPage from './pages/ManagerFeedbackPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import SystemMonitoringPage from './pages/SystemMonitoringPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchRoomsPage />} />
            <Route path="/rooms/:id" element={<RoomDetailsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
            <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyBookingsPage /></ProtectedRoute>} />
            <Route path="/bookings/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><BookingDetailsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ProfilePage /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><FeedbackPage /></ProtectedRoute>} />
            <Route path="/food" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><FoodOrderPage /></ProtectedRoute>} />

            <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><ManagerDashboardPage /></ProtectedRoute>} />
            <Route path="/manager/food-orders" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><ManagerFoodOrdersPage /></ProtectedRoute>} />
            <Route path="/manager/rooms" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><ManageRoomsPage /></ProtectedRoute>} />
            <Route path="/manager/rooms/add" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><AddRoomPage /></ProtectedRoute>} />
            <Route path="/manager/rooms/:id/edit" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><EditRoomPage /></ProtectedRoute>} />
            <Route path="/manager/availability" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><RoomAvailabilityPage /></ProtectedRoute>} />
            <Route path="/manager/pricing" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><PricingDashboardPage /></ProtectedRoute>} />
            <Route path="/manager/bookings" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><BookingManagementPage /></ProtectedRoute>} />
            <Route path="/manager/feedback" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><ManagerFeedbackPage /></ProtectedRoute>} />
            <Route path="/manager/revenue" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><RevenueDashboardPage /></ProtectedRoute>} />
            <Route path="/manager/alerts" element={<ProtectedRoute allowedRoles={['HOTEL_MANAGER']}><AlertsPage /></ProtectedRoute>} />

            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagementPage /></ProtectedRoute>} />
            <Route path="/admin/monitoring" element={<ProtectedRoute allowedRoles={['ADMIN']}><SystemMonitoringPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
