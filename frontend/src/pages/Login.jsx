import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password, navigate);
    if (!success) alert('Login failed. Please check your credentials.');
  };

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center py-12">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-4xl font-heading text-primary mb-8 text-center font-extrabold">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-body text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-lg font-body text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
            Login
          </button>
        </form>
        <p className="text-center mt-6 font-body">
          Don't have an account? 
          <Link to="/register" className="text-primary hover:underline font-semibold ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;