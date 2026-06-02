import jwt from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Decode JWT Token without verification
export const decodeToken = (token) => {
  return jwt.decode(token);
};
