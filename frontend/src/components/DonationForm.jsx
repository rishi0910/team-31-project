import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import socket from '../socket';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://harvesthub-backend-siy2.onrender.com' 
  : 'http://localhost:5000';

const DonationForm = ({ onDonationCreated }) => {
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const getLocationFromIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.latitude && data.longitude) {
        setLatitude(data.latitude.toString());
        setLongitude(data.longitude.toString());
        alert(`Approximate location found!\nCity: ${data.city}, ${data.country}\nLatitude: ${data.latitude}\nLongitude: ${data.longitude}`);
        return true;
      }
    } catch (error) {
      console.error('IP geolocation failed:', error);
    }
    return false;
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('GPS not supported. Trying IP-based location...');
      setLocationLoading(true);
      getLocationFromIP().finally(() => setLocationLoading(false));
      return;
    }

    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        setLocationLoading(false);
        alert(`GPS location captured!\nLatitude: ${lat.toFixed(6)}\nLongitude: ${lng.toFixed(6)}`);
      },
      async (error) => {
        console.error('GPS failed, trying IP location:', error);
        const ipSuccess = await getLocationFromIP();
        setLocationLoading(false);
        
        if (!ipSuccess) {
          alert('Location unavailable. Please enter coordinates manually or check your internet connection.');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  };

  const resetForm = () => {
    setFoodType('');
    setQuantity('');
    setPreparationTime('');
    setExpiryDate('');
    setAddress('');
    setLatitude('');
    setLongitude('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodType || !quantity || !preparationTime || !expiryDate || !address || !latitude || !longitude) {
      alert('Please fill in all fields');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please enter valid coordinates');
      return;
    }

    const prepTime = new Date(preparationTime);
    const expTime = new Date(expiryDate);
    const now = new Date();

    if (expTime <= prepTime) {
      alert('Expiry date must be after preparation time');
      return;
    }

    if (expTime <= now) {
      alert('Expiry date must be in the future');
      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        alert('Please login first');
        setLoading(false);
        return;
      }

      console.log('Submitting donation with data:', {
        foodType,
        quantity: parseInt(quantity),
        preparationTime,
        expiryDate,
        address,
        latitude: lat,
        longitude: lng
      });

      const res = await axios.post('/api/donations', {
        foodType,
        quantity: parseInt(quantity),
        preparationTime,
        expiryDate,
        address,
        latitude: lat,
        longitude: lng
      }, {
        headers: { 'x-auth-token': token }
      });

      console.log('Donation created successfully:', res.data);
      socket.emit('newDonation', res.data);

      alert('Donation posted successfully!');
      resetForm();
      
      if (onDonationCreated) {
        onDonationCreated(res.data);
      }

    } catch (error) {
      console.error('Error creating donation:', error);
      
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error posting donation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
      <h2 className="text-3xl font-heading text-primary mb-6 text-center">Post a Food Donation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-body text-gray-700 mb-2">Food Type *</label>
            <input
              type="text"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
              placeholder="e.g., Fresh vegetables, Cooked rice"
            />
          </div>

          <div>
            <label className="block text-lg font-body text-gray-700 mb-2">Quantity (servings) *</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
              min="1"
              placeholder="e.g., 10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-body text-gray-700 mb-2">Preparation Time *</label>
            <input
              type="datetime-local"
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-body text-gray-700 mb-2">Expiry Date *</label>
            <input
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-body text-gray-700 mb-2">Pickup Address *</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
            rows="3"
            placeholder="Full address where volunteers can pick up the food"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-body text-gray-700">Location Coordinates *</label>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-80 transition disabled:opacity-50"
            >
              {locationLoading ? 'Getting Location...' : '📍 Get Location (GPS/IP)'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body text-gray-600 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
                placeholder="e.g., 28.6139"
              />
            </div>
            <div>
              <label className="block text-sm font-body text-gray-600 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
                placeholder="e.g., 77.2090"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Click "Get Current Location" to automatically fill coordinates, or enter them manually.
            <br /><strong>Note:</strong> Allow location access when prompted by your browser.
          </p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Posting Donation...
            </div>
          ) : (
            'Post Donation'
          )}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
