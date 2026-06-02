import validator from 'validator';

// Validate email
export const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Validate password (min 6 chars, at least one uppercase, one lowercase, one number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

// Validate phone number
export const isValidPhoneNumber = (phone) => {
  return validator.isMobilePhone(phone);
};

// Validate date format (YYYY-MM-DD)
export const isValidDate = (date) => {
  return validator.isISO8601(date);
};

// Check if check-out date is after check-in date
export const isValidDateRange = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return checkOutDate > checkInDate;
};

// Validate number of guests
export const isValidGuestCount = (guests, maxCapacity) => {
  return guests > 0 && guests <= maxCapacity;
};

// Sanitize input
export const sanitizeInput = (input) => {
  return validator.trim(input);
};
