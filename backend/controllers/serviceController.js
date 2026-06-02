import ServiceRequest from '../models/ServiceRequest.js';
import { AppError, catchAsyncErrors } from '../utils/errorHandler.js';

// Create Service Request
export const createServiceRequest = catchAsyncErrors(async (req, res, next) => {
  const { bookingId, roomId, type, title, description, priority } = req.body;

  // Validate required fields
  if (!bookingId || !roomId || !type || !title || !description) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const request = await ServiceRequest.create({
    bookingId,
    roomId,
    customerId: req.userId,
    type,
    title,
    description,
    priority: priority || 'medium',
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    message: 'Service request created successfully',
    request
  });
});

// Get User Service Requests
export const getUserServiceRequests = catchAsyncErrors(async (req, res, next) => {
  const requests = await ServiceRequest.find({ customerId: req.userId })
    .populate('assignedStaffId', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    requests
  });
});

// Get All Service Requests (Staff/Admin)
export const getAllServiceRequests = catchAsyncErrors(async (req, res, next) => {
  const { status, priority, type } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (type) filter.type = type;

  const requests = await ServiceRequest.find(filter)
    .populate('customerId', 'firstName lastName email phone')
    .populate('roomId', 'roomNumber type')
    .populate('assignedStaffId', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    requests
  });
});

// Assign Service Request (Staff/Admin)
export const assignServiceRequest = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { staffId } = req.body;

  if (!staffId) {
    return next(new AppError('Please provide staff ID', 400));
  }

  const request = await ServiceRequest.findByIdAndUpdate(
    id,
    { assignedStaffId: staffId, status: 'in_progress' },
    { new: true }
  ).populate('assignedStaffId', 'firstName lastName email');

  if (!request) {
    return next(new AppError('Service request not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Service request assigned successfully',
    request
  });
});

// Update Service Request Status (Staff)
export const updateServiceRequestStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status, staffNotes } = req.body;

  if (!status) {
    return next(new AppError('Please provide status', 400));
  }

  const updateData = { status };
  if (staffNotes) updateData.staffNotes = staffNotes;
  if (status === 'completed') updateData.completionTime = new Date();

  const request = await ServiceRequest.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  ).populate('assignedStaffId', 'firstName lastName email');

  if (!request) {
    return next(new AppError('Service request not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Service request updated successfully',
    request
  });
});

// Get Service Request by ID
export const getServiceRequestById = catchAsyncErrors(async (req, res, next) => {
  const request = await ServiceRequest.findById(req.params.id)
    .populate('customerId', 'firstName lastName email phone')
    .populate('assignedStaffId', 'firstName lastName email');

  if (!request) {
    return next(new AppError('Service request not found', 404));
  }

  res.status(200).json({
    success: true,
    request
  });
});
