import mongoose from 'mongoose';
import { BOOKING_STATUS } from '../config/constants.js';

const bookingSchema = new mongoose.Schema(
  {
    // Guest Information
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required']
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required']
    },
    guestEmail: {
      type: String,
      required: [true, 'Guest email is required']
    },
    guestPhone: {
      type: String,
      required: [true, 'Guest phone is required']
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required']
    },
    
    // Room Information
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room ID is required']
    },
    roomNumber: {
      type: String,
      required: true
    },
    
    // Booking Dates
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required']
    },
    numberOfNights: {
      type: Number,
      required: true
    },
    
    // Pricing
    roomPrice: {
      type: Number,
      required: [true, 'Room price is required']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required']
    },
    discount: {
      type: Number,
      default: 0
    },
    finalPrice: {
      type: Number,
      required: [true, 'Final price is required']
    },
    
    // Status
    status: {
      type: String,
      enum: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CHECKED_IN, BOOKING_STATUS.CHECKED_OUT, BOOKING_STATUS.CANCELLED],
      default: BOOKING_STATUS.PENDING
    },
    
    // Special Requests
    specialRequests: {
      type: String,
      default: null
    },
    
    // Payment Information
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash'],
      default: null
    },
    
    // Cancellation
    cancellationDate: Date,
    cancellationReason: String,
    refundAmount: {
      type: Number,
      default: 0
    },

    // Billing
    billGenerated: {
      type: Boolean,
      default: false
    },
    billDate: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Index for better query performance
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ roomId: 1, checkInDate: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
