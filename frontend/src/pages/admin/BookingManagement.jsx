import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';
import { FaSpinner, FaCheck, FaTimes, FaTrash, FaFileInvoice, FaPrint } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingService.getAllBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBill = async (bookingId) => {
    try {
      const response = await bookingService.generateBill(bookingId);
      toast.success('Bill generated and notification sent');
      setSelectedBooking(response.data.booking);
      setShowBillModal(true);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate bill');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'confirmed');
      toast.success('Booking confirmed');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm booking');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId, 'Admin cancelled');
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await bookingService.deleteBooking(bookingId);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete booking');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Booking Management</h1>

      <div className="bg-white card-shadow p-6 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left p-4">Guest Name</th>
              <th className="text-left p-4">Room</th>
              <th className="text-left p-4">Check-in</th>
              <th className="text-left p-4">Check-out</th>
              <th className="text-left p-4">Total Price</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id} className="border-b hover:bg-light">
                <td className="p-4 font-semibold">{booking.guestName}</td>
                <td className="p-4">{booking.roomNumber}</td>
                <td className="p-4">{new Date(booking.checkInDate).toLocaleDateString('en-IN')}</td>
                <td className="p-4">{new Date(booking.checkOutDate).toLocaleDateString('en-IN')}</td>
                <td className="p-4 font-semibold">₹{booking.finalPrice.toLocaleString('en-IN')}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'checked_out' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleConfirmBooking(booking._id)}
                        className="text-green-600 hover:text-green-800 cursor-pointer"
                        title="Confirm Booking"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Cancel Booking"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  {booking.status !== 'checked_out' && booking.status !== 'cancelled' && booking.status !== 'pending' && (
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      title="Delete Booking"
                    >
                      <FaTrash />
                    </button>
                  )}
                  {booking.status === 'checked_out' && !booking.billGenerated && (
                    <button
                      onClick={() => handleGenerateBill(booking._id)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      title="Generate Bill"
                    >
                      <FaFileInvoice />
                    </button>
                  )}
                  {booking.billGenerated && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowBillModal(true);
                      }}
                      className="text-primary hover:text-opacity-80 cursor-pointer"
                      title="View Bill"
                    >
                      <FaFileInvoice />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill Receipt Modal */}
      {showBillModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 print:shadow-none print:w-full">
            <div className="flex justify-between items-center mb-6 print:hidden">
              <h2 className="text-2xl font-bold">Billing Receipt</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrint}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90"
                >
                  <FaPrint /> Print
                </button>
                <button 
                  onClick={() => setShowBillModal(false)} 
                  className="text-gray-600 hover:text-gray-800 p-2"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div id="receipt-content" className="border p-6 rounded-lg">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary">LUXURY RESORT</h1>
                <p className="text-gray-600">123 Paradise Road, Beach City</p>
                <p className="text-gray-600">Phone: +91 98765 43210</p>
                <div className="border-b-2 border-primary w-24 mx-auto mt-2"></div>
              </div>

              <div className="flex justify-between mb-8">
                <div>
                  <h3 className="font-bold text-gray-700 uppercase text-sm mb-1">Bill To:</h3>
                  <p className="font-semibold">{selectedBooking.guestName}</p>
                  <p className="text-gray-600">{selectedBooking.guestEmail}</p>
                  <p className="text-gray-600">{selectedBooking.guestPhone}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-gray-700 uppercase text-sm mb-1">Receipt Info:</h3>
                  <p><span className="font-semibold">Receipt #:</span> {selectedBooking._id.slice(-8).toUpperCase()}</p>
                  <p><span className="font-semibold">Date:</span> {new Date(selectedBooking.billDate || Date.now()).toLocaleDateString('en-IN')}</p>
                  <p><span className="font-semibold">Room:</span> {selectedBooking.roomNumber}</p>
                </div>
              </div>

              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-2">Description</th>
                    <th className="text-center py-2">Nights</th>
                    <th className="text-right py-2">Price/Night</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4">
                      <p className="font-semibold">Room Stay</p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedBooking.checkInDate).toLocaleDateString()} - {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="text-center py-4">{selectedBooking.numberOfNights}</td>
                    <td className="text-right py-4">₹{selectedBooking.roomPrice.toLocaleString()}</td>
                    <td className="text-right py-4">₹{selectedBooking.totalPrice.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>₹{selectedBooking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount:</span>
                    <span>-₹{selectedBooking.discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2 text-primary">
                    <span>Total Amount:</span>
                    <span>₹{selectedBooking.finalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center text-gray-500 text-sm italic">
                <p>Thank you for choosing Luxury Resort!</p>
                <p>Please share your feedback with us.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
