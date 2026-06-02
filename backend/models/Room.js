import mongoose from 'mongoose';
import { ROOM_TYPES, ROOM_STATUS } from '../config/constants.js';

const roomSchema = new mongoose.Schema(
  {
    // Room Information
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true
    },
    type: {
      type: String,
      enum: [ROOM_TYPES.SINGLE, ROOM_TYPES.DOUBLE, ROOM_TYPES.SUITE, ROOM_TYPES.DELUXE],
      required: [true, 'Room type is required']
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required']
    },
    
    // Capacity
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    bedType: {
      type: String,
      enum: ['single', 'double', 'queen', 'king'],
      default: 'queen'
    },
    
    // Pricing
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price must be non-negative']
    },
    weekendPrice: {
      type: Number,
      default: null
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    
    // Amenities
    amenities: {
      hasWifi: { type: Boolean, default: true },
      hasAC: { type: Boolean, default: true },
      hasTV: { type: Boolean, default: true },
      hasBalcony: { type: Boolean, default: false },
      hasJacuzzi: { type: Boolean, default: false },
      hasKitchen: { type: Boolean, default: false },
      hasWorkDesk: { type: Boolean, default: true },
      hasMinibar: { type: Boolean, default: true },
      hasSafeBox: { type: Boolean, default: true }
    },
    
    // Status & Availability
    status: {
      type: String,
      enum: [ROOM_STATUS.AVAILABLE, ROOM_STATUS.BOOKED, ROOM_STATUS.MAINTENANCE, ROOM_STATUS.OCCUPIED],
      default: ROOM_STATUS.AVAILABLE
    },
    
    // Images
    images: [String],
    
    // Description
    description: String,
    
    // Assigned Staff
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Calculate effective price based on discount
roomSchema.methods.getEffectivePrice = function () {
  const discountAmount = (this.basePrice * this.discount) / 100;
  return this.basePrice - discountAmount;
};

const Room = mongoose.model('Room', roomSchema);

export default Room;
