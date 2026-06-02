import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  checkAvailability
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.get('/availability/check', checkAvailability);

// Admin routes
router.post('/', protect, authorize('admin'), createRoom);
router.put('/:id', protect, authorize('admin'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

export default router;
