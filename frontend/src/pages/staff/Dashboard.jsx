import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';
import { FaCalendar, FaClipboard, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StaffDashboard = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [checkOuts, setCheckOuts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await bookingService.getTodayCheckInOut();
        setCheckIns(response.data.checkIns);
        setCheckOuts(response.data.checkOuts);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Staff Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white card-shadow p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">Today's Check-ins</h3>
          <p className="text-4xl font-bold">{checkIns.length}</p>
        </div>
        <div className="bg-white card-shadow p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Today's Check-outs</h3>
          <p className="text-4xl font-bold">{checkOuts.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Check-ins */}
          <div className="bg-white card-shadow p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <FaCalendar /> Check-ins
            </h2>
            {checkIns.length === 0 ? (
              <p className="text-gray-600">No check-ins today</p>
            ) : (
              <div className="space-y-4">
                {checkIns.map(booking => (
                  <div key={booking._id} className="border-l-4 border-blue-500 p-4 bg-blue-50 rounded flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{booking.customerId.firstName} {booking.customerId.lastName}</p>
                      <p className="text-sm text-gray-600">Room: {booking.roomNumber}</p>
                      <p className="text-sm text-gray-600">Phone: {booking.customerId.phone}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      booking.status === 'confirmed' ? 'bg-yellow-200 text-yellow-800' :
                      booking.status === 'checked_in' ? 'bg-green-200 text-green-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-outs */}
          <div className="bg-white card-shadow p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <FaCalendar /> Check-outs
            </h2>
            {checkOuts.length === 0 ? (
              <p className="text-gray-600">No check-outs today</p>
            ) : (
              <div className="space-y-4">
                {checkOuts.map(booking => (
                  <div key={booking._id} className="border-l-4 border-red-500 p-4 bg-red-50 rounded flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{booking.customerId.firstName} {booking.customerId.lastName}</p>
                      <p className="text-sm text-gray-600">Room: {booking.roomNumber}</p>
                      <p className="text-sm text-gray-600">Phone: {booking.customerId.phone}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      booking.status === 'checked_in' ? 'bg-blue-200 text-blue-800' :
                      booking.status === 'checked_out' ? 'bg-purple-200 text-purple-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
