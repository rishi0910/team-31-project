import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://harvesthub-backend-siy2.onrender.com' 
  : 'http://localhost:5000';

  useEffect(() => {
    const fetchRequests = async () => {
      const token = sessionStorage.getItem('token');
      
      try {
        const res = await axios.get('/api/requests', {
          headers: { 'x-auth-token': token },
        });
        console.log('Requests fetched:', res.data);
        setRequests(res.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        const errorMessage = error.response?.data?.message || 'Error fetching requests';
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    socket.on('newDonation', (donation) => {
      console.log('New donation received via socket:', donation);
    });

    socket.on('newRequest', (request) => {
      console.log('New request received via socket:', request);
      setRequests((prevRequests) => [...prevRequests, request]);
    });

    return () => {
      socket.off('newDonation');
      socket.off('newRequest');
    };
  }, []);

  const handleUpdate = async (requestId, status) => {
    const token = sessionStorage.getItem('token');
    
    try {
      console.log(`Updating request ${requestId} to status: ${status}`);
      
      const response = await axios.put(
        `/api/requests/${requestId}`,
        { status },
        { headers: { 'x-auth-token': token } }
      );

      console.log('Request updated:', response.data);
      alert(`Request ${status} successfully!`);
      setRequests(requests.map((req) => 
        req._id === requestId ? { ...req, status } : req
      ));
    } catch (error) {
      console.error('Error updating request:', error);
      const errorMessage = error.response?.data?.message || 'Error updating request';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-primary">Loading requests...</div>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-3xl font-heading text-primary mb-6 text-center">
          Donation Requests
        </h2>
        <div className="text-center py-12">
          <h3 className="text-xl font-heading text-gray-500 mb-2">No requests yet</h3>
          <p className="text-gray-400">Requests from volunteers will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-heading text-primary mb-6 text-center">
        Donation Requests ({requests.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((request) => (
          <div
            key={request._id}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition border-l-4 border-primary"
          >
            <div className="mb-4">
              <h3 className="text-lg font-heading text-primary mb-2">
                Food: {request.donation?.foodType || 'Unknown'}
              </h3>
              <p className="text-text font-body mb-1">
                <strong>Volunteer:</strong> {request.volunteer?.name || 'Unknown'}
              </p>
              <p className="text-text font-body mb-1">
                <strong>Quantity:</strong> {request.donation?.quantity || 'N/A'} servings
              </p>
              {request.message && (
                <p className="text-text font-body mb-1">
                  <strong>Message:</strong> {request.message}
                </p>
              )}
              <p className="text-text font-body mb-3">
                <strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status.toUpperCase()}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Requested: {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>

            {request.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdate(request._id, 'accepted')}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-body"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleUpdate(request._id, 'rejected')}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-body"
                >
                  Reject
                </button>
              </div>
            )}

            {request.status !== 'pending' && (
              <div className="text-center py-2 text-gray-500">
                Request has been {request.status}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestList;
