import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import { AppError, catchAsyncErrors } from '../utils/errorHandler.js';
import { isValidDateRange } from '../utils/validators.js';

// Helper function to determine if a booking should be checked in
const updateBookingCheckInStatus = async (booking) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkInDate = new Date(booking.checkInDate);
  checkInDate.setHours(0, 0, 0, 0);
  
  const checkOutDate = new Date(booking.checkOutDate);
  checkOutDate.setHours(0, 0, 0, 0);

  // Update to checked_in if within stay dates and confirmed
  if (
    booking.status === 'confirmed' &&
    today >= checkInDate &&
    today < checkOutDate
  ) {
    if (booking.status !== 'checked_in') {
      booking.status = 'checked_in';
      await booking.save();
    }
  }
  // Update to checked_out if past checkout date
  else if (today > checkOutDate && booking.status === 'checked_in') {
    booking.status = 'checked_out';
    await booking.save();
  }

  return booking;
};

// Calculate booking price
const calculatePrice = (room, checkInDate, checkOutDate, discount = 0) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  // Get room price (consider weekend pricing)
  const roomPrice = room.weekendPrice ? room.weekendPrice : room.basePrice;
  
  const totalPrice = roomPrice * numberOfNights;
  const discountAmount = (totalPrice * discount) / 100;
  const finalPrice = totalPrice - discountAmount;

  return {
    numberOfNights,
    roomPrice,
    totalPrice,
    discount: discountAmount,
    finalPrice
  };
};

// Create Booking
export const createBooking = catchAsyncErrors(async (req, res, next) => {
  const { roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;

  // Validate input
  if (!roomId || !checkInDate || !checkOutDate || !numberOfGuests) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Validate date range
  if (!isValidDateRange(checkInDate, checkOutDate)) {
    return next(new AppError('Check-out date must be after check-in date', 400));
  }

  // Get room details
  const room = await Room.findById(roomId);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  // Check room capacity
  if (numberOfGuests > room.capacity) {
    return next(new AppError(`Room capacity is ${room.capacity}, cannot book for ${numberOfGuests} guests`, 400));
  }

  // Check availability - only check confirmed and checked-in bookings, not pending
  const conflictingBooking = await Booking.findOne({
    roomId,
    status: { $in: ['confirmed', 'checked_in'] },
    checkInDate: { $lt: new Date(checkOutDate) },
    checkOutDate: { $gt: new Date(checkInDate) }
  });

  if (conflictingBooking) {
    return next(new AppError('Room is not available for selected dates', 400));
  }

  // Calculate price
  const priceDetails = calculatePrice(room, checkInDate, checkOutDate);

  // Get user details
  const user = await User.findById(req.userId);

  // Create booking
  const booking = await Booking.create({
    customerId: req.userId,
    guestName: `${user.firstName} ${user.lastName}`,
    guestEmail: user.email,
    guestPhone: user.phone || 'N/A',
    numberOfGuests,
    roomId,
    roomNumber: room.roomNumber,
    checkInDate: new Date(checkInDate),
    checkOutDate: new Date(checkOutDate),
    numberOfNights: priceDetails.numberOfNights,
    roomPrice: priceDetails.roomPrice,
    totalPrice: priceDetails.totalPrice,
    discount: priceDetails.discount,
    finalPrice: priceDetails.finalPrice,
    specialRequests: specialRequests || null,
    status: 'pending'
  });

  // Do NOT update room status yet - only update when admin confirms the booking

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking
  });
});

// Get User Bookings
export const getUserBookings = catchAsyncErrors(async (req, res, next) => {
  let bookings = await Booking.find({ customerId: req.userId })
    .populate('roomId', 'roomNumber type capacity basePrice')
    .sort({ createdAt: -1 });

  // Update check-in status for each booking
  bookings = await Promise.all(
    bookings.map(async (booking) => {
      const updatedBooking = await updateBookingCheckInStatus(booking);
      
      // Check if this booking has a review
      const review = await Review.findOne({ bookingId: booking._id });
      
      // Convert to plain object to add custom property
      const bookingObj = updatedBooking.toObject();
      bookingObj.isReviewed = !!review;
      if (review) {
        bookingObj.reviewId = review._id;
      }
      
      return bookingObj;
    })
  );

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings
  });
});

// Get Booking by ID
export const getBookingById = catchAsyncErrors(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id)
    .populate('customerId', 'firstName lastName email phone')
    .populate('roomId', 'roomNumber type capacity amenities');

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check if user owns this booking or is admin/staff
  if (booking.customerId._id.toString() !== req.userId && req.user.role !== 'admin' && req.user.role !== 'staff') {
    return next(new AppError('Not authorized to view this booking', 403));
  }

  // Update check-in status based on current date
  booking = await updateBookingCheckInStatus(booking);

  res.status(200).json({
    success: true,
    booking
  });
});

// Cancel Booking
export const cancelBooking = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check if user owns this booking
  if (booking.customerId.toString() !== req.userId && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to cancel this booking', 403));
  }

  // Check if booking can be cancelled
  if (['checked_out', 'cancelled'].includes(booking.status)) {
    return next(new AppError('This booking cannot be cancelled', 400));
  }

  // Calculate refund (80% if within 7 days, 50% otherwise)
  const daysUntilCheckIn = Math.ceil((new Date(booking.checkInDate) - new Date()) / (1000 * 60 * 60 * 24));
  const refundPercentage = daysUntilCheckIn >= 7 ? 80 : 50;
  const refundAmount = (booking.finalPrice * refundPercentage) / 100;

  // Update booking
  const cancelledBooking = await Booking.findByIdAndUpdate(
    id,
    {
      status: 'cancelled',
      cancellationDate: new Date(),
      cancellationReason: reason || 'Customer cancelled',
      refundAmount
    },
    { new: true }
  );

  // Update room status back to available
  await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    refundAmount,
    booking: cancelledBooking
  });
});

// Early Check-out (Customer)
export const earlyCheckOut = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check if booking belongs to user
  if (booking.customerId.toString() !== req.user._id.toString()) {
    return next(new AppError('Unauthorized access', 401));
  }

  // Check if booking is currently checked in
  if (booking.status !== 'checked_in') {
    return next(new AppError('Can only check out if currently checked in', 400));
  }

  // Update booking status to checked_out
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status: 'checked_out' },
    { new: true }
  );

  // Set room to maintenance status
  await Room.findByIdAndUpdate(booking.roomId, { status: 'maintenance' });

  res.status(200).json({
    success: true,
    message: 'Checked out successfully. Room is now in maintenance.',
    booking: updatedBooking
  });
});

// Update Booking Status (Admin/Staff)
export const updateBookingStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return next(new AppError('Please provide booking status', 400));
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  // Update room status accordingly
  if (status === 'confirmed') {
    // When booking is confirmed, lock the room as booked
    await Room.findByIdAndUpdate(booking.roomId, { status: 'booked' });
  } else if (status === 'checked_in') {
    await Room.findByIdAndUpdate(booking.roomId, { status: 'occupied' });
  } else if (status === 'checked_out') {
    // After checkout, room goes to maintenance for cleaning
    await Room.findByIdAndUpdate(booking.roomId, { status: 'maintenance' });
  } else if (status === 'cancelled') {
    // When booking is cancelled, release the room back to available
    await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });
  }

  res.status(200).json({
    success: true,
    message: 'Booking status updated',
    booking: updatedBooking
  });
});

// Delete Booking (Admin Only)
export const deleteBooking = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Release the room back to available status
  await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });

  // Delete the booking
  await Booking.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Booking deleted successfully'
  });
});

// Generate Bill (Admin)
export const generateBill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const booking = await Booking.findById(id).populate('customerId', 'firstName lastName email');
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check if booking is checked out or at least confirmed
  if (booking.status === 'pending' || booking.status === 'cancelled') {
    return next(new AppError('Cannot generate bill for pending or cancelled bookings', 400));
  }

  // Update billing status
  booking.billGenerated = true;
  booking.billDate = new Date();
  await booking.save();

  // Send notification to customer for feedback
  await Notification.create({
    recipient: booking.customerId._id,
    title: 'Bill Generated - Feedback Requested',
    message: `Your bill for room ${booking.roomNumber} has been generated. We hope you enjoyed your stay! Please share your feedback with us.`,
    type: 'feedback_request',
    link: `/customer/bookings/${booking._id}`
  });

  res.status(200).json({
    success: true,
    message: 'Bill generated and notification sent to customer',
    booking
  });
});

// Get All Bookings (Admin)
export const getAllBookings = catchAsyncErrors(async (req, res, next) => {
  const { status, roomId, startDate, endDate } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (roomId) filter.roomId = roomId;

  if (startDate || endDate) {
    filter.checkInDate = {};
    if (startDate) filter.checkInDate.$gte = new Date(startDate);
    if (endDate) filter.checkInDate.$lte = new Date(endDate);
  }

  let bookings = await Booking.find(filter)
    .populate('customerId', 'firstName lastName email')
    .populate('roomId', 'roomNumber type')
    .sort({ createdAt: -1 });

  // Update check-in status for each booking
  bookings = await Promise.all(
    bookings.map(booking => updateBookingCheckInStatus(booking))
  );

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings
  });
});

// Get Today's Check-ins/Check-outs (Staff)
export const getTodayCheckInOut = catchAsyncErrors(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get all bookings that might need check-in or check-out today
  // For check-ins: get all bookings with today's check-in date
  let checkIns = await Booking.find({
    checkInDate: { $gte: today, $lt: tomorrow },
    status: { $in: ['confirmed', 'checked_in', 'checked_out'] }
  }).populate('customerId', 'firstName lastName email phone');

  // For check-outs: get all bookings with today's check-out date
  let checkOuts = await Booking.find({
    checkOutDate: { $gte: today, $lt: tomorrow },
    status: { $in: ['checked_in', 'checked_out'] }
  }).populate('customerId', 'firstName lastName email phone');

  // Update check-in status for check-ins to ensure consistency
  checkIns = await Promise.all(
    checkIns.map(booking => updateBookingCheckInStatus(booking))
  );

  // Update check-out status for check-outs to ensure consistency
  checkOuts = await Promise.all(
    checkOuts.map(booking => updateBookingCheckInStatus(booking))
  );

  res.status(200).json({
    success: true,
    checkIns,
    checkOuts
  });
});
