import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaHome } from 'react-icons/fa';
import { useAuthStore } from '../services/store';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // CRITICAL FIX: Clear all auth state before redirect
    logout();
    // Ensure clear localStorage as well for safety
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
              <span className="text-secondary">🏨</span>
              <span>Luxury Resort</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="hover:text-secondary transition">Home</Link>
              <Link to="/rooms" className="hover:text-secondary transition">Rooms</Link>
              <Link to="/contact" className="hover:text-secondary transition">Contact</Link>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-secondary">
                  <span className="text-sm">{user?.firstName}</span>
                  {user?.role === 'customer' && (
                    <Link to="/customer/dashboard" className="hover:text-secondary transition">
                      Dashboard
                    </Link>
                  )}
                  {user?.role === 'staff' && (
                    <Link to="/staff/dashboard" className="hover:text-secondary transition">
                      Staff Panel
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" className="hover:text-secondary transition">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-secondary text-dark px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="hover:text-secondary transition">Login</Link>
                  <Link to="/register" className="bg-secondary text-dark px-4 py-2 rounded-lg hover:bg-opacity-90 transition">
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-secondary space-y-3">
              <Link to="/" className="block hover:text-secondary transition" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/rooms" className="block hover:text-secondary transition" onClick={() => setMobileMenuOpen(false)}>
                Rooms
              </Link>
              <Link to="/contact" className="block hover:text-secondary transition" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="py-2 border-t border-secondary">
                    <p className="text-sm mb-3">{user?.firstName} ({user?.role})</p>
                    {user?.role === 'customer' && (
                      <Link to="/customer/dashboard" className="block hover:text-secondary transition" onClick={() => setMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                    )}
                    {user?.role === 'staff' && (
                      <Link to="/staff/dashboard" className="block hover:text-secondary transition" onClick={() => setMobileMenuOpen(false)}>
                        Staff Panel
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" className="block hover:text-secondary transition" onClick={() => setMobileMenuOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 bg-secondary text-dark px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1 text-center py-2 border border-white rounded hover:bg-white hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="flex-1 text-center bg-secondary text-dark px-4 py-2 rounded hover:bg-opacity-90 transition" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
