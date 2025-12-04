import React, { useState } from 'react';
import axios from 'axios';
import OTPInput from './OTPInput';

const DonorOTPVerification = ({ donation, onVerificationSuccess }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [volunteerOTP, setVolunteerOTP] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePickupOTP = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`/api/donations/${donation._id}/generate-pickup-otp`, {}, {
        headers: { 'x-auth-token': token }
      });
      
      setGeneratedOTP(response.data.pickupOTP);
      setShowOTP(true);
      alert(`Pickup OTP generated: ${response.data.pickupOTP}\nShare this with the volunteer for pickup verification.`);
    } catch (error) {
      alert('Error generating pickup OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyVolunteerOTP = async () => {
    if (!volunteerOTP || volunteerOTP.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`/api/donations/${donation._id}/verify-pickup`, {
        pickupOTP: volunteerOTP
      }, {
        headers: { 'x-auth-token': token }
      });

      alert('Pickup verified successfully! Food has been handed over to volunteer.');
      onVerificationSuccess(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (donation.status !== 'claimed') {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-3">Pickup Verification</h4>
      
      {!showOTP ? (
        <button
          onClick={generatePickupOTP}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Pickup OTP'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Your Pickup OTP:</p>
            <div className="bg-yellow-100 p-3 rounded text-center">
              <span className="text-2xl font-bold text-yellow-800">{generatedOTP}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Share this with the volunteer</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Enter volunteer's verification OTP:</p>
            <OTPInput length={6} onComplete={setVolunteerOTP} />
            <button
              onClick={verifyVolunteerOTP}
              disabled={loading || volunteerOTP.length !== 6}
              className="w-full mt-3 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Confirm Pickup'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorOTPVerification;