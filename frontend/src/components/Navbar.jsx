import React, { useContext, useState } from 'react';
import { FaUtensils, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-heading flex items-center">
          <FaUtensils className="mr-3" />
          <span className="font-bold">Scrap-to-Smile</span>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-secondary transition duration-300 font-bold">Home</Link>
          <Link to="/about" className="hover:text-secondary transition duration-300 font-bold">About</Link>
          <Link to="/contact" className="hover:text-secondary transition duration-300 font-bold">Contact</Link>
          {user ? (
            <>
              <Link to={`/${user.role}`} className="hover:text-secondary transition duration-300 font-bold">
                Dashboard
              </Link>
              <span className="font-semibold">Welcome, {user.name}</span>
              <button onClick={() => logout(navigate)} className="bg-secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded transition duration-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-secondary transition duration-300 font-bold">Login</Link>
              <Link to="/register" className="bg-secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded transition duration-300">Register</Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-primary text-center py-4">
          <Link to="/" className="block py-2 hover:text-secondary transition duration-300" onClick={toggleMenu}>Home</Link>
          <Link to="/about" className="block py-2 hover:text-secondary transition duration-300" onClick={toggleMenu}>About</Link>
          <Link to="/contact" className="block py-2 hover:text-secondary transition duration-300" onClick={toggleMenu}>Contact</Link>
          {user ? (
            <>
              <Link to={`/${user.role}`} className="block py-2 hover:text-secondary transition duration-300" onClick={toggleMenu}>
                Dashboard
              </Link>
              <span className="block py-2 font-semibold">Welcome, {user.name}</span>
              <button onClick={() => { logout(navigate); toggleMenu(); }} className="w-full bg-secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded transition duration-300 mt-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:text-secondary transition duration-300" onClick={toggleMenu}>Login</Link>
              <Link to="/register" className="block w-full bg-secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded transition duration-300 mt-2" onClick={toggleMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;