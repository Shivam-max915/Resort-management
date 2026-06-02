import User from '../models/User.js';
import { AppError, catchAsyncErrors } from '../utils/errorHandler.js';

// Get All Users (Admin)
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const { role, search } = req.query;

  const filter = {};
  if (role) filter.role = role;

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users
  });
});

// Get User by ID (Admin)
export const getUserById = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('assignedRooms', 'roomNumber type floor')
    .select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

// Update User (Admin)
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, role, isActive, department, position } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if new email already exists
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 409));
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      role: role || undefined,
      isActive: isActive !== undefined ? isActive : undefined,
      department: department || undefined,
      position: position || undefined
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user: updatedUser
  });
});

// Delete User (Admin)
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  await User.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Deactivate User (Admin)
export const deactivateUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully',
    user
  });
});

// Activate User (Admin)
export const activateUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User activated successfully',
    user
  });
});

// Get Staff Members (Admin)
export const getStaffMembers = catchAsyncErrors(async (req, res, next) => {
  const staff = await User.find({ role: { $in: ['staff', 'admin'] } })
    .populate('assignedRooms', 'roomNumber type floor')
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: staff.length,
    staff
  });
});

// Create Staff (Admin)
export const createStaff = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, department, position } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !department || !position) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  const staff = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone: phone || null,
    role: 'staff',
    department,
    position
  });

  res.status(201).json({
    success: true,
    message: 'Staff member created successfully',
    staff: {
      id: staff._id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      role: staff.role,
      department: staff.department,
      position: staff.position
    }
  });
});
