import Notification from '../models/Notification.js';
import { catchAsyncErrors } from '../utils/errorHandler.js';

// Get user notifications
export const getMyNotifications = catchAsyncErrors(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    count: notifications.length,
    notifications
  });
});

// Mark notification as read
export const markAsRead = catchAsyncErrors(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  res.status(200).json({
    success: true,
    notification
  });
});

// Mark all notifications as read
export const markAllAsRead = catchAsyncErrors(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});
