import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { AppError, catchAsyncErrors } from '../utils/errorHandler.js';

// Get All Rooms
export const getAllRooms = catchAsyncErrors(async (req, res, next) => {
  const { type, minPrice, maxPrice, checkIn, checkOut } = req.query;

  const filter = {};
  if (type) filter.type = type;

  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) filter.basePrice.$gte = minPrice;
    if (maxPrice) filter.basePrice.$lte = maxPrice;
  }

  let rooms = await Room.find(filter).lean();

  // Add average rating to each room
  rooms = await Promise.all(rooms.map(async (room) => {
    const reviews = await Review.find({ roomId: room._id });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
      : 0;
    return { ...room, avgRating, reviewCount: reviews.length };
  }));

  // Filter by availability if dates provided
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const bookedRoomIds = await Booking.find({
      status: { $nin: ['cancelled'] },
      $or: [
        { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
      ]
    }).distinct('roomId');

    rooms = rooms.filter(room => !bookedRoomIds.includes(room._id.toString()));
  }

  res.status(200).json({
    success: true,
    count: rooms.length,
    rooms
  });
});

// Get Room by ID
export const getRoomById = catchAsyncErrors(async (req, res, next) => {
  const room = await Room.findById(req.params.id)
    .populate('assignedStaff', 'firstName lastName email phone')
    .lean();

  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  // Add average rating
  const reviews = await Review.find({ roomId: room._id });
  room.avgRating = reviews.length > 0 
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
    : 0;
  room.reviewCount = reviews.length;

  res.status(200).json({
    success: true,
    room
  });
});

// Create Room (Admin only)
export const createRoom = catchAsyncErrors(async (req, res, next) => {
  const { roomNumber, type, floor, capacity, bedType, basePrice, amenities, description, images } = req.body;

  // Validate required fields
  if (!roomNumber || !type || floor === undefined || !capacity || !basePrice) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Check if room already exists
  const existingRoom = await Room.findOne({ roomNumber });
  if (existingRoom) {
    return next(new AppError('Room number already exists', 409));
  }

  const room = await Room.create({
    roomNumber,
    type,
    floor,
    capacity,
    bedType: bedType || 'queen',
    basePrice,
    amenities: amenities || {},
    description: description || '',
    images: images || []
  });

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    room
  });
});

// Update Room (Admin only)
export const updateRoom = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { roomNumber, type, floor, capacity, bedType, basePrice, weekendPrice, discount, amenities, status, description, images, assignedStaff } = req.body;

  const room = await Room.findById(id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  // Check if new room number already exists
  if (roomNumber && roomNumber !== room.roomNumber) {
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return next(new AppError('Room number already exists', 409));
    }
  }

  const updatedRoom = await Room.findByIdAndUpdate(
    id,
    {
      roomNumber: roomNumber || undefined,
      type: type || undefined,
      floor: floor !== undefined ? floor : undefined,
      capacity: capacity || undefined,
      bedType: bedType || undefined,
      basePrice: basePrice || undefined,
      weekendPrice: weekendPrice || undefined,
      discount: discount !== undefined ? discount : undefined,
      amenities: amenities || undefined,
      status: status || undefined,
      description: description || undefined,
      images: images || undefined,
      assignedStaff: assignedStaff || undefined
    },
    { new: true, runValidators: true }
  ).populate('assignedStaff', 'firstName lastName email');

  res.status(200).json({
    success: true,
    message: 'Room updated successfully',
    room: updatedRoom
  });
});

// Delete Room (Admin only)
export const deleteRoom = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const room = await Room.findById(id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  // Check if room has active bookings
  const activeBookings = await Booking.findOne({
    roomId: id,
    status: { $in: ['pending', 'confirmed', 'checked_in'] }
  });

  if (activeBookings) {
    return next(new AppError('Cannot delete room with active bookings', 400));
  }

  await Room.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Room deleted successfully'
  });
});

// Check Room Availability
export const checkAvailability = catchAsyncErrors(async (req, res, next) => {
  const { roomId, checkIn, checkOut } = req.query;

  if (!roomId || !checkIn || !checkOut) {
    return next(new AppError('Please provide roomId, checkIn, and checkOut dates', 400));
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return next(new AppError('Check-out date must be after check-in date', 400));
  }

  const room = await Room.findById(roomId);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  const conflictingBooking = await Booking.findOne({
    roomId,
    status: { $nin: ['cancelled'] },
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate }
  });

  const isAvailable = !conflictingBooking;

  res.status(200).json({
    success: true,
    isAvailable,
    room: {
      id: room._id,
      roomNumber: room.roomNumber,
      basePrice: room.basePrice,
      weekendPrice: room.weekendPrice,
      discount: room.discount
    }
  });
});
