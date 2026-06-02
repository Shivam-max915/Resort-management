import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService, roomService, serviceService } from '../../services/api';
import { FaArrowLeft, FaSpinner, FaCalendar, FaUser, FaDollarSign, FaWrench, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    type: 'housekeeping',
    title: '',
    description: '',
    priority: 'medium'
  });
  const [isSubmittingService, setIsSubmittingService] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingService.getBookingById(id);
        setBooking(response.data.booking);
      } catch (error) {
        toast.error('Failed to load booking details');
        navigate('/customer/bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    setIsCancelling(true);
    try {
      const response = await bookingService.cancelBooking(id, cancellationReason);
      setBooking(response.data.booking);
      toast.success(`Booking cancelled. Refund: $${response.data.refundAmount}`);
      setShowCancelForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setServiceFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitServiceRequest = async () => {
    if (!serviceFormData.title.trim() || !serviceFormData.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmittingService(true);
    try {
      await serviceService.createRequest({
        bookingId: booking._id,
        roomId: booking.roomId?._id,
        type: serviceFormData.type,
        title: serviceFormData.title,
        description: serviceFormData.description,
        priority: serviceFormData.priority
      });
      toast.success('Service request submitted successfully');
      setShowServiceModal(false);
      setServiceFormData({ type: 'housekeeping', title: '', description: '', priority: 'medium' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit service request');
    } finally {
      setIsSubmittingService(false);
    }
  };

  const handleCheckOut = async () => {
    if (!window.confirm('Are you sure you want to check out now? You will still be charged for the full duration of your booking.')) {
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await bookingService.earlyCheckOut(id);
      setBooking(response.data.booking);
      toast.success('Checked out successfully. We hope you enjoyed your stay!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check out');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="section-container flex justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (!booking) {
    return <div className="section-container py-12">Booking not found</div>;
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    checked_in: 'bg-blue-100 text-blue-800',
    checked_out: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="section-container">
      <Link to="/customer/bookings" className="flex items-center space-x-2 text-primary hover:text-secondary mb-8 transition">
        <FaArrowLeft /> <span>Back to Bookings</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Details */}
        <div className="lg:col-span-2">
          <div className="bg-white card-shadow p-8 rounded-lg mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Booking #{booking._id.slice(0, 8)}</h1>
                <p className="text-gray-600">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-4 py-2 rounded-full font-semibold ${statusColors[booking.status] || statusColors.pending}`}>
                {booking.status.toUpperCase()}
              </span>
            </div>

            {/* Booking Info */}
            <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b">
              <div>
                <p className="text-gray-600 text-sm mb-1">Room Number</p>
                <p className="text-2xl font-bold text-secondary">{booking.roomNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Room Type</p>
                <p className="text-2xl font-bold">{booking.roomId?.type}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1 flex items-center space-x-1">
                  <FaCalendar /> Check-in Date
                </p>
                <p className="text-xl font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1 flex items-center space-x-1">
                  <FaCalendar /> Check-out Date
                </p>
                <p className="text-xl font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Number of Guests</p>
                <p className="text-xl font-semibold">{booking.numberOfGuests}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Number of Nights</p>
                <p className="text-xl font-semibold">{booking.numberOfNights}</p>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="mb-8 pb-8 border-b">
                <h3 className="text-lg font-semibold mb-2">Special Requests</h3>
                <p className="text-gray-700 bg-light p-4 rounded-lg">{booking.specialRequests}</p>
              </div>
            )}

            {/* Guest Info */}
            <div className="bg-light p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <FaUser /> Guest Information
              </h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {booking.guestName}</p>
                <p><strong>Email:</strong> {booking.guestEmail}</p>
                <p><strong>Phone:</strong> {booking.guestPhone}</p>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-white card-shadow p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <FaDollarSign /> Pricing Details
            </h2>
            
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">${booking.roomPrice} × {booking.numberOfNights} nights</span>
                <span className="font-semibold">${booking.totalPrice}</span>
              </div>
              {booking.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${booking.discount}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total Price</span>
              <span className="text-secondary">${booking.finalPrice}</span>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white card-shadow p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-bold mb-6">Actions</h2>

            {booking.status === 'confirmed' && !showCancelForm ? (
              <button
                onClick={() => setShowCancelForm(true)}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Cancel Booking
              </button>
            ) : null}

            {booking.status === 'checked_in' && (
              <>
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition mb-4 flex items-center justify-center gap-2"
                >
                  <FaWrench /> Request Service
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={isCheckingOut}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition mb-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaSignOutAlt /> {isCheckingOut ? 'Checking out...' : 'Check Out Now'}
                </button>
              </>
            )}

            {showCancelForm && (
              <div className="space-y-4">
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Why are you cancelling? (required)"
                  rows="4"
                  className="input-field"
                />
                <button
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
                >
                  {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
                </button>
                <button
                  onClick={() => setShowCancelForm(false)}
                  className="w-full bg-gray-300 text-dark py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Keep Booking
                </button>
              </div>
            )}

            {booking.status === 'checked_out' && (
              <Link
                to="/customer/reviews"
                className="block w-full text-center bg-secondary text-dark py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
              >
                Leave a Review
              </Link>
            )}

            {booking.status === 'cancelled' && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-red-800 mb-2">Booking Cancelled</p>
                <p className="text-sm text-red-700">Refund Amount: ${booking.refundAmount}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Request Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Request Service</h2>
              <button onClick={() => setShowServiceModal(false)} className="text-gray-600 hover:text-gray-800">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Type</label>
                <select
                  name="type"
                  value={serviceFormData.type}
                  onChange={handleServiceInputChange}
                  className="input-field"
                >
                  <option value="room_service">Room Service</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="complaint">Complaint</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={serviceFormData.title}
                  onChange={handleServiceInputChange}
                  placeholder="Brief title of your request"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={serviceFormData.description}
                  onChange={handleServiceInputChange}
                  placeholder="Detailed description of your request"
                  rows="4"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  name="priority"
                  value={serviceFormData.priority}
                  onChange={handleServiceInputChange}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSubmitServiceRequest}
                  disabled={isSubmittingService}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {isSubmittingService ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 bg-gray-300 text-dark px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
