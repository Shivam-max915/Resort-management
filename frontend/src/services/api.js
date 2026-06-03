import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Include credentials for httpOnly cookies support
});

// Add token to requests - read from sessionStorage only
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // CRITICAL: On 401, clear session and redirect to login
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      localStorage.removeItem('token'); // Also clear old localStorage
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  changePassword: (data) => apiClient.put('/auth/change-password', data)
};

// Room Services
export const roomService = {
  getAllRooms: (params) => apiClient.get('/rooms', { params }),
  getRoomById: (id) => apiClient.get(`/rooms/${id}`),
  checkAvailability: (roomId, checkIn, checkOut) => 
    apiClient.get('/rooms/availability/check', { params: { roomId, checkIn, checkOut } }),
  createRoom: (data) => apiClient.post('/rooms', data),
  updateRoom: (id, data) => apiClient.put(`/rooms/${id}`, data),
  deleteRoom: (id) => apiClient.delete(`/rooms/${id}`)
};

// Booking Services
export const bookingService = {
  createBooking: (data) => apiClient.post('/bookings', data),
  getUserBookings: () => apiClient.get('/bookings/my-bookings'),
  getBookingById: (id) => apiClient.get(`/bookings/${id}`),
  cancelBooking: (id, reason) => apiClient.put(`/bookings/${id}/cancel`, { reason }),
  earlyCheckOut: (id) => apiClient.put(`/bookings/${id}/checkout`),
  updateBookingStatus: (id, status) => apiClient.put(`/bookings/${id}/status`, { status }),
  generateBill: (id) => apiClient.put(`/bookings/${id}/generate-bill`),
  deleteBooking: (id) => apiClient.delete(`/bookings/${id}`),
  getAllBookings: (params) => apiClient.get('/bookings/admin/all', { params }),
  getTodayCheckInOut: () => apiClient.get('/bookings/staff/today')
};

// Review Services
export const reviewService = {
  createReview: (data) => apiClient.post('/reviews', data),
  getRoomReviews: (roomId, params) => apiClient.get(`/reviews/room/${roomId}`, { params }),
  getUserReviews: () => apiClient.get('/reviews/my-reviews'),
  getAllReviews: () => apiClient.get('/reviews/admin/all'),
  updateReview: (id, data) => apiClient.put(`/reviews/${id}`, data),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`)
};

// Service Request Services
export const serviceService = {
  createRequest: (data) => apiClient.post('/services', data),
  getUserRequests: () => apiClient.get('/services/my-requests'),
  getAllRequests: (params) => apiClient.get('/services', { params }),
  getRequestById: (id) => apiClient.get(`/services/${id}`),
  assignRequest: (id, staffId) => apiClient.put(`/services/${id}/assign`, { staffId }),
  updateRequestStatus: (id, status, notes) => apiClient.put(`/services/${id}/status`, { status, staffNotes: notes })
};

// User Services
export const userService = {
  getAllUsers: (params) => apiClient.get('/users', { params }),
  getUserById: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  getStaffMembers: () => apiClient.get('/users/staff-members'),
  createStaff: (data) => apiClient.post('/users/staff', data)
};

// Admin Services
export const adminService = {
  getDashboardStats: () => apiClient.get('/admin/stats'),
  getRevenueReport: (params) => apiClient.get('/admin/revenue', { params }),
  getOccupancyReport: () => apiClient.get('/admin/occupancy'),
  getAllUsers: () => apiClient.get('/users'),
  getAllContacts: () => apiClient.get('/contacts'),
  updateContactStatus: (id, status) => apiClient.put(`/contacts/${id}`, { status }),
  deleteContact: (id) => apiClient.delete(`/contacts/${id}`)
};

// Contact Services
export const contactService = {
  sendMessage: (data) => apiClient.post('/contacts', data)
};

// Notification Services
export const notificationService = {
  getMyNotifications: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all')
};

export default apiClient;
