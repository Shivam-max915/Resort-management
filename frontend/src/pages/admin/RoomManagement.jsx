import React, { useEffect, useState } from 'react';
import { roomService } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    roomNumber: '',
    type: '',
    capacity: '',
    basePrice: '',
    weekendPrice: '',
    discount: '',
    status: ''
  });
  const [addFormData, setAddFormData] = useState({
    roomNumber: '',
    type: '',
    floor: '',
    capacity: '',
    bedType: 'queen',
    basePrice: '',
    amenities: {},
    description: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await roomService.getAllRooms();
      setRooms(response.data.rooms);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room._id);
    setEditFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity,
      basePrice: room.basePrice,
      weekendPrice: room.weekendPrice || '',
      discount: room.discount || 0,
      status: room.status || 'available'
    });
  };

  const handleCloseEdit = () => {
    setEditingRoom(null);
    setEditFormData({
      roomNumber: '',
      type: '',
      capacity: '',
      basePrice: '',
      weekendPrice: '',
      discount: '',
      status: ''
    });
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setAddFormData({
      roomNumber: '',
      type: '',
      floor: '',
      capacity: '',
      bedType: 'queen',
      basePrice: '',
      amenities: {},
      description: ''
    });
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddFormData({
      roomNumber: '',
      type: '',
      floor: '',
      capacity: '',
      bedType: 'queen',
      basePrice: '',
      amenities: {},
      description: ''
    });
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateAddForm = () => {
    if (!addFormData.roomNumber || addFormData.roomNumber.trim() === '') {
      toast.error('Room number is required');
      return false;
    }
    if (!addFormData.type) {
      toast.error('Room type is required');
      return false;
    }
    if (!addFormData.floor || addFormData.floor === '') {
      toast.error('Floor is required');
      return false;
    }
    if (!addFormData.capacity || parseInt(addFormData.capacity) <= 0) {
      toast.error('Valid capacity is required');
      return false;
    }
    if (!addFormData.basePrice || parseFloat(addFormData.basePrice) <= 0) {
      toast.error('Valid base price is required');
      return false;
    }
    // Check if room number already exists
    if (rooms.some(r => r.roomNumber === addFormData.roomNumber)) {
      toast.error('Room number already exists');
      return false;
    }
    return true;
  };

  const handleAddRoom = async () => {
    if (!validateAddForm()) return;

    try {
      const payload = {
        ...addFormData,
        floor: parseInt(addFormData.floor),
        capacity: parseInt(addFormData.capacity),
        basePrice: parseFloat(addFormData.basePrice)
      };
      
      await roomService.createRoom(payload);
      toast.success('Room added successfully!');
      fetchRooms();
      handleCloseAddModal();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add room';
      toast.error(errorMsg);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingRoom) return;

    try {
      const payload = {
        ...editFormData,
        capacity: parseInt(editFormData.capacity),
        basePrice: parseFloat(editFormData.basePrice),
        weekendPrice: editFormData.weekendPrice ? parseFloat(editFormData.weekendPrice) : undefined,
        discount: editFormData.discount ? parseInt(editFormData.discount) : 0
      };
      
      await roomService.updateRoom(editingRoom, payload);
      toast.success('Room updated successfully');
      fetchRooms();
      handleCloseEdit();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update room');
    }
  };

  const handleDelete = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete room ${roomNumber}?`)) {
      return;
    }

    try {
      await roomService.deleteRoom(roomId);
      setRooms(rooms.filter(r => r._id !== roomId));
      toast.success('Room deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Room Management</h1>
        <button 
          onClick={handleOpenAddModal}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Room
        </button>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add New Room</h2>
              <button onClick={handleCloseAddModal} className="text-gray-600 hover:text-gray-800">
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Room Number *</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={addFormData.roomNumber}
                  onChange={handleAddInputChange}
                  placeholder="e.g., 101"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Floor *</label>
                <input
                  type="number"
                  name="floor"
                  value={addFormData.floor}
                  onChange={handleAddInputChange}
                  placeholder="e.g., 1"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Room Type *</label>
                <select
                  name="type"
                  value={addFormData.type}
                  onChange={handleAddInputChange}
                  className="input-field w-full"
                >
                  <option value="">Select Type</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  value={addFormData.capacity}
                  onChange={handleAddInputChange}
                  placeholder="e.g., 2"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bed Type</label>
                <select
                  name="bedType"
                  value={addFormData.bedType}
                  onChange={handleAddInputChange}
                  className="input-field w-full"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="queen">Queen</option>
                  <option value="king">King</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Base Price (₹) *</label>
                <input
                  type="number"
                  name="basePrice"
                  value={addFormData.basePrice}
                  onChange={handleAddInputChange}
                  placeholder="e.g., 5000"
                  className="input-field w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={addFormData.description}
                  onChange={handleAddInputChange}
                  placeholder="Room description..."
                  className="input-field w-full h-20"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddRoom}
                className="flex-1 btn-primary"
              >
                Add Room
              </button>
              <button
                onClick={handleCloseAddModal}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Room</h2>
              <button onClick={handleCloseEdit} className="text-gray-600 hover:text-gray-800">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={editFormData.roomNumber}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={editFormData.type}
                  onChange={handleEditInputChange}
                  className="input-field"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={editFormData.capacity}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  name="basePrice"
                  value={editFormData.basePrice}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Weekend Price (₹)</label>
                <input
                  type="number"
                  name="weekendPrice"
                  value={editFormData.weekendPrice}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={editFormData.discount}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditInputChange}
                  className="input-field"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 btn-primary"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCloseEdit}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white card-shadow p-6 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left p-4">Room Number</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Capacity</th>
              <th className="text-left p-4">Base Price</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id} className="border-b hover:bg-light">
                <td className="p-4 font-semibold">{room.roomNumber}</td>
                <td className="p-4 capitalize">{room.type}</td>
                <td className="p-4">{room.capacity}</td>
                <td className="p-4">₹{room.basePrice.toLocaleString('en-IN')}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    room.status === 'available' ? 'bg-green-100 text-green-800' :
                    room.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                    room.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button 
                    onClick={() => handleEdit(room)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDelete(room._id, room.roomNumber)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Room</h2>
              <button onClick={handleCloseEdit} className="text-gray-600 hover:text-gray-800">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={editFormData.roomNumber}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={editFormData.type}
                  onChange={handleEditInputChange}
                  className="input-field"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={editFormData.capacity}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  name="basePrice"
                  value={editFormData.basePrice}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Weekend Price (₹)</label>
                <input
                  type="number"
                  name="weekendPrice"
                  value={editFormData.weekendPrice}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={editFormData.discount}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditInputChange}
                  className="input-field"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 btn-primary"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCloseEdit}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
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

export default RoomManagement;
