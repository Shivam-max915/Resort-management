import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/api';
import { FaStar, FaTrash, FaSpinner, FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await reviewService.getAllReviews();
      setReviews(response.data.reviews);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      await reviewService.deleteReview(id);
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customerId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customerId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.roomId?.roomNumber?.toString().includes(searchTerm);
    
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;

    return matchesSearch && matchesRating;
  });

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-dark">Review Management</h1>
          <p className="text-gray-600">Monitor and manage all customer reviews</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg card-shadow">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-2xl font-bold text-primary">{reviews.length}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white card-shadow p-6 rounded-xl mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest, room, or content..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <FaFilter className="text-gray-400" />
          <select
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl card-shadow">
          <p className="text-xl text-gray-500 italic">No reviews found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-white card-shadow p-6 rounded-xl relative group hover:shadow-xl transition-all">
              <button
                onClick={() => handleDeleteReview(review._id)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Review"
              >
                <FaTrash size={18} />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {review.customerId?.firstName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-dark">{review.customerId?.firstName} {review.customerId?.lastName}</h3>
                  <p className="text-sm text-gray-500">{review.customerId?.email}</p>
                </div>
              </div>

              <div className="bg-light p-3 rounded-lg mb-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Room</p>
                  <p className="font-bold text-primary">#{review.roomId?.roomNumber} - {review.roomId?.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold">Rating</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'} size={14} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-dark mb-1">{review.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="text-xs text-gray-400 pt-4 border-t">
                Posted on {new Date(review.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
