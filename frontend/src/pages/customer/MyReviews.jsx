import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/api';
import { FaStar, FaSpinner, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await reviewService.getUserReviews();
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
    if (!window.confirm('Are you sure you want to delete this review?')) {
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

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="section-container">
      <h1 className="text-4xl font-bold mb-8">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="bg-white card-shadow p-8 rounded-lg text-center">
          <p className="text-lg text-gray-600">You haven't written any reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-white card-shadow p-6 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">Room {review.roomId?.roomNumber}</h3>
                  <p className="text-sm text-gray-600">
                    {review.roomId?.type}
                  </p>
                  <p className="text-xs text-gray-400">
                    Posted on {new Date(review.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete Review"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <p className="font-semibold mb-2">{review.title}</p>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
