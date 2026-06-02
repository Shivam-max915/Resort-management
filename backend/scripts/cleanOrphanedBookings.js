import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const cleanOrphanedBookings = async () => {
  try {
    await connectDB();

    console.log('\n========== DATABASE CONSISTENCY CLEANUP ==========\n');
    console.log('Scanning for orphaned bookings...\n');

    let orphanedCount = 0;
    let cleanedServiceRequests = 0;
    const deletedBookingIds = [];

    // Step 1: Find bookings with invalid customer references
    console.log('Step 1: Checking for bookings with invalid customer references...');
    const allBookings = await Booking.find();
    
    for (const booking of allBookings) {
      const customerExists = await User.findById(booking.customerId);
      
      if (!customerExists) {
        console.log(`  ✗ Found orphaned booking: ${booking._id} (Invalid customer reference)`);
        
        // Delete related service requests
        const serviceReqs = await ServiceRequest.deleteMany({ bookingId: booking._id });
        cleanedServiceRequests += serviceReqs.deletedCount;
        
        // Release room back to available
        await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });
        
        // Delete the booking
        await Booking.findByIdAndDelete(booking._id);
        deletedBookingIds.push(booking._id.toString());
        orphanedCount++;
        
        console.log(`    → Deleted booking, released room, removed ${serviceReqs.deletedCount} service requests`);
      }
    }

    // Step 2: Find bookings with invalid room references
    console.log('\nStep 2: Checking for bookings with invalid room references...');
    const remainingBookings = await Booking.find();
    
    for (const booking of remainingBookings) {
      const roomExists = await Room.findById(booking.roomId);
      
      if (!roomExists) {
        console.log(`  ✗ Found orphaned booking: ${booking._id} (Invalid room reference)`);
        
        // Delete related service requests
        const serviceReqs = await ServiceRequest.deleteMany({ bookingId: booking._id });
        cleanedServiceRequests += serviceReqs.deletedCount;
        
        // Delete the booking
        await Booking.findByIdAndDelete(booking._id);
        deletedBookingIds.push(booking._id.toString());
        orphanedCount++;
        
        console.log(`    → Deleted booking, removed ${serviceReqs.deletedCount} service requests`);
      }
    }

    // Step 3: Find and delete orphaned service requests (booking no longer exists)
    console.log('\nStep 3: Checking for orphaned service requests...');
    const allServiceRequests = await ServiceRequest.find();
    let orphanedServiceReqs = 0;
    
    for (const req of allServiceRequests) {
      const bookingExists = await Booking.findById(req.bookingId);
      
      if (!bookingExists) {
        console.log(`  ✗ Found orphaned service request: ${req._id} (Invalid booking reference)`);
        await ServiceRequest.findByIdAndDelete(req._id);
        orphanedServiceReqs++;
      }
    }

    // Step 4: Verify remaining bookings have valid references
    console.log('\nStep 4: Verifying data consistency...');
    const verifyBookings = await Booking.find();
    let validCount = 0;
    
    for (const booking of verifyBookings) {
      const customerExists = await User.findById(booking.customerId);
      const roomExists = await Room.findById(booking.roomId);
      
      if (customerExists && roomExists) {
        validCount++;
      } else {
        console.log(`  ⚠ WARNING: Booking ${booking._id} still has invalid references!`);
      }
    }

    // Summary
    console.log('\n========== CLEANUP SUMMARY ==========');
    console.log(`Orphaned bookings deleted: ${orphanedCount}`);
    console.log(`Service requests cleaned: ${cleanedServiceRequests + orphanedServiceReqs}`);
    console.log(`Total bookings remaining: ${verifyBookings.length}`);
    console.log(`Valid bookings verified: ${validCount}`);
    
    if (deletedBookingIds.length > 0) {
      console.log(`\nDeleted Booking IDs:`);
      deletedBookingIds.forEach(id => console.log(`  - ${id}`));
    }

    if (orphanedCount === 0 && orphanedServiceReqs === 0) {
      console.log('\n✓ Database is clean! No orphaned records found.');
    } else {
      console.log(`\n✓ Cleanup complete! Removed ${orphanedCount + orphanedServiceReqs} orphaned records.`);
    }

    console.log('===================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error.message);
    console.error(error);
    process.exit(1);
  }
};

cleanOrphanedBookings();
