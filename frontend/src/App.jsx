import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './services/store';

// Layouts
import Navbar from './layouts/Navbar';
import AdminLayout from './layouts/AdminLayout';
import StaffLayout from './layouts/StaffLayout';

// Public Pages
import Landing from './pages/Landing';
import RoomsPage from './pages/RoomsPage';
import RoomDetails from './pages/RoomDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ContactPage from './pages/ContactPage';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import MyBookings from './pages/customer/MyBookings';
import BookingDetails from './pages/customer/BookingDetails';
import BookingHistory from './pages/customer/BookingHistory';
import MyReviews from './pages/customer/MyReviews';

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard';
import StaffBookings from './pages/staff/Bookings';
import ServiceRequests from './pages/staff/ServiceRequests';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import RoomManagement from './pages/admin/RoomManagement';
import UserManagement from './pages/admin/UserManagement';
import BookingManagement from './pages/admin/BookingManagement';
import Billing from './pages/admin/Billing';
import ReportsPage from './pages/admin/Reports';
import ContactMessages from './pages/admin/ContactMessages';
import ReviewManagement from './pages/admin/ReviewManagement';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

import './index.css';

// CRITICAL: Loading component while auth initializes
const AuthLoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary to-dark flex items-center justify-center">
    <div className="text-white text-center">
      <div className="mb-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
      </div>
      <p>Verifying session...</p>
    </div>
  </div>
);

function App() {
  const { initializeAuth, isInitialized } = useAuthStore();
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  // CRITICAL: Initialize auth on app load - validates JWT with backend
  // This runs ONCE on mount
  useEffect(() => {
    const initAuth = async () => {
      await initializeAuth();
      setIsAuthCheckComplete(true);
    };
    initAuth();
  }, []); // Empty dependency array - run only once on mount

  // CRITICAL: Don't render routes until auth initialization is complete
  if (!isAuthCheckComplete) {
    return <AuthLoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-light">
        <Routes>
          {/* Public Routes - Root must ALWAYS show landing page */}
          <Route element={<Navbar />}>
            <Route path="/" element={<Landing />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes - STRICT role isolation */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/bookings"
              element={
                <ProtectedRoute requiredRole="customer">
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/bookings/:id"
              element={
                <ProtectedRoute requiredRole="customer">
                  <BookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/history"
              element={
                <ProtectedRoute requiredRole="customer">
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/reviews"
              element={
                <ProtectedRoute requiredRole="customer">
                  <MyReviews />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Staff Routes - STRICT role isolation */}
          <Route
            element={
              <ProtectedRoute requiredRole="staff">
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/bookings" element={<StaffBookings />} />
            <Route path="/staff/service-requests" element={<ServiceRequests />} />
          </Route>

          {/* Admin Routes - STRICT role isolation */}
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<RoomManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/bookings" element={<BookingManagement />} />
            <Route path="/admin/billing" element={<Billing />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/messages" element={<ContactMessages />} />
            <Route path="/admin/reviews" element={<ReviewManagement />} />
          </Route>

          {/* Catch All - Redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
