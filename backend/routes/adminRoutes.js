import express from 'express';
import {
  getDashboardStats,
  getRevenueReport,
  getOccupancyReport
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/revenue', protect, authorize('admin'), getRevenueReport);
router.get('/occupancy', protect, authorize('admin'), getOccupancyReport);

export default router;
