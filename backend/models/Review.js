import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    // Customer Information
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required']
    },
    
    // Room Information
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room ID is required']
    },
    
    // Booking Reference
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    
    // Review Content
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      minlength: [5, 'Comment must be at least 5 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    
    // Review Categories
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    comfort: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    service: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    amenities: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    
    // Verification
    isVerified: {
      type: Boolean,
      default: false
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

// Ensure one review per booking
reviewSchema.index({ bookingId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
