import express from 'express';
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route - Submit contact form
router.post('/', submitContact);

// Admin routes
router.get('/', protect, authorize('admin'), getAllContacts);
router.get('/:id', protect, authorize('admin'), getContactById);
router.put('/:id', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContact);

export default router;
