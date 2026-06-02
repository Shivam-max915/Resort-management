import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { isValidEmail, isValidPassword } from '../utils/validators.js';
import { AppError, catchAsyncErrors } from '../utils/errorHandler.js';

// Register User
export const register = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Validate email
  if (!isValidEmail(email)) {
    return next(new AppError('Please provide a valid email', 400));
  }

  // Validate password
  if (!isValidPassword(password)) {
    return next(new AppError('Password must be at least 6 characters with uppercase, lowercase, and numbers', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone: phone || null,
    role: role === 'staff' || role === 'admin' ? 'customer' : 'customer' // Only customers can self-register
  });

  // Generate token
  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  });
});

// Login User
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Find user and get password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new AppError('User account is inactive', 403));
  }

  // Compare passwords
  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Generate token
  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone
    }
  });
});

// Get Current User
export const getCurrentUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

// Update User Profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, phone, address, city, state, zipCode, country, dateOfBirth } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      phone: phone || undefined,
      address: address || undefined,
      city: city || undefined,
      state: state || undefined,
      zipCode: zipCode || undefined,
      country: country || undefined,
      dateOfBirth: dateOfBirth || undefined
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user
  });
});

// Change Password
export const changePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new AppError('Please provide all password fields', 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }

  if (!isValidPassword(newPassword)) {
    return next(new AppError('New password must be at least 6 characters with uppercase, lowercase, and numbers', 400));
  }

  const user = await User.findById(req.userId).select('+password');

  // Check old password
  const isPasswordValid = await user.matchPassword(oldPassword);
  if (!isPasswordValid) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});
