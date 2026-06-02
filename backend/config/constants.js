// User Roles
export const ROLES = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin'
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  CANCELLED: 'cancelled'
};

// Room Status
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  MAINTENANCE: 'maintenance',
  OCCUPIED: 'occupied'
};

// Room Types
export const ROOM_TYPES = {
  SINGLE: 'single',
  DOUBLE: 'double',
  SUITE: 'suite',
  DELUXE: 'deluxe'
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  ROOM_NOT_FOUND: 'Room not found',
  BOOKING_NOT_FOUND: 'Booking not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error'
};
