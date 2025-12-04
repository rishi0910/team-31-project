import React, { useState } from 'react';
import axios from 'axios';
import OTPInput from './OTPInput';

const VolunteerOTPVerification = ({ donation, onVerificationSuccess }) => {
  const [donorOTP, setDonorOTP] = useState('');
  const [deliveryOTP, setDeliveryOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickupVerified, setPickupVerified] = useState(donation.pickupVerified || false);

  const verifyPickupOTP = async () => {
    if (!donorOTP || donorOTP.length !== 6) {
      alert('Please enter the 6-digit pickup OTP from donor');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`/api/donations/${donation._id}/volunteer-verify-pickup`, {
        pickupOTP: donorOTP
      }, {
        headers: { 'x-auth-token': token }
      });

      alert('Pickup verified! You can now collect the food.');
      setPickupVerified(true);
      onVerificationSuccess(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid pickup OTP. Please check with donor.');
    } finally {
      setLoading(false);
    }
  };

  const generateDeliveryOTP = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`/api/donations/${donation._id}/generate-delivery-otp`, {}, {
        headers: { 'x-auth-token': token }
      });
      
      setDeliveryOTP(response.data.deliveryOTP);
      alert(`Delivery OTP generated: ${response.data.deliveryOTP}\nShare this with the receiver.`);
    } catch (error) {
      alert('Error generating delivery OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (donation.status !== 'claimed') {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      {!pickupVerified && (
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-3">Verify Pickup with Donor</h4>
          <p className="text-sm text-gray-600 mb-2">Enter pickup OTP from donor:</p>
          <OTPInput length={6} onComplete={setDonorOTP} />
          <button
            onClick={verifyPickupOTP}
            disabled={loading || donorOTP.length !== 6}
            className="w-full mt-3 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Pickup'}
          </button>
        </div>
      )}

      {pickupVerified && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Generate Delivery OTP</h4>
          {!deliveryOTP ? (
            <button
              onClick={generateDeliveryOTP}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Delivery OTP'}
            </button>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Delivery OTP:</p>
              <div className="bg-yellow-100 p-3 rounded">
                <span className="text-2xl font-bold text-yellow-800">{deliveryOTP}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Share this with the receiver</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerOTPVerification;