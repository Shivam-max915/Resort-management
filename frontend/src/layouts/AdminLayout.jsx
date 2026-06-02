import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaKey, FaUsers, FaClipboard, FaChartBar, FaSignOutAlt, FaBars, FaTimes, FaEnvelope, FaCog, FaFileInvoice, FaStar } from 'react-icons/fa';
import { useAuthStore } from '../services/store';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <FaKey />, label: 'Room Management', path: '/admin/rooms' },
    { icon: <FaUsers />, label: 'User Management', path: '/admin/users' },
    { icon: <FaClipboard />, label: 'Booking Management', path: '/admin/bookings' },
    { icon: <FaFileInvoice />, label: 'Billing', path: '/admin/billing' },
    { icon: <FaChartBar />, label: 'Reports', path: '/admin/reports' },
    { icon: <FaStar />, label: 'Reviews', path: '/admin/reviews' },
    { icon: <FaEnvelope />, label: 'Customer Messages', path: '/admin/messages' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-24'} bg-gradient-to-b from-primary to-dark text-white transition-all duration-300 flex flex-col shadow-2xl`}>
        {/* Logo/Header */}
        <div className="p-6 flex items-center justify-between border-b border-white border-opacity-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-bold text-dark">
              🏨
            </div>
            {sidebarOpen && <h2 className="text-2xl font-bold">Admin</h2>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-xl hover:bg-white hover:bg-opacity-10 p-2 rounded-lg transition"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* User Info */}
        <div className={`px-6 py-4 border-b border-white border-opacity-10 ${!sidebarOpen && 'text-center'}`}>
          {sidebarOpen ? (
            <div>
              <p className="font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-300 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Administrator
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <FaUsers className="text-2xl" />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path) 
                  ? 'bg-secondary text-dark font-semibold shadow-lg' 
                  : 'text-gray-100 hover:bg-white hover:bg-opacity-10'
              }`}
              title={!sidebarOpen ? item.label : ''}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Settings & Logout */}
        <div className="p-4 border-t border-white border-opacity-10 space-y-2">
          <button 
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-100 hover:bg-white hover:bg-opacity-10 transition-all duration-200"
            title={!sidebarOpen ? 'Settings' : ''}
          >
            <FaCog className="text-lg" />
            {sidebarOpen && <span className="text-sm">Settings</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-200 font-semibold"
          >
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-dark">
                {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="text-gray-600">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
