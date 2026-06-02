import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    // Request Information
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Request Type
    type: {
      type: String,
      enum: ['room_service', 'housekeeping', 'maintenance', 'complaint', 'other'],
      required: [true, 'Request type is required']
    },
    
    // Description
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    
    // Status
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    
    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    
    // Assignment
    assignedStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    
    // Notes
    staffNotes: String,
    completionTime: Date,
    
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

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
