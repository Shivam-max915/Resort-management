import { create } from 'zustand';

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
    // Use sessionStorage only (clears when browser/tab closes)
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    // Clear all session data immediately
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user'); // Also clear old localStorage data if exists
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
      const token = sessionStorage.getItem('token');
      const userStr = sessionStorage.getItem('user');
      
      // If no token or user in sessionStorage, user is not authenticated
      if (!token || !userStr) {
        set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
        return;
      }
      
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
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include' // Include cookies if using them
          });
          
          if (response.ok) {
            const data = await response.json();
            const backendUser = data.user;
            
            // CRITICAL: Validate role matches backend
            if (!backendUser || !backendUser.role || backendUser.role !== user.role) {
              console.error('Role mismatch or invalid backend response - security violation');
              sessionStorage.removeItem('user');
              sessionStorage.removeItem('token');
              set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
              return;
            }
            
            // CRITICAL: Validate user ID matches to prevent session hijacking
            if (backendUser._id !== user.id) {
              console.error('User ID mismatch - potential session hijacking attempt');
              sessionStorage.removeItem('user');
              sessionStorage.removeItem('token');
              set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
              return;
            }
            
            // Token is valid - update with latest backend data
            set({ user: backendUser, token, isAuthenticated: true, isInitialized: true });
          } else if (response.status === 401) {
            // Token is invalid or expired - clear auth immediately
            console.warn('Token validation failed - clearing auth');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
          } else {
            // Server error - be cautious, clear auth
            console.error('Backend auth check failed with status:', response.status);
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
          }
        } catch (backendError) {
          // Network error during validation - CRITICAL: DO NOT trust client-side data
          console.error('Backend validation error - clearing auth:', backendError);
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
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
