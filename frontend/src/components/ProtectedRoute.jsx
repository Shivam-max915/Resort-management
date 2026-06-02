import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../services/store';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, token, isInitialized } = useAuthStore();

  // CRITICAL: Wait for auth initialization to complete
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // CRITICAL: If not authenticated, deny immediately
  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" replace />;
  }

  // CRITICAL: Verify user object has valid role
  if (!user.role || typeof user.role !== 'string') {
    console.error('Invalid user object - missing valid role');
    return <Navigate to="/login" replace />;
  }

  // CRITICAL: Check role matches required role
  if (requiredRole && user.role !== requiredRole) {
    console.error('Role mismatch:', user.role, 'required:', requiredRole);
    // Redirect to appropriate dashboard based on actual role
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  // CRITICAL: Validate token structure
  if (typeof token !== 'string' || token.length === 0) {
    console.error('Invalid token structure');
    return <Navigate to="/login" replace />;
  }

  // All validations passed - allow access
  return children;
};

export default ProtectedRoute;
