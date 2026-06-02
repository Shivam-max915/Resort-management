import Contact from '../models/Contact.js';
import { AppError, catchAsyncErrors } from '../utils/errorHandler.js';

// Submit Contact Form
export const submitContact = catchAsyncErrors(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message
  });

  res.status(201).json({
    success: true,
    message: 'Contact message received successfully',
    contact
  });
});

// Get All Contact Messages (Admin)
export const getAllContacts = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.query;
  
  const filter = {};
  if (status) filter.status = status;

  const contacts = await Contact.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: contacts.length,
    contacts
  });
});

// Get Contact by ID (Admin)
export const getContactById = catchAsyncErrors(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new AppError('Contact message not found', 404));
  }

  // Mark as read
  if (contact.status === 'new') {
    contact.status = 'read';
    await contact.save();
  }

  res.status(200).json({
    success: true,
    contact
  });
});

// Update Contact Status (Admin)
export const updateContactStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  if (!['new', 'read', 'resolved'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    return next(new AppError('Contact message not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Contact status updated',
    contact
  });
});

// Delete Contact (Admin)
export const deleteContact = catchAsyncErrors(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new AppError('Contact message not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Contact message deleted'
  });
});
