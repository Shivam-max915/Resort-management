# 🏨 Luxury Resort Management System

A complete, production-grade Resort Management Website built with modern technologies. Features comprehensive booking management, multi-role authentication, and analytics dashboard.

---

## ⚡ Quick Start

**New to this project?** Start here:
- 🚀 [QUICK_START.md](QUICK_START.md) - Get running in 5 minutes
- ✅ [PRODUCTION_READY_VERIFICATION.md](PRODUCTION_READY_VERIFICATION.md) - Full audit & verification

**For detailed info:**
- 📖 [DOCUMENTATION.md](DOCUMENTATION.md) - Complete feature guide
- 🔌 [API_REFERENCE.md](API_REFERENCE.md) - All endpoints documented
- 👨‍💻 [DEVELOPER_REFERENCE.md](DEVELOPER_REFERENCE.md) - Architecture & code structure

---

## 📋 Table of Contents

- [Overview](#overview)
- [Database Choice](#database-choice)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Sample Credentials](#sample-credentials)
- [Testing](#testing)

---

## 🎯 Overview

Luxury Resort Management System is a full-stack application designed to streamline resort operations including:
- **Customer Booking Management**: Browse, book, and manage reservations
- **Staff Management**: Handle check-ins, check-outs, and service requests
- **Admin Dashboard**: Comprehensive analytics, reporting, and system management
- **Real-time Availability**: Check room availability before booking
- **Secure Authentication**: JWT-based authorization with role-based access control

---

## 🗄️ Database Choice: MongoDB

### Why MongoDB?

**MongoDB was chosen over MySQL for the following reasons:**

1. **Flexible Schema**: Hotels have complex, varying room types with different amenities. MongoDB's document-based structure handles this naturally without rigid table schemas.

2. **Scalability**: MongoDB's horizontal scaling capabilities are superior for handling peak seasons and large numbers of concurrent bookings.

3. **Real-time Data**: Perfect for real-time availability checks and dynamic pricing calculations without complex joins.

4. **Embedded Documents**: Guest information, room details, and booking metadata can be embedded naturally, reducing query complexity.

5. **JSON-like Structure**: Perfect alignment with Node.js/JavaScript development - data flows naturally from database to API to frontend.

6. **Rapid Development**: Schema-less nature allows for quick iterations and feature additions without migrations.

7. **Aggregation Pipeline**: MongoDB's aggregation framework is excellent for reporting and analytics (revenue, occupancy rates, etc.).

**Example Document Structure**:
```javascript
{
  _id: ObjectId,
  roomNumber: "101",
  type: "double",
  amenities: { hasWifi: true, hasAC: true, ... },
  bookings: [{ checkIn, checkOut, status, ... }],
  pricing: { basePrice: 120, weekend: 150, discount: 5 }
}
```

---

## ✨ Features

### 🏠 Customer Side
- ✅ Landing page with resort branding and amenities showcase
- ✅ Room browsing with advanced filtering (type, price range, dates)
- ✅ Real-time availability checking
- ✅ Secure booking system with price calculation
- ✅ User registration and JWT-based login
- ✅ Customer dashboard with booking statistics
- ✅ View all bookings with detailed information
- ✅ Cancel bookings with refund calculation
- ✅ Booking history and completed stays
- ✅ Review and rating system for rooms
- ✅ Contact page with messaging
- ✅ Fully responsive mobile-first UI

### 👔 Staff Side
- ✅ Staff login and authentication
- ✅ Dashboard showing today's check-ins/check-outs
- ✅ View assigned rooms
- ✅ Update booking status
- ✅ Handle room service requests
- ✅ Profile management
- ✅ Service request tracking

### 🔐 Admin Side
- ✅ Admin authentication and dashboard
- ✅ Real-time analytics and statistics
- ✅ Room CRUD operations
- ✅ Pricing and discount management
- ✅ Complete booking management
- ✅ User/staff management
- ✅ Revenue and occupancy reports
- ✅ System-wide analytics

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Notifications**: React Toastify
- **Icons**: React Icons
- **Form Handling**: Custom hooks
- **Date Management**: date-fns

### Backend
- **Runtime**: Node.js
- **Server**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Validator.js
- **CORS**: Express CORS middleware
- **Environment**: dotenv

### Architecture
- **REST API** with clean separation of concerns
- **MVC Pattern** with Controllers, Models, and Routes
- **Middleware** for authentication and error handling
- **Services Layer** for business logic
- **Error Handling** with custom error classes
- **Database Indexing** for query optimization

---

## 📁 Project Structure

```
resort-management/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RoomsPage.jsx
│   │   │   ├── RoomDetails.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── customer/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MyBookings.jsx
│   │   │   │   ├── BookingDetails.jsx
│   │   │   │   ├── BookingHistory.jsx
│   │   │   │   └── MyReviews.jsx
│   │   │   ├── staff/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Bookings.jsx
│   │   │   │   └── ServiceRequests.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── RoomManagement.jsx
│   │   │       ├── UserManagement.jsx
│   │   │       ├── BookingManagement.jsx
│   │   │       └── Reports.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layouts/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StaffLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── store.js
│   │   ├── hooks/
│   │   │   └── useForm.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── ServiceRequest.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   └── serviceController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   └── serviceRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── config/
│   │   ├── database.js
│   │   └── constants.js
│   ├── utils/
│   │   ├── errorHandler.js
│   │   ├── validators.js
│   │   └── jwt.js
│   ├── services/
│   │   └── (business logic layer)
│   ├── seeds/
│   │   └── seedData.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone and Setup

```bash
# Navigate to project directory
cd resort-management

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resort-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

#### Frontend (Optional .env)
```bash
cd frontend
# Create .env if needed
VITE_API_URL=http://localhost:5000/api
```

---

## ⚙️ Configuration

### MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB Community Edition
# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**MongoDB Atlas (Cloud):**
1. Create account at mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resort-management
```

### JWT Secret Configuration
In production, use a strong, random secret:
```bash
# Generate strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📦 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

**Terminal 3 - Seed Database (Optional):**
```bash
cd backend
npm run seed
# Populates database with sample data
```

### Production Build

**Backend:**
```bash
cd backend
npm run start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 🔌 API Documentation

### Authentication Endpoints

```bash
POST   /api/auth/register          # Register new customer
POST   /api/auth/login             # Login any user
GET    /api/auth/me                # Get current user (protected)
PUT    /api/auth/profile           # Update profile (protected)
PUT    /api/auth/change-password   # Change password (protected)
```

### Room Endpoints

```bash
GET    /api/rooms                  # Get all rooms with filters
GET    /api/rooms/:id              # Get room details
GET    /api/rooms/availability/check  # Check room availability
POST   /api/rooms                  # Create room (admin)
PUT    /api/rooms/:id              # Update room (admin)
DELETE /api/rooms/:id              # Delete room (admin)
```

### Booking Endpoints

```bash
POST   /api/bookings               # Create booking (customer)
GET    /api/bookings/my-bookings   # Get user bookings (customer)
GET    /api/bookings/:id           # Get booking details
PUT    /api/bookings/:id/cancel    # Cancel booking (customer)
PUT    /api/bookings/:id/status    # Update status (staff/admin)
GET    /api/bookings/admin/all     # Get all bookings (admin)
GET    /api/bookings/staff/today   # Today's check-in/out (staff)
```

### Admin Endpoints

```bash
GET    /api/admin/stats            # Dashboard statistics
GET    /api/admin/revenue          # Revenue reports
GET    /api/admin/occupancy        # Occupancy reports
```

### User Management (Admin)

```bash
GET    /api/users                  # All users with filters
GET    /api/users/:id              # User details
PUT    /api/users/:id              # Update user
DELETE /api/users/:id              # Delete user
GET    /api/users/staff-members    # All staff members
POST   /api/users/staff            # Create staff member
```

---

## 👥 Sample Credentials

Use these credentials to test the application:

### Admin Account
```
Email:    admin@resort.com
Password: Admin123
Role:     Admin
```

### Staff Account
```
Email:    staff1@resort.com
Password: Staff123
Role:     Staff
Department: Housekeeping
```

### Customer Account
```
Email:    customer1@email.com
Password: Customer123
Role:     Customer
```

**To get these credentials:**
1. Run `npm run seed` in the backend
2. Use the credentials above to login
3. All sample data will be loaded

---

## 🧪 Testing

### Manual Testing Scenarios

**1. Customer Booking Flow:**
1. Register as a new customer
2. Browse rooms with filters
3. Select dates and book a room
4. View booking details
5. Cancel booking (if confirmed)

**2. Staff Operations:**
1. Login as staff
2. View today's check-ins/check-outs
3. Access staff dashboard
4. Handle service requests

**3. Admin Functions:**
1. Login as admin
2. View analytics dashboard
3. Manage rooms (CRUD)
4. View revenue reports
5. Manage users and staff

### API Testing

Use Postman or similar tool:

```bash
# Register
POST http://localhost:5000/api/auth/register
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123"
}

# Login
POST http://localhost:5000/api/auth/login
Body: {
  "email": "admin@resort.com",
  "password": "Admin123"
}

# Create Booking
POST http://localhost:5000/api/bookings
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
Body: {
  "roomId": "ROOM_ID",
  "checkInDate": "2024-02-01",
  "checkOutDate": "2024-02-03",
  "numberOfGuests": 2,
  "specialRequests": "High floor"
}
```

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with 10 salt rounds
- **CORS Protection**: Configured CORS middleware
- **Input Validation**: Server-side validation with validator.js
- **Error Handling**: Secure error messages without sensitive data leaks
- **Role-Based Access**: Middleware-based authorization
- **Protected Routes**: Private routes protected with JWT verification
- **Secure Defaults**: No sensitive data in logs or responses

---

## 📊 Database Schema Highlights

### User Collection
- Supports 3 roles: customer, staff, admin
- Stores profile information and preferences
- Tracks account creation and modifications

### Room Collection
- Flexible amenities as sub-document
- Dynamic pricing with weekend rates and discounts
- Status tracking for availability management

### Booking Collection
- Complete transaction history with prices
- Support for cancellations with refund tracking
- Indexed for fast customer and date range queries

### Review Collection
- Guest feedback with detailed ratings
- Connected to completed bookings
- Supports updated reviews

---

## 🎨 UI/UX Highlights

- **Professional Theme**: Premium color palette with gold accents
- **Responsive Design**: Mobile-first, works on all devices
- **Smooth Animations**: CSS transitions and fade-in effects
- **Clean Components**: Reusable, modular React components
- **Intuitive Navigation**: Clear menu structure for all user roles
- **Loading States**: Spinner components for async operations
- **Error Handling**: Toast notifications for user feedback
- **Dashboard Layouts**: Role-specific dashboards with relevant data

---

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running and MONGODB_URI is correct
Check: mongosh or mongo CLI to verify connection
```

### CORS Error
```
Solution: Check CORS configuration in server.js
Ensure frontend URL is allowed in corsOptions
```

### Token Expiration
```
Solution: User will be automatically logged out
Re-login required to get new token
Token automatically refreshed on each request
```

### Port Already in Use
```
# Change port in backend .env:
PORT=5001  # or another available port

# Update frontend API URL accordingly
```

---

## 📈 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for bookings
- [ ] SMS alerts for staff
- [ ] Multi-language support
- [ ] Advanced analytics with charts
- [ ] Loyalty rewards program
- [ ] Guest communication system
- [ ] Inventory management
- [ ] Dynamic pricing based on demand
- [ ] Integration with calendar systems

---

## 📝 License

This project is created for educational and demonstration purposes.

---

## 👨‍💻 Development Notes

### Code Style
- Clean, readable code with comments
- Consistent naming conventions
- Modular file structure
- Error handling at all levels

### Database Indexing
```javascript
// Booking queries are indexed for performance
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ roomId: 1, checkInDate: 1 });
bookingSchema.index({ status: 1 });
```

### Best Practices Implemented
- Async/await for cleaner code
- Input validation on both client and server
- Secure password hashing
- JWT token expiration
- Environment variable management
- Error middleware for consistent error handling
- Database connection pooling
- Seed data for testing

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check console for error messages
4. Verify environment variables are set correctly

---

**Built with ❤️ as a complete, production-grade Resort Management System**

# Resort Management Project
