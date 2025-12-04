import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OTPVerification from '../components/OTPVerification';

const ReceiverDashboard = () => {
  const [receivedFood, setReceivedFood] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchReceivedFood();
  }, []);

  const fetchReceivedFood = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('/api/donations/received', {
        headers: { 'x-auth-token': token }
      });
      setReceivedFood(response.data);
    } catch (error) {
      console.error('Error fetching received food:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (verifiedDonation) => {
    setReceivedFood(prev => [verifiedDonation, ...prev]);
    setShowOTPModal(false);
    setSelectedDonation(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-8 text-center">
          Receiver Dashboard
        </h1>

        <div className="mb-8 text-center">
          <button
            onClick={() => setShowOTPModal(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition text-lg"
          >
            Receive Food with OTP
          </button>
        </div>

        {showOTPModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
              <button
                onClick={() => setShowOTPModal(false)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
              >
                ×
              </button>
              <div className="mt-4">
                <OTPVerification
                  donationId={selectedDonation}
                  onVerificationSuccess={handleVerificationSuccess}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-heading text-primary mb-6">
            Received Food History ({receivedFood.length})
          </h2>

          {receivedFood.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No food received yet</p>
              <p className="text-gray-500">Use the button above to receive food with OTP</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receivedFood.map((food) => (
                <div key={food._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-heading text-primary mb-2">
                    {food.foodType}
                  </h3>
                  <p className="text-text mb-1">
                    <strong>Quantity:</strong> {food.quantity}
                  </p>
                  <p className="text-text mb-1">
                    <strong>From:</strong> {food.donor?.name}
                  </p>
                  <p className="text-text mb-1">
                    <strong>Delivered by:</strong> {food.volunteer?.name}
                  </p>
                  <p className="text-text mb-1">
                    <strong>Received:</strong> {new Date(food.deliveredAt).toLocaleString()}
                  </p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Delivered
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

export default ReceiverDashboard;