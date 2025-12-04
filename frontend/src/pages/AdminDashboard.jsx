import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://harvesthub-backend-siy2.onrender.com' 
  : 'http://localhost:5000';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
    socket.on('requestStatusUpdated', (updatedRequest) => {
      console.log('Real-time request update received:', updatedRequest);
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request._id === updatedRequest._id ? updatedRequest : request
        )
      );
    });

    socket.on('newRequest', (newRequest) => {
      console.log('New request received:', newRequest);
      setRequests(prevRequests => [...prevRequests, newRequest]);
    });

    return () => {
      socket.off('requestStatusUpdated');
      socket.off('newRequest');
    };
  }, [token]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/requests', {
        headers: { 'x-auth-token': token }
      });
      console.log('Fetched requests:', res.data);
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, status) => {
    try {
      console.log(`Updating request ${requestId} to status: ${status}`);
      
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === requestId 
            ? { ...request, status, updating: true }
            : request
        )
      );

      const res = await axios.put(`/api/requests/${requestId}`, { status }, {
        headers: { 'x-auth-token': token }
      });

      console.log('Request updated successfully:', res.data);
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === requestId 
            ? { ...res.data, updating: false }
            : request
        )
      );
      socket.emit('requestStatusUpdated', res.data);

      alert(`Request ${status} successfully!`);
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Error updating request. Please try again.');
      fetchRequests();
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white py-12 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-xl text-primary">Loading requests...</p>
      </div>
    </div>
  );

  if (!requests.length) return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-8 text-center">Admin Dashboard</h1>
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <p className="text-xl text-gray-600">No requests yet.</p>
          <p className="text-gray-500 mt-2">Requests will appear here when volunteers submit pickup requests.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-8 text-center">Admin Dashboard</h1>
        <div className="mb-6 text-center">
          <button
            onClick={fetchRequests}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 transition"
          >
            Refresh Requests
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div key={request._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-heading text-primary mb-2">
                  Donation: {request.donation?.foodType || 'N/A'}
                </h3>
                <p className="text-text">
                  <strong>Quantity:</strong> {request.donation?.quantity || 'N/A'}
                </p>
                <p className="text-text">
                  <strong>Volunteer:</strong> {request.volunteer?.name || 'N/A'}
                </p>
                <p className="text-text">
                  <strong>Volunteer Email:</strong> {request.volunteer?.email || 'N/A'}
                </p>
                <p className="text-text">
                  <strong>Message:</strong> {request.message || 'No message'}
                </p>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusChange(request._id, 'accepted')}
                  disabled={request.status !== 'pending' || request.updating}
                  className={`flex-1 px-4 py-2 rounded font-semibold transition ${
                    request.status === 'accepted' 
                      ? 'bg-green-500 text-white cursor-not-allowed opacity-75' 
                      : request.status !== 'pending'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : request.updating
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-opacity-80 hover:scale-105'
                  }`}
                >
                  {request.updating && request.status !== 'accepted' ? 'Accepting...' : 
                   request.status === 'accepted' ? '✓ Accepted' : 'Accept'}
                </button>
                
                <button
                  onClick={() => handleStatusChange(request._id, 'rejected')}
                  disabled={request.status !== 'pending' || request.updating}
                  className={`flex-1 px-4 py-2 rounded font-semibold transition ${
                    request.status === 'rejected' 
                      ? 'bg-red-500 text-white cursor-not-allowed opacity-75' 
                      : request.status !== 'pending'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : request.updating
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-opacity-80 hover:scale-105'
                  }`}
                >
                  {request.updating && request.status !== 'rejected' ? 'Rejecting...' : 
                   request.status === 'rejected' ? '✗ Rejected' : 'Reject'}
                </button>
              </div>
              
              {request.updating && (
                <div className="mt-2 text-center">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-gray-600">Updating...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
