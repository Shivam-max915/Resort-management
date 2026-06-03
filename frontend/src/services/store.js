import { create } from 'zustand';
import { authService } from './api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: (user, token) => {
    // CRITICAL: Validate user has required role field
    if (!user || !user.role || typeof user.role !== 'string') {
      console.error('Invalid user object - missing or invalid role');
      return;
    }

    const serializedUser = JSON.stringify(user);
    sessionStorage.setItem('user', serializedUser);
    sessionStorage.setItem('token', token);
    localStorage.setItem('user', serializedUser);
    localStorage.setItem('token', token);

    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    // Clear all stored auth data immediately
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updatedUser) => {
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // CRITICAL FIX: Verify auth state on app load with backend validation
  // This runs on EVERY app load/refresh - no trusting client-side data
  initializeAuth: async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
      
      // If no token or user in storage, user is not authenticated
      if (!token || !userStr) {
        set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
        return;
      }

      // Keep both storage layers in sync for refresh/new-tab support
      if (!sessionStorage.getItem('token')) sessionStorage.setItem('token', token);
      if (!sessionStorage.getItem('user')) sessionStorage.setItem('user', userStr);
      
      try {
        const user = JSON.parse(userStr);
        
        // CRITICAL: Validate user has role
        if (!user || !user.role || typeof user.role !== 'string') {
          console.warn('Invalid user data - clearing auth');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
          return;
        }
        
        // CRITICAL: ALWAYS verify token with backend on app initialization
        // This prevents unauthorized access even if someone tries to modify sessionStorage
        try {
          const response = await authService.getCurrentUser();
          const backendUser = response.data.user;

          // CRITICAL: Validate role matches backend
          if (!backendUser || !backendUser.role || backendUser.role !== user.role) {
            console.error('Role mismatch or invalid backend response - security violation');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
            return;
          }

          // CRITICAL: Validate user ID matches to prevent session hijacking
          const storedUserId = user.id || user._id;
          const backendUserId = backendUser._id || backendUser.id;
          if (!backendUserId || backendUserId !== storedUserId) {
            console.error('User ID mismatch - potential session hijacking attempt');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
            return;
          }

          // Token is valid - update with latest backend data
          const serializedUser = JSON.stringify(backendUser);
          sessionStorage.setItem('user', serializedUser);
          localStorage.setItem('user', serializedUser);
          set({ user: backendUser, token, isAuthenticated: true, isInitialized: true });
        } catch (backendError) {
          const status = backendError.response?.status;
          if (status === 401) {
            console.warn('Token validation failed - clearing auth');
          } else {
            console.error('Backend validation error - clearing auth:', backendError);
          }
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
        }
      } catch (parseError) {
        console.error('Failed to parse stored user data:', parseError);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
    }
  }
}));

export const useBookingStore = create((set) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,

  setBookings: (bookings) => set({ bookings }),
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

export const useRoomStore = create((set) => ({
  rooms: [],
  selectedRoom: null,
  filters: {
    type: null,
    minPrice: null,
    maxPrice: null,
    checkIn: null,
    checkOut: null
  },
  isLoading: false,
  error: null,

  setRooms: (rooms) => set({ rooms }),
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));
