import React, { useEffect, useState } from 'react';
import { adminService, userService } from '../../services/api';
import { FaEdit, FaTrash, FaSpinner, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
    setEditFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: ''
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      await userService.updateUser(editingUser, editFormData);
      toast.success('User updated successfully');
      fetchUsers();
      handleCloseEdit();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user ${userName}?`)) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
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
      <h1 className="text-4xl font-bold mb-8">User Management</h1>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit User</h2>
              <button onClick={handleCloseEdit} className="text-gray-600 hover:text-gray-800">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  className="input-field"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditInputChange}
                  className="input-field"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
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
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b hover:bg-light">
                <td className="p-4 font-semibold">{user.firstName} {user.lastName}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 capitalize"><span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{user.role}</span></td>
                <td className="p-4">{user.phone || '-'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button 
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
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
    </div>
  );
};

export default UserManagement;
