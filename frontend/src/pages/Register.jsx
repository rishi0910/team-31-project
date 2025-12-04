import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert('GPS not supported. Trying IP-based location...');
      setIsLoading(true);
      getLocationFromIP().finally(() => setIsLoading(false));
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        setIsLoading(false);
        alert(`GPS location captured!\nLatitude: ${lat.toFixed(6)}\nLongitude: ${lng.toFixed(6)}`);
      },
      async (error) => {
        console.error('GPS failed, trying IP location:', error);
        const ipSuccess = await getLocationFromIP();
        setIsLoading(false);
        
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!latitude || !longitude) {
      alert('Please provide your location or use the "Get Current Location" button.');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please provide valid latitude (-90 to 90) and longitude (-180 to 180) values.');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await register(name, email, password, role, lat, lng, navigate);
      if (!success) {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center py-12">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-4xl font-heading text-primary mb-8 text-center font-extrabold">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-body text-gray-700">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-lg font-body text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                disabled={isLoading}
              >
                <option value="donor">Donor</option>
                <option value="volunteer">Volunteer</option>
                <option value="receiver">Receiver</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-lg font-body text-gray-700">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-lg font-body text-gray-700">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
              placeholder="Create a password"
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-body text-gray-700">Latitude *</label>
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
                placeholder="Your latitude"
                step="any"
                min="-90"
                max="90"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-lg font-body text-gray-700">Longitude *</label>
              <input
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
                placeholder="Your longitude"
                step="any"
                min="-180"
                max="180"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleLocation}
              className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Getting Location...' : '📍 Get Location (GPS/IP)'}
            </button>
            <p className="text-sm text-gray-500 text-center">
              Make sure to allow location access when prompted, or enter coordinates manually
            </p>
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-6 font-body">
          Already have an account? 
          <Link to="/login" className="text-primary hover:underline font-semibold ml-1">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;