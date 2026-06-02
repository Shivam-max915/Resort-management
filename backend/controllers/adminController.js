import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { AppError, catchAsyncErrors } from '../utils/errorHandler.js';

// Get Dashboard Stats (Admin)
export const getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  // Total counts
  const totalRooms = await Room.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const totalStaff = await User.countDocuments({ role: { $in: ['staff', 'admin'] } });

  // Booking statistics
  const bookingsByStatus = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
  const completedBookings = await Booking.countDocuments({ status: 'checked_out' });

  // Room statistics
  const roomsByStatus = await Room.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const roomsByType = await Room.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]);

  // Revenue statistics
  const totalRevenue = await Booking.aggregate([
    { $match: { status: { $in: ['confirmed', 'checked_in', 'checked_out'] } } },
    { $group: { _id: null, totalRevenue: { $sum: '$finalPrice' } } }
  ]);

  // Recent bookings
  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('customerId', 'firstName lastName email');

  // Average rating
  const avgRating = await Review.aggregate([
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);

  // Occupancy rate
  const occupiedRooms = await Room.countDocuments({ status: { $in: ['booked', 'occupied'] } });
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

  res.status(200).json({
    success: true,
    stats: {
      totalRooms,
      totalUsers,
      totalBookings,
      totalStaff,
      confirmedBookings,
      completedBookings,
      occupancyRate: occupancyRate.toFixed(2),
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      avgRating: avgRating[0]?.avgRating?.toFixed(2) || 0
    },
    bookingsByStatus,
    roomsByStatus,
    roomsByType,
    recentBookings
  });
});

// Get Revenue Report
export const getRevenueReport = catchAsyncErrors(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const filter = { status: { $in: ['confirmed', 'checked_in', 'checked_out'] } };

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const revenue = await Booking.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalRevenue: { $sum: '$finalPrice' },
        bookingCount: { $sum: 1 },
        avgRevenue: { $avg: '$finalPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const totalRevenue = await Booking.aggregate([
    { $match: filter },
    { $group: { _id: null, total: { $sum: '$finalPrice' } } }
  ]);

  res.status(200).json({
    success: true,
    totalRevenue: totalRevenue[0]?.total || 0,
    revenue
  });
});

// Get Occupancy Report
export const getOccupancyReport = catchAsyncErrors(async (req, res, next) => {
  const rooms = await Room.aggregate([
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'roomId',
        as: 'bookings'
      }
    },
    {
      $project: {
        roomNumber: 1,
        type: 1,
        status: 1,
        basePrice: 1,
        bookingCount: { $size: '$bookings' }
      }
    },
    { $sort: { roomNumber: 1 } }
  ]);

  res.status(200).json({
    success: true,
    count: rooms.length,
    rooms
  });
});
