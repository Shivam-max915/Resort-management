import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Contact from '../models/Contact.js';
import ServiceRequest from '../models/ServiceRequest.js';
import connectDB from '../config/database.js';

dotenv.config();

const cleanDatabase = async () => {
  try {
    await connectDB();

    console.log('Starting database cleanup...\n');

    // Delete all non-admin users
    const adminEmail = 'shivam@resort.com';
    const deleteResult = await User.deleteMany({ email: { $ne: adminEmail } });
    console.log(`✓ Deleted ${deleteResult.deletedCount} non-admin users`);

    // Delete all rooms
    const roomResult = await Room.deleteMany({});
    console.log(`✓ Deleted ${roomResult.deletedCount} rooms`);

    // Delete all bookings
    const bookingResult = await Booking.deleteMany({});
    console.log(`✓ Deleted ${bookingResult.deletedCount} bookings`);

    // Delete all reviews
    const reviewResult = await Review.deleteMany({});
    console.log(`✓ Deleted ${reviewResult.deletedCount} reviews`);

    // Delete all contacts
    const contactResult = await Contact.deleteMany({});
    console.log(`✓ Deleted ${contactResult.deletedCount} contact messages`);

    // Delete all service requests
    const serviceResult = await ServiceRequest.deleteMany({});
    console.log(`✓ Deleted ${serviceResult.deletedCount} service requests`);

    // Verify admin exists
    const admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log(`\n✓ Admin account preserved: ${adminEmail}`);
    } else {
      console.error('\n✗ ERROR: Admin account not found!');
      process.exit(1);
    }

    console.log('\n========== DATABASE CLEANUP COMPLETE ==========');
    console.log('All data has been deleted except admin account.');
    console.log('System is ready for production use.');
    console.log('==============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error cleaning database:', error.message);
    process.exit(1);
  }
};

cleanDatabase();
