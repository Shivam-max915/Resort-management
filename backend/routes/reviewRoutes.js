import express from 'express';
import {
  createReview,
  getRoomReviews,
  getUserReviews,
  getAllReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/room/:roomId', getRoomReviews);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllReviews);

// Protected customer routes
router.post('/', protect, authorize('customer'), createReview);
router.get('/my-reviews', protect, authorize('customer'), getUserReviews);
router.put('/:id', protect, authorize('customer'), updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
