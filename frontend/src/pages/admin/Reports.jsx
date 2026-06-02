import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { FaChartBar, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-12">Reports & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Report */}
        <div className="bg-white card-shadow p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaChartBar /> Revenue Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-light rounded">
              <span>Total Revenue</span>
              <span className="text-2xl font-bold text-primary">₹{(stats?.stats?.totalRevenue || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-light rounded">
              <span>Average Booking Value</span>
              <span className="text-xl font-bold">₹{stats?.stats?.totalBookings > 0 ? Math.round((stats.stats.totalRevenue / stats.stats.totalBookings)).toLocaleString('en-IN') : 0}</span>
            </div>
          </div>
        </div>

        {/* Occupancy Report */}
        <div className="bg-white card-shadow p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaChartBar /> Occupancy Report
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-light rounded">
              <span>Occupancy Rate</span>
              <span className="text-2xl font-bold text-primary">{stats?.stats?.occupancyRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-light rounded">
              <span>Rooms Available</span>
              <span className="text-xl font-bold">{stats?.stats?.totalRooms || 0}</span>
            </div>
          </div>
        </div>

        {/* Bookings by Status */}
        <div className="bg-white card-shadow p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-6">Bookings by Status</h3>
          <div className="space-y-3">
            {stats?.bookingsByStatus?.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="capitalize font-semibold">{item._id}</span>
                <span className="text-lg font-bold text-primary">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rooms by Type */}
        <div className="bg-white card-shadow p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-6">Rooms by Type</h3>
          <div className="space-y-3">
            {stats?.roomsByType?.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="capitalize font-semibold">{item._id}</span>
                <span className="text-lg font-bold text-primary">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
