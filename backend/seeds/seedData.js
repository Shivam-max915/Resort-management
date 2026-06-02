import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Contact from '../models/Contact.js';
import ServiceRequest from '../models/ServiceRequest.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear ALL data for fresh production start
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Contact.deleteMany({});
    await ServiceRequest.deleteMany({});

    console.log('Database completely cleared for fresh start');

    // Hash password before creating admin
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('Shivam@1208', salt);

    // CREATE ONLY PRIMARY ADMIN USER
    const adminPrimary = await User.create({
      firstName: 'Shivam',
      lastName: 'Resort',
      email: 'shivam@resort.com',
      password: hashedAdminPassword,
      role: 'admin',
      phone: '9876543210'
    });

    console.log('✓ Production admin created: shivam@resort.com');

    console.log('\n========== PRODUCTION FRESH START ==========');
    console.log('Database Reset Complete!');
    console.log('\nAdmin Credentials:');
    console.log('Email: shivam@resort.com');
    console.log('Password: Shivam@1208');
    console.log('\nNote: All test data has been deleted.');
    console.log('Admin can now add rooms, staff, and other data manually.');
    console.log('===========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
