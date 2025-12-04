import React, { useState, useEffect, useContext } from 'react';
import { FaUtensils, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import socket from '../socket';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://harvesthub-backend-siy2.onrender.com' 
  : 'http://localhost:5000';

const DonationList = ({ role }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedDonations, setRequestedDonations] = useState(new Set());
  const { user } = useContext(AuthContext);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchDonations();
    socket.on('newDonation', (newDonation) => {
      console.log('New donation received:', newDonation);
      if (role === 'volunteer') {
        setDonations(prevDonations => [newDonation, ...prevDonations]);
      } else if (role === 'donor' && newDonation.donor === user?.id) {
        setDonations(prevDonations => [newDonation, ...prevDonations]);
      }
    });

    socket.on('donationStatusUpdated', (updatedDonation) => {
      console.log('Donation status updated:', updatedDonation);
      setDonations(prevDonations =>
        prevDonations.map(donation =>
          donation._id === updatedDonation._id ? updatedDonation : donation
        )
      );
    });

    socket.on('requestStatusUpdated', (updatedRequest) => {
      console.log('Request status updated:', updatedRequest);
      if (updatedRequest.status === 'accepted') {
        setDonations(prevDonations =>
          prevDonations.map(donation =>
            donation._id === updatedRequest.donation 
              ? { ...donation, status: 'claimed', volunteer: updatedRequest.volunteer }
              : donation
          )
        );
      }
    });

    return () => {
      socket.off('newDonation');
      socket.off('donationStatusUpdated');
      socket.off('requestStatusUpdated');
    };
  }, [role, user?.id, token]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      let url = '/api/donations/my-donations';
      
      if (role === 'volunteer') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const res = await axios.get(`/api/donations/nearby?latitude=${latitude}&longitude=${longitude}`, {
                  headers: { 'x-auth-token': token }
                });
                setDonations(res.data);
                const storedRequests = JSON.parse(localStorage.getItem('requestedDonations') || '[]');
                setRequestedDonations(new Set(storedRequests));
              } catch (error) {
                console.error('Error fetching nearby donations:', error);
              } finally {
                setLoading(false);
              }
            },
            (error) => {
              console.error('Geolocation error:', error);
              fetchDonationsWithoutLocation();
            }
          );
        } else {
          fetchDonationsWithoutLocation();
        }
      } else {
        const res = await axios.get(url, {
          headers: { 'x-auth-token': token }
        });
        setDonations(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      setLoading(false);
    }
  };

  const fetchDonationsWithoutLocation = async () => {
    try {
      const res = await axios.get('/api/donations/all-available', {
        headers: { 'x-auth-token': token }
      });
      setDonations(res.data);
      
      const storedRequests = JSON.parse(localStorage.getItem('requestedDonations') || '[]');
      setRequestedDonations(new Set(storedRequests));
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (donationId) => {
    try {
      console.log(`Requesting pickup for donation: ${donationId}`);
      setRequestedDonations(prev => new Set([...prev, donationId]));
      
      const res = await axios.post('/api/requests', { 
        donationId,
        message: 'Request for pickup' 
      }, {
        headers: { 'x-auth-token': token }
      });

      console.log('Request submitted successfully:', res.data);
      
      const updatedRequests = [...requestedDonations, donationId];
      localStorage.setItem('requestedDonations', JSON.stringify(updatedRequests));
      socket.emit('newRequest', res.data);
      
      alert('Pickup request submitted successfully!');
    } catch (error) {
      console.error('Error requesting pickup:', error);
      setRequestedDonations(prev => {
        const newSet = new Set(prev);
        newSet.delete(donationId);
        return newSet;
      });
      
      alert('Error submitting request. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isRequested = (donationId) => {
    return requestedDonations.has(donationId);
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg text-primary">Loading donations...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-heading text-primary text-center flex-1">
          {role === 'donor' ? 'My Donations' : 'Available Donations'}
        </h2>
        <button
          onClick={fetchDonations}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 transition"
        >
          Refresh
        </button>
      </div>

      {donations.length === 0 ? (
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <p className="text-xl text-gray-600">
            {role === 'donor' ? 'You haven\'t posted any donations yet.' : 'No donations available nearby.'}
          </p>
          <p className="text-gray-500 mt-2">
            {role === 'donor' ? 'Use the form above to post your first donation.' : 'Check back later for new donations.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div key={donation._id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <FaUtensils className="text-primary text-2xl mr-3" />
                <h3 className="text-xl font-heading text-primary">{donation.foodType}</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-text flex items-center">
                  <strong className="mr-2">Quantity:</strong> {donation.quantity}
                </p>
                <p className="text-text flex items-center">
                  <FaClock className="mr-2 text-gray-500" />
                  <span><strong>Prepared:</strong> {formatDate(donation.preparationTime)}</span>
                </p>
                <p className="text-text flex items-center">
                  <FaClock className="mr-2 text-gray-500" />
                  <span><strong>Expires:</strong> {formatDate(donation.expiryDate)}</span>
                </p>
                <p className="text-text flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-500" />
                  <span><strong>Address:</strong> {donation.address}</span>
                </p>
                {role === 'volunteer' && donation.donor && (
                  <p className="text-text">
                    <strong>Donor:</strong> {donation.donor.name} ({donation.donor.email})
                  </p>
                )}
                {role === 'donor' && donation.volunteer && (
                  <p className="text-text">
                    <strong>Assigned to:</strong> {donation.volunteer.name}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(donation.status)}`}>
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </span>
              </div>

              {role === 'volunteer' && (
                <div className="mt-4">
                  {donation.status === 'available' && !isRequested(donation._id) && (
                    <button
                      onClick={() => handleRequest(donation._id)}
                      className="w-full bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-80 transition-all transform hover:scale-105"
                    >
                      Request Pickup
                    </button>
                  )}
                  {isRequested(donation._id) && donation.status === 'available' && (
                    <button
                      disabled
                      className="w-full bg-yellow-500 text-white px-4 py-2 rounded cursor-not-allowed opacity-75"
                    >
                      ⏳ Request Submitted
                    </button>
                  )}
                  {donation.status === 'claimed' && (
                    <button
                      disabled
                      className="w-full bg-green-500 text-white px-4 py-2 rounded cursor-not-allowed opacity-75"
                    >
                      ✓ Request Accepted
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default DonationList;
