import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://harvesthub-backend-siy2.onrender.com' 
  : 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      axios.get('/api/auth/me', {
        headers: { 'x-auth-token': token }
      })
        .then(res => {
          console.log('User validation response:', res.data);
          setUser(res.data.user);
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          sessionStorage.removeItem('token');
          setUser(null);
        });
    }
    setLoading(false);
  }, []);

  const login = async (email, password, navigate) => {
    try {
      // Debug: Log what we're sending
      console.log('Login attempt with:', { email, password: '***' });
      
      const res = await axios.post('/api/auth/login', { email, password });
      
      console.log('Login successful:', res.data);
      sessionStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      
      const role = res.data.user.role;
      if (role === 'donor') navigate('/donor');
      else if (role === 'volunteer') navigate('/volunteer');
      else if (role === 'admin') navigate('/admin');
      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      console.error('Full error object:', error);
      return false;
    }
  };

  const logout = (navigate) => {
    sessionStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const register = async (name, email, password, role, latitude, longitude, navigate) => {
    try {
      // Debug: Log what we're sending
      console.log('Registration attempt with:', { 
        name, 
        email, 
        password: '***', 
        role, 
        latitude, 
        longitude 
      });

      const locationData = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };

      const res = await axios.post('/api/auth/register', { 
        name, 
        email, 
        password, 
        role, 
        location: locationData 
      });
      
      console.log('Registration successful:', res.data);
      sessionStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      
      if (role === 'donor') navigate('/donor');
      else if (role === 'volunteer') navigate('/volunteer');
      else if (role === 'admin') navigate('/admin');
      
      return true;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      console.error('Full error object:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
