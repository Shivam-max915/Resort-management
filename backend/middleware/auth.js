import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/errorHandler.js';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new AppError('No token provided. Please login.', 401));
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return next(new AppError('User not found or inactive.', 401));
    }

    // Attach user to request
    req.user = user;
    req.userId = decoded.id;

    next();
  } catch (error) {
    return next(new AppError(error.message, 401));
  }
};

// Authorize by role
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Not authorized to access this route', 403));
    }

    next();
  };
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can access this resource', 403));
  }
  next();
};

// Check if user is staff
export const isStaff = (req, res, next) => {
  if (req.user.role !== 'staff' && req.user.role !== 'admin') {
    return next(new AppError('Only staff can access this resource', 403));
  }
  next();
};

// Check if user is customer
export const isCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return next(new AppError('Only customers can access this resource', 403));
  }
  next();
};
