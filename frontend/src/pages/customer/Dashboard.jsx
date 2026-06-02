import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService, bookingService, notificationService } from '../../services/api';
import { useAuthStore } from '../../services/store';
import { FaUser, FaClipboard, FaStar, FaEdit, FaSpinner, FaBell, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CustomerDashboard = () => {
  const { user, updateUser } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, confirmed: 0, completed: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, notificationsRes] = await Promise.all([
          bookingService.getUserBookings(),
          notificationService.getMyNotifications()
        ]);

        const bookings = bookingsRes.data.bookings;
        setRecentBookings(bookings.slice(0, 3));
        setNotifications(notificationsRes.data.notifications);
        
        setStats({
          total: bookings.length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          completed: bookings.filter(b => b.status === 'checked_out').length
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="section-container">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.firstName}! 👋</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Stats Cards */}
        <div className="bg-white card-shadow p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
            <FaClipboard className="text-5xl text-secondary opacity-30" />
          </div>
        </div>

        <div className="bg-white card-shadow p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Confirmed Bookings</p>
              <p className="text-3xl font-bold text-primary">{stats.confirmed}</p>
            </div>
            <FaClipboard className="text-5xl text-secondary opacity-30" />
          </div>
        </div>

        <div className="bg-white card-shadow p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed Stays</p>
              <p className="text-3xl font-bold text-primary">{stats.completed}</p>
            </div>
            <FaStar className="text-5xl text-secondary opacity-30" />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaBell className="text-primary" /> Notifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notifications.filter(n => !n.isRead).map(notification => (
              <div 
                key={notification._id} 
                className={`p-4 rounded-lg border-l-4 card-shadow bg-white flex justify-between items-start ${
                  notification.type === 'feedback_request' ? 'border-secondary' : 'border-primary'
                }`}
              >
                <div>
                  <h3 className="font-bold text-lg">{notification.title}</h3>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  {notification.link && (
                    <Link 
                      to={notification.link} 
                      className="text-primary font-semibold hover:underline"
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      View Details & Feedback →
                    </Link>
                  )}
                </div>
                <button 
                  onClick={() => handleMarkAsRead(notification._id)}
                  className="text-gray-400 hover:text-green-600 transition"
                  title="Mark as read"
                >
                  <FaCheckCircle />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="bg-white card-shadow p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <FaUser /> <span>Profile</span>
            </h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-primary hover:text-secondary transition"
            >
              <FaEdit />
            </button>
          </div>

          {!editMode ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-lg font-semibold">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-lg font-semibold">{user?.phone || 'Not provided'}</p>
              </div>
              {user?.city && (
                <div>
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="text-lg font-semibold">{user?.city}, {user?.state} {user?.zipCode}</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Last Name"
                />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Phone"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Address"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="City"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="State"
                />
              </div>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="input-field"
                placeholder="ZIP Code"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 btn-primary">Save Changes</button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white card-shadow p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
          <div className="space-y-3">
            <Link to="/customer/bookings" className="block p-4 bg-light rounded-lg hover:bg-gray-200 transition font-semibold">
              📅 My Bookings
            </Link>
            <Link to="/customer/history" className="block p-4 bg-light rounded-lg hover:bg-gray-200 transition font-semibold">
              ✅ Booking History
            </Link>
            <Link to="/customer/reviews" className="block p-4 bg-light rounded-lg hover:bg-gray-200 transition font-semibold">
              ⭐ My Reviews
            </Link>
            <Link to="/rooms" className="block p-4 bg-light rounded-lg hover:bg-gray-200 transition font-semibold">
              🏨 Browse Rooms
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white card-shadow p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin text-2xl text-primary" />
            </div>
          ) : recentBookings.length === 0 ? (
            <p className="text-gray-600">No bookings yet. <Link to="/rooms" className="text-primary font-semibold">Start booking!</Link></p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map(booking => (
                <div key={booking._id} className="border-l-4 border-secondary p-3 hover:bg-light transition">
                  <p className="font-semibold">Room {booking.roomNumber}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                  <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-semibold 
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
