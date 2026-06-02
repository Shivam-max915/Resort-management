import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  earlyCheckOut,
  updateBookingStatus,
  deleteBooking,
  generateBill,
  getAllBookings,
  getTodayCheckInOut
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected customer routes
router.post('/', protect, authorize('customer'), createBooking);
router.get('/my-bookings', protect, authorize('customer'), getUserBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, authorize('customer'), cancelBooking);
router.put('/:id/checkout', protect, authorize('customer'), earlyCheckOut);

// Staff/Admin routes
router.put('/:id/status', protect, authorize('staff', 'admin'), updateBookingStatus);
router.put('/:id/generate-bill', protect, authorize('admin'), generateBill);
router.delete('/:id', protect, authorize('admin'), deleteBooking);
router.get('/admin/all', protect, authorize('staff', 'admin'), getAllBookings);
router.get('/staff/today', protect, authorize('staff', 'admin'), getTodayCheckInOut);

export default router;
