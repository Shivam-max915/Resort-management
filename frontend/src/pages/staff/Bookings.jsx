import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StaffBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getAllBookings();
        setBookings(response.data.bookings);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
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
      <h1 className="text-4xl font-bold mb-8">Bookings</h1>

      <div className="bg-white card-shadow p-6 rounded-lg">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left p-4">Guest Name</th>
              <th className="text-left p-4">Room</th>
              <th className="text-left p-4">Check-in</th>
              <th className="text-left p-4">Check-out</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Phone</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id} className="border-b hover:bg-light">
                <td className="p-4 font-semibold">{booking.guestName}</td>
                <td className="p-4">{booking.roomNumber}</td>
                <td className="p-4">{new Date(booking.checkInDate).toLocaleDateString('en-IN')}</td>
                <td className="p-4">{new Date(booking.checkOutDate).toLocaleDateString('en-IN')}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'checked_out' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4">{booking.guestPhone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffBookings;
