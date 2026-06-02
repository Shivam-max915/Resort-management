import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roomService } from '../services/api';
import { FaFilter, FaSpinner, FaStar, FaCheckCircle, FaWifi, FaTv, FaSnowflake } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RoomsPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    checkIn: '',
    checkOut: ''
  });
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch rooms with filters
  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await roomService.getAllRooms(filters);
      setRooms(response.data.rooms);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchRooms();
  };

  const roomTypes = ['single', 'double', 'suite', 'deluxe'];

  const getRoomEmoji = (type) => {
    const emojis = {
      'single': '🛏️',
      'double': '🛏️🛏️',
      'deluxe': '✨',
      'suite': '👑'
    };
    return emojis[type] || '🏨';
  };

  return (
    <div className="bg-light min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">Discover Our Rooms</h1>
          <p className="text-xl text-gray-100">Find the perfect accommodation for your stay</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Advanced Filters */}
        <div className="bg-white rounded-2xl card-shadow p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FaFilter className="text-primary text-2xl" />
            <h2 className="text-2xl font-bold text-dark">Refine Your Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Room Type */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Room Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full input-field"
              >
                <option value="">All Types</option>
                {roomTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="₹ Min"
                className="w-full input-field"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="₹ Max"
                className="w-full input-field"
              />
            </div>

            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Check-in</label>
              <input
                type="date"
                name="checkIn"
                value={filters.checkIn}
                onChange={handleFilterChange}
                className="w-full input-field"
              />
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Check-out</label>
              <input
                type="date"
                name="checkOut"
                value={filters.checkOut}
                onChange={handleFilterChange}
                className="w-full input-field"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="bg-secondary text-dark font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all hover:shadow-lg"
          >
            Search Rooms
          </button>
        </div>

        {/* Rooms Grid */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <FaSpinner className="animate-spin text-5xl text-primary mb-4" />
            <p className="text-gray-600 text-lg">Loading available rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl card-shadow">
            <p className="text-2xl text-gray-600 mb-4">✨ No rooms available</p>
            <p className="text-gray-500">Try adjusting your filters or contact us for special requests</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6 text-lg">
              Showing <span className="font-bold text-primary">{rooms.length}</span> available rooms
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {rooms.map((room) => (
                <div 
                  key={room._id} 
                  className="group bg-white rounded-2xl card-shadow overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Room Visual */}
                  <div className="relative h-56 bg-gradient-to-br from-primary via-secondary to-dark flex items-center justify-center overflow-hidden">
                    <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                      {getRoomEmoji(room.type)}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="inline-block bg-secondary text-dark px-4 py-2 rounded-full font-bold text-sm">
                        {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                      </span>
                    </div>
                    {room.status === 'available' && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <FaCheckCircle /> Available
                      </div>
                    )}
                  </div>

                  {/* Room Info */}
                  <div className="p-6">
                      <h3 className="text-2xl font-bold text-dark group-hover:text-primary transition text-center mb-1">
                        Room {room.roomNumber}
                      </h3>
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.round(room.avgRating || 0) ? 'fill-current' : 'text-gray-300'} size={14} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 font-semibold">
                          ({room.reviewCount || 0})
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm text-center">Floor {room.floor}</p>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-semibold">👥</span> {room.capacity} guests
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-semibold">🛏️</span> {room.bedType}
                      </div>
                    </div>

                    {/* Amenities Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                        <FaWifi size={12} /> WiFi
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                        <FaSnowflake size={12} /> AC
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                        <FaTv size={12} /> TV
                      </span>
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-light p-4 rounded-xl mb-4">
                      <p className="text-gray-600 text-sm mb-1">Starting from</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-secondary">
                          ₹{room.basePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-gray-500 text-sm">/night</span>
                      </div>
                      {room.discount > 0 && (
                        <p className="text-sm text-green-600 font-semibold mt-2">
                          💰 Save {room.discount}% on longer stays
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/rooms/${room._id}`}
                      className="w-full block text-center bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition-all hover:shadow-lg"
                    >
                      View Details & Book →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
