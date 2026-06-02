import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ROLES } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      default: null
    },
    
    // Authentication
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    
    // Role and Status
    role: {
      type: String,
      enum: [ROLES.CUSTOMER, ROLES.STAFF, ROLES.ADMIN],
      default: ROLES.CUSTOMER
    },
    isActive: {
      type: Boolean,
      default: true
    },
    
    // Customer specific
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    
    // Staff/Admin specific
    department: {
      type: String,
      default: null
    },
    position: {
      type: String,
      default: null
    },
    assignedRooms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    }],
    
    // Profile
    profileImage: {
      type: String,
      default: null
    },
    dateOfBirth: Date,
    
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Check if password is already hashed (bcrypt hashes start with $2)
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
      return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user data without password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
