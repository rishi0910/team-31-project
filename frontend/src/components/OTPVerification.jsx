import React, { useState } from 'react';
import axios from 'axios';
import OTPInput from './OTPInput';

const OTPVerification = ({ donationId, onVerificationSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post('/api/donations/verify-delivery-otp', {
        donationId,
        deliveryOTP: otp
      }, {
        headers: { 'x-auth-token': token }
      });

      alert('Food delivery verified successfully!');
      onVerificationSuccess(response.data);
      setOtp('');
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-heading text-primary mb-4 text-center">
        Enter OTP to Receive Food
      </h3>
      <form onSubmit={handleVerifyOTP}>
        <div className="mb-6">
          <OTPInput length={6} onComplete={setOtp} />
        </div>
        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-80 transition disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;