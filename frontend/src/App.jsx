import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';
import VolunteerDashboard from './pages/VolunteerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ReceiverDashboard from './pages/ReceiverDashboard.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-accent">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/volunteer" element={<VolunteerDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/receiver" element={<ReceiverDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;