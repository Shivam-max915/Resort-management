import express from 'express';
import {
  createServiceRequest,
  getUserServiceRequests,
  getAllServiceRequests,
  assignServiceRequest,
  updateServiceRequestStatus,
  getServiceRequestById
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/', protect, authorize('customer'), createServiceRequest);
router.get('/my-requests', protect, authorize('customer'), getUserServiceRequests);

// Staff/Admin routes
router.get('/', protect, authorize('staff', 'admin'), getAllServiceRequests);
router.get('/:id', protect, authorize('staff', 'admin'), getServiceRequestById);
router.put('/:id/assign', protect, authorize('staff', 'admin'), assignServiceRequest);
router.put('/:id/status', protect, authorize('staff', 'admin'), updateServiceRequestStatus);

export default router;
