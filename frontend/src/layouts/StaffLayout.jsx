import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaClipboard, FaTools, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuthStore } from '../services/store';

const StaffLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/staff/dashboard' },
    { icon: <FaClipboard />, label: 'Bookings', path: '/staff/bookings' },
    { icon: <FaTools />, label: 'Service Requests', path: '/staff/service-requests' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">Staff Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl hover:bg-white hover:bg-opacity-10 p-2 rounded">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b border-secondary ${!sidebarOpen && 'text-center'}`}>
          {sidebarOpen ? (
            <>
              <p className="text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-secondary">{user?.department}</p>
            </>
          ) : (
            <FaUser className="mx-auto" />
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary hover:bg-opacity-10 transition"
              title={!sidebarOpen ? item.label : ''}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-secondary">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-secondary text-dark px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            <FaSignOutAlt />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default StaffLayout;
