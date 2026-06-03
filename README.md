# 🏨 Resort Management System

A professional, full-stack web application designed to streamline resort bookings, room management, and customer service operations. Built using modern web technologies with a decoupled frontend and backend architecture.

## 🚀 Tech Stack

- **Frontend:** React.js, Tailwind CSS, JavaScript (ES6+), React Router
- **Backend:** Node.js, Express.js, RESTful APIs, JWT Authentication
- **Database:** MongoDB / Relational Database (via Mongoose/Sequelize models)
- **Utilities:** Custom Form Hooks, Modular Middleware, Error Handlers

---

## ✨ Key Features

- **User Authentication:** Secure registration and login using JSON Web Tokens (JWT) and role-based routing (Admin, Staff, User).
- **Room & Service Management:** Complete CRUD operations for rooms, pricing, availability, and active service requests.
- **Booking & Billing System:** Seamless booking workflow with automatic tracking, reservation logs, and backend validation.
- **Admin Dashboard:** Centralized panel for managing users, reviews, contact messages, and analytical reports.
- **Clean Architecture:** Organized folder structure separating controllers, models, routes, and custom frontend hooks for clean code maintenance.

---

## 📂 Project Structure

```text
├── backend/
│   ├── config/          # Database & Constant configurations
│   ├── controllers/     # Business logic for Users, Rooms, Bookings, etc.
│   ├── middleware/      # Auth & Validation middlewares
│   ├── models/          # Relational/NoSQL Database Schemas
│   ├── routes/          # REST API Endpoints mapping
│   └── scripts/         # Database seeding and cleaning utilities
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI elements & Protected Routes
    │   ├── layouts/     # Navbar, Admin, and Staff Layouts
    │   ├── pages/       # Landing, Login, Rooms, and Admin sub-pages
    │   └── hooks/       # Custom React hooks (e.g., useForm)
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js installed on your machine.
- Database setup configured in `backend/config/`.

### 1. Setup Backend
```bash
cd backend
npm install
npm run seed  # To populate initial room and admin data
npm start     # Runs on http://localhost:5000 (or configured port)
```

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev   # Runs the React development server
```

## ☁️ Hosting
### Backend on Render
1. Connect this repository to Render and create a new Web Service.
2. Set the Root Directory to `backend`.
3. Use:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add these environment variables in Render:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong secret for JWT
   - `JWT_EXPIRE` — e.g. `7d`
   - `FRONTEND_URL` — `https://resort-management-kappa.vercel.app`

Your Render backend URL will look like:
`https://<your-service>.onrender.com/api`

### Frontend on Vercel
1. Deploy the `frontend` folder to Vercel.
2. In the Vercel dashboard, add an Environment Variable:
   - `VITE_API_URL` = `https://<your-service>.onrender.com/api`
3. Re-deploy the frontend after setting the variable.

### Notes
- The backend already exposes API routes under `/api`.
- Local development can continue using the default frontend proxy `VITE_API_URL` fallback to `/api`.
- If using Atlas, ensure your IP access list allows Render's outbound IPs or use `0.0.0.0/0` during setup.

---

## 🧑‍💻 Author
- **Shivam Waghe** - Full-Stack Developer 
- GitHub: [@Shivam-max915](https://github.com)
