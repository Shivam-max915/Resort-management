import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import { AppError, catchAsyncErrors } from '../utils/errorHandler.js';

// Create Review
export const createReview = catchAsyncErrors(async (req, res, next) => {
  const { bookingId, roomId, rating, comment, title } = req.body;

  // Validate required fields
  if (!bookingId || !roomId || !rating || !comment) {
    return next(new AppError('Please provide bookingId, roomId, rating and comment', 400));
  }

  // Check if booking exists and belongs to user
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  if (booking.customerId.toString() !== req.userId) {
    return next(new AppError('Not authorized to review this booking', 403));
  }

  // Check if booking is completed
  if (booking.status !== 'checked_out') {
    return next(new AppError('Can only review completed bookings', 400));
  }

  // Check if review already exists
  const existingReview = await Review.findOne({ bookingId });
  if (existingReview) {
    return next(new AppError('You have already reviewed this booking', 400));
  }

  const review = await Review.create({
    customerId: req.userId,
    bookingId,
    roomId,
    rating,
    title: title || `Review for Room ${booking.roomNumber}`,
    comment,
    isVerified: true
  });

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    review
  });
});

// Get Room Reviews
export const getRoomReviews = catchAsyncErrors(async (req, res, next) => {
  const { roomId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const reviews = await Review.find({ roomId })
    .populate('customerId', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments({ roomId });

  const avgRating = await Review.aggregate([
    { $match: { roomId: new mongoose.Types.ObjectId(roomId) } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    avgRating: avgRating[0]?.avgRating || 0,
    reviews
  });
});

// Get User Reviews
export const getUserReviews = catchAsyncErrors(async (req, res, next) => {
  const reviews = await Review.find({ customerId: req.userId })
    .populate('roomId', 'roomNumber type')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews
  });
});

// Get All Reviews (Admin)
export const getAllReviews = catchAsyncErrors(async (req, res, next) => {
  const reviews = await Review.find()
    .populate('customerId', 'firstName lastName email')
    .populate('roomId', 'roomNumber type')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews
  });
});

// Update Review
export const updateReview = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { rating, title, comment, cleanliness, comfort, service, amenities } = req.body;

  const review = await Review.findById(id);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check ownership
  if (review.customerId.toString() !== req.userId) {
    return next(new AppError('Not authorized to update this review', 403));
  }

  const updatedReview = await Review.findByIdAndUpdate(
    id,
    {
      rating: rating || undefined,
      title: title || undefined,
      comment: comment || undefined,
      cleanliness: cleanliness || undefined,
      comfort: comfort || undefined,
      service: service || undefined,
      amenities: amenities || undefined
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    review: updatedReview
  });
});

// Delete Review
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check ownership
  if (review.customerId.toString() !== req.userId && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this review', 403));
  }

  await Review.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});
