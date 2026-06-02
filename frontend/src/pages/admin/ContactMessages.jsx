import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { FaEnvelope, FaSpinner, FaTrash, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await adminService.getAllContacts(params);
      setMessages(response.data.contacts);
    } catch (error) {
      toast.error('Failed to load contact messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkResolved = async (id) => {
    try {
      await adminService.updateContactStatus(id, 'resolved');
      toast.success('Message marked as resolved');
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await adminService.deleteContact(id);
      toast.success('Message deleted successfully');
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete message');
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
        <h1 className="text-4xl font-bold">Customer Messages</h1>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['all', 'new', 'read', 'resolved'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white text-primary border border-primary hover:bg-light'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {messages.length === 0 ? (
        <div className="bg-white card-shadow p-8 rounded-lg text-center">
          <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-600">No messages</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-4">
            {messages.map(msg => (
              <div
                key={msg._id}
                onClick={() => setSelectedMessage(msg)}
                className={`bg-white card-shadow p-4 rounded-lg cursor-pointer transition ${
                  selectedMessage?._id === msg._id ? 'border-2 border-primary' : ''
                } ${msg.status === 'new' ? 'border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{msg.name}</h3>
                    <p className="text-sm text-gray-600">{msg.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    msg.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    msg.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {msg.status.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-semibold text-md mb-1">{msg.subject}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{msg.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            ))}
          </div>

          {/* Message Details */}
          {selectedMessage && (
            <div className="bg-white card-shadow p-6 rounded-lg h-fit">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-bold text-lg">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subject</p>
                  <p className="font-semibold">{selectedMessage.subject}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Message</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-400">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex gap-2 mt-6">
                  {selectedMessage.status !== 'resolved' && (
                    <button
                      onClick={() => handleMarkResolved(selectedMessage._id)}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <FaCheck /> Mark Resolved
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
