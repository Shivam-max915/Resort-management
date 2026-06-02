import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { FaChartBar, FaDollarSign, FaUsers, FaHome, FaSpinner, FaArrowUp, FaCoins, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-primary mb-4 inline-block" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      icon: FaHome, 
      label: 'Total Rooms', 
      value: stats?.stats?.totalRooms || 0, 
      color: 'from-blue-500 to-blue-600',
      trend: '+2.5%'
    },
    { 
      icon: FaUsers, 
      label: 'Total Users', 
      value: stats?.stats?.totalUsers || 0, 
      color: 'from-green-500 to-green-600',
      trend: '+5.2%'
    },
    { 
      icon: FaCheckCircle, 
      label: 'Total Bookings', 
      value: stats?.stats?.totalBookings || 0, 
      color: 'from-purple-500 to-purple-600',
      trend: '+12.1%'
    },
    { 
      icon: FaDollarSign, 
      label: 'Total Revenue', 
      value: `₹${(stats?.stats?.totalRevenue || 0).toLocaleString('en-IN')}`, 
      color: 'from-yellow-500 to-yellow-600',
      trend: '+8.3%'
    },
    { 
      icon: FaArrowUp, 
      label: 'Occupancy Rate', 
      value: `${stats?.stats?.occupancyRate || 0}%`, 
      color: 'from-pink-500 to-pink-600',
      trend: 'Stable'
    },
    { 
      icon: FaUsers, 
      label: 'Staff Members', 
      value: stats?.stats?.totalStaff || 0, 
      color: 'from-indigo-500 to-indigo-600',
      trend: 'Active'
    }
  ];

  return (
    <div className="bg-light min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-dark mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome to your admin control center</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl card-shadow p-6 hover:shadow-xl transition-all hover:-translate-y-1 group overflow-hidden relative"
              >
                {/* Gradient Background Effect */}
                <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 rounded-full transition-all`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-br ${card.color} p-4 rounded-xl text-white shadow-lg`}>
                      <Icon className="text-2xl" />
                    </div>
                    <span className="text-green-600 text-sm font-semibold px-3 py-1 bg-green-50 rounded-full">
                      {card.trend}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm font-medium mb-2">{card.label}</p>
                  <p className="text-4xl font-bold text-dark">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Bookings by Status */}
          <div className="bg-white rounded-2xl card-shadow p-8">
            <h3 className="text-2xl font-bold text-dark mb-6">Bookings by Status</h3>
            <div className="space-y-5">
              {stats?.bookingsByStatus?.map((item, idx) => (
                <div key={item._id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800 capitalize">{item._id}</span>
                      <span className="text-sm font-bold text-primary">{item.count}</span>
                    </div>
                    <div className="h-3 bg-light rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          item._id === 'confirmed' ? 'bg-green-500' :
                          item._id === 'pending' ? 'bg-yellow-500' :
                          item._id === 'checked_in' ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(item.count / (stats.stats?.totalBookings || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rooms by Type */}
          <div className="bg-white rounded-2xl card-shadow p-8">
            <h3 className="text-2xl font-bold text-dark mb-6">Rooms by Type</h3>
            <div className="space-y-5">
              {stats?.roomsByType?.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800 capitalize">{item._id}</span>
                      <span className="text-sm font-bold text-primary">{item.count} rooms</span>
                    </div>
                    <div className="h-3 bg-light rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${(item.count / (stats.stats?.totalRooms || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl card-shadow p-8">
          <h3 className="text-2xl font-bold text-dark mb-6">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Guest Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Room</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Check-in Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-100 hover:bg-light transition">
                    <td className="px-6 py-4 text-gray-800">
                      <span className="font-semibold">{booking.customerId?.firstName} {booking.customerId?.lastName}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-semibold text-sm">
                        #{booking.roomNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(booking.checkInDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-secondary">
                      ₹{(booking.finalPrice || booking.totalPrice || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
