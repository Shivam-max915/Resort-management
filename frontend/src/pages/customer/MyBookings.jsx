import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/api';
import { FaCalendar, FaMapPin, FaUser, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getUserBookings();
        setBookings(response.data.bookings);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    checked_in: 'bg-blue-100 text-blue-800',
    checked_out: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="section-container">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['all', 'pending', 'confirmed', 'checked_in', 'checked_out'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white text-primary border-2 border-primary'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">No bookings found</p>
          <Link to="/rooms" className="btn-primary inline-block">Browse Rooms</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking._id} className="bg-white card-shadow p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Room</p>
                  <p className="text-2xl font-bold">{booking.roomNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm flex items-center space-x-1">
                    <FaCalendar /> Check-in
                  </p>
                  <p className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm flex items-center space-x-1">
                    <FaCalendar /> Check-out
                  </p>
                  <p className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Price</p>
                  <p className="text-2xl font-bold text-secondary">₹{booking.finalPrice.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[booking.status] || statusColors.pending}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                </span>
                <div className="space-x-2">
                  <Link
                    to={`/customer/bookings/${booking._id}`}
                    className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
                  >
                    View Details
                  </Link>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => toast.info('Cancellation feature available on details page')}
                      className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-opacity-90 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
