import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService, bookingService, reviewService } from '../services/api';
import { useAuthStore } from '../services/store';
import { FaStar, FaWifi, FaTv, FaSwimmingPool, FaSpinner, FaQuoteLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await roomService.getRoomById(id);
        setRoom(response.data.room);
      } catch (error) {
        toast.error('Failed to load room details');
        navigate('/rooms');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setIsReviewsLoading(true);
        const response = await reviewService.getRoomReviews(id);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Failed to load reviews');
      } finally {
        setIsReviewsLoading(false);
      }
    };

    fetchRoom();
    fetchReviews();
  }, [id, navigate]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value) : value
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.warning('Please login to make a booking');
      navigate('/login');
      return;
    }

    setIsBooking(true);
    try {
      const response = await bookingService.createBooking({
        roomId: id,
        ...bookingData
      });
      toast.success('Booking created successfully!');
      navigate('/customer/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="section-container flex justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (!room) {
    return <div className="section-container py-12 text-center">Room not found</div>;
  }

  return (
    <div className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Details */}
        <div className="lg:col-span-2">
          {/* Room Image */}
          <div className="bg-gradient-primary h-96 rounded-lg flex items-center justify-center text-9xl mb-6">
            🏨
          </div>

          {/* Room Info */}
          <div className="bg-white card-shadow p-6 rounded-lg mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Room {room.roomNumber}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(room.avgRating || 0) ? 'fill-current' : 'text-gray-200'} size={16} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-semibold">
                    ({room.reviewCount || 0} reviews)
                  </span>
                </div>
                <p className="text-gray-600">Floor {room.floor} • Type: {room.type}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-secondary">₹{room.basePrice.toLocaleString('en-IN')}</div>
                <p className="text-gray-600">/night</p>
              </div>
            </div>

            {room.discount > 0 && (
              <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
                Save {room.discount}% on your stay!
              </div>
            )}

            <p className="text-gray-700 mb-6">{room.description}</p>

            {/* Amenities */}
            <h3 className="text-2xl font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {room.amenities?.hasWifi && <div className="flex items-center space-x-2"><FaWifi /> <span>Free WiFi</span></div>}
              {room.amenities?.hasAC && <div className="flex items-center space-x-2"><FaStar /> <span>Air Conditioning</span></div>}
              {room.amenities?.hasTV && <div className="flex items-center space-x-2"><FaTv /> <span>Smart TV</span></div>}
              {room.amenities?.hasBalcony && <div className="flex items-center space-x-2"><FaSwimmingPool /> <span>Balcony</span></div>}
              {room.amenities?.hasJacuzzi && <div className="flex items-center space-x-2"><FaSwimmingPool /> <span>Jacuzzi</span></div>}
              {room.amenities?.hasKitchen && <div className="flex items-center space-x-2"><FaStar /> <span>Kitchenette</span></div>}
              {room.amenities?.hasMinibar && <div className="flex items-center space-x-2"><FaStar /> <span>Mini Bar</span></div>}
              {room.amenities?.hasSafeBox && <div className="flex items-center space-x-2"><FaStar /> <span>Safe Box</span></div>}
            </div>

            {/* Room Capacity */}
            <div className="bg-light p-4 rounded-lg">
              <p><strong>Capacity:</strong> {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</p>
              <p><strong>Bed Type:</strong> {room.bedType.toUpperCase()}</p>
              <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{room.status}</span></p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white card-shadow p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <FaStar className="text-yellow-400" /> 
              Guest Reviews ({reviews.length})
            </h2>

            {isReviewsLoading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-3xl text-primary" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-lg italic">No reviews yet for this room. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {review.customerId?.firstName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-dark">{review.customerId?.firstName} {review.customerId?.lastName}</p>
                          <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'} size={18} />
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative pl-8 italic text-gray-700">
                      <FaQuoteLeft className="absolute left-0 top-0 text-gray-200 text-2xl" />
                      <h4 className="font-bold mb-2 text-dark">{review.title}</h4>
                      <p className="leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white card-shadow p-6 rounded-lg sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Book This Room</h2>

            <form onSubmit={handleBooking} className="space-y-4">
              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Check-in Date</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={bookingData.checkInDate}
                  onChange={handleBookingChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Check-out Date</label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={bookingData.checkOutDate}
                  onChange={handleBookingChange}
                  min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium mb-2">Number of Guests</label>
                <select
                  name="numberOfGuests"
                  value={bookingData.numberOfGuests}
                  onChange={handleBookingChange}
                  className="input-field"
                >
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                <textarea
                  name="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={handleBookingChange}
                  placeholder="Any special requests?"
                  rows="3"
                  className="input-field"
                />
              </div>

              {/* Total Price */}
              {bookingData.checkInDate && bookingData.checkOutDate && (
                <div className="bg-light p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Estimated Total:</p>
                  <p className="text-2xl font-bold text-secondary">
                    ₹{(room.basePrice * Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))).toLocaleString('en-IN')}
                  </p>
                </div>
              )}

              {/* Book Button */}
              <button
                type="submit"
                disabled={isBooking || !isAuthenticated}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isBooking ? 'Processing...' : isAuthenticated ? 'Book Now' : 'Login to Book'}
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 text-center">Please login to make a booking</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
