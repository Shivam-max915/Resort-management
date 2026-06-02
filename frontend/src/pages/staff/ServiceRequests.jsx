import React, { useEffect, useState } from 'react';
import { FaSpinner, FaCheckCircle, FaClock, FaCheck } from 'react-icons/fa';
import { serviceService } from '../../services/api';
import { toast } from 'react-toastify';

const ServiceRequests = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchServiceRequests();
  }, [filter]);

  const fetchServiceRequests = async () => {
    try {
      setIsLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await serviceService.getAllRequests(params);
      setServiceRequests(response.data.requests);
    } catch (error) {
      toast.error('Failed to load service requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      await serviceService.updateRequestStatus(requestId, 'completed', '');
      toast.success('Request marked as completed');
      fetchServiceRequests();
    } catch (error) {
      toast.error('Failed to complete request');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Service Requests</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['pending', 'in_progress', 'completed', 'all'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {serviceRequests.length === 0 ? (
        <div className="bg-white card-shadow p-8 rounded-lg text-center">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">No service requests found</p>
        </div>
      ) : (
        <div className="bg-white card-shadow p-6 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Guest Name</th>
                  <th className="text-left p-4">Room</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Priority</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map(request => (
                  <tr key={request._id} className="border-b hover:bg-light">
                    <td className="p-4 font-semibold">{request.customerId?.firstName} {request.customerId?.lastName}</td>
                    <td className="p-4">{request.roomId?.roomNumber}</td>
                    <td className="p-4 capitalize">{request.type}</td>
                    <td className="p-4">{request.title}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[request.status] || statusColors.pending}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 capitalize">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleCompleteRequest(request._id)}
                          className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-1"
                        >
                          <FaCheck /> Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
