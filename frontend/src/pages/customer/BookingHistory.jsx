import React, { useEffect, useState } from 'react';
import { bookingService, reviewService } from '../../services/api';
import { FaSpinner, FaStar, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingService.getUserBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to load booking history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setComment('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment || comment.length < 5) {
      toast.error('Comment must be at least 5 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewService.createReview({
        bookingId: selectedBooking._id,
        roomId: selectedBooking.roomId._id,
        rating,
        comment
      });
      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      fetchBookings(); // Refresh bookings to update reviewed status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
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
    <div className="section-container">
      <h1 className="text-4xl font-bold mb-8">Booking History</h1>

      {bookings.length === 0 ? (
        <div className="bg-white card-shadow p-8 rounded-lg text-center">
          <p className="text-lg text-gray-600">No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white card-shadow p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Room Number</p>
                  <p className="text-xl font-bold">{booking.roomNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-in Date</p>
                  <p className="text-xl font-bold">{new Date(booking.checkInDate).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="text-xl font-bold text-secondary">₹{booking.finalPrice.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'checked_out' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>

                {booking.status === 'checked_out' && !booking.isReviewed && (
                  <button
                    onClick={() => handleOpenReviewModal(booking)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Rate & Review
                  </button>
                )}

                {booking.isReviewed && (
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <FaStar className="text-yellow-400" /> Reviewed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold mb-4">Rate Your Stay</h2>
            <p className="text-gray-600 mb-6">How was your experience in Room {selectedBooking?.roomNumber}?</p>

            <form onSubmit={handleSubmitReview}>
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        name="rating"
                        className="hidden"
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)}
                      />
                      <FaStar
                        className="cursor-pointer transition-colors duration-200"
                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                        size={40}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                      />
                    </label>
                  );
                })}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Your Review</label>
                <textarea
                  className="w-full border rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your stay..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Minimum 5 characters</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
