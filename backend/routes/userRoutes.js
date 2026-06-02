import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getStaffMembers,
  createStaff
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.post('/staff', protect, authorize('admin'), createStaff);
router.get('/staff-members', protect, authorize('admin'), getStaffMembers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/deactivate', protect, authorize('admin'), deactivateUser);
router.put('/:id/activate', protect, authorize('admin'), activateUser);

export default router;
