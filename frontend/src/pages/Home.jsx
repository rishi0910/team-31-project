import { Link } from 'react-router-dom';
import { FaHandHoldingHeart, FaUsers, FaLeaf } from 'react-icons/fa';

const Home = () => (
  <div className="bg-accent text-text">
    {/* Hero Section with Background Image */}
    <section 
      className="relative bg-cover bg-center bg-no-repeat py-32 text-white min-h-[70vh] flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
      }}
    >
      <div className="container mx-auto text-center relative z-10">
        <div className="bg-black bg-opacity-40 backdrop-blur-sm p-12 rounded-2xl border border-white border-opacity-20 shadow-2xl max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 text-white drop-shadow-2xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Scrap-to-Smile
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-body mb-10 text-gray-100 leading-relaxed max-w-3xl mx-auto">
            Connecting Communities, Reducing Waste, and Fighting Hunger.
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-10 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-lg border-2 border-transparent hover:border-white hover:border-opacity-20"
          >
            Join Our Mission
          </Link>
        </div>
      </div>
      
      {/* Decorative overlay pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-20"></div>
    </section>

    {/* Features Section */}
    <section className="py-20 relative">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-heading text-primary mb-12 font-bold">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
            <FaHandHoldingHeart className="text-secondary text-5xl mx-auto mb-6" />
            <h3 className="text-2xl font-heading text-primary mb-4 font-bold">Donate Food</h3>
            <p className="font-body">
              Easily list your surplus food, set a pickup location, and connect with volunteers.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
            <FaUsers className="text-secondary text-5xl mx-auto mb-6" />
            <h3 className="text-2xl font-heading text-primary mb-4 font-bold">Volunteer</h3>
            <p className="font-body">
              Join our network of volunteers to collect and distribute food to those in need.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
            <FaLeaf className="text-secondary text-5xl mx-auto mb-6" />
            <h3 className="text-2xl font-heading text-primary mb-4 font-bold">Reduce Waste</h3>
            <p className="font-body">
              Play a crucial role in minimizing food waste and promoting sustainability.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* About Us Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img
            src="https://i.pinimg.com/474x/91/4c/6a/914c6a028009ced5d207009f46d7362b.jpg?nii=t"
            alt="Community Meal"
            className="rounded-lg shadow-2xl"
          />
        </div>
        <div className="md:w-1/2 md:pl-12 text-center md:text-left">
          <h2 className="text-4xl font-heading text-primary mb-6 font-bold">Our Mission</h2>
          <p className="text-lg font-body mb-6">
            At Scrap-to-Smile, our mission is to create a seamless connection between those with surplus food and those who need it most. We believe that by working together, we can build a world where no one goes hungry and no food goes to waste.
          </p>
          <p className="text-lg font-body italic">
            "The best way to find yourself is to lose yourself in the service of others."
          </p>
        </div>
      </div>
    </section>

    {/* Call to Action Section */}
    <section className="py-20 bg-accent">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-heading text-primary mb-6 font-bold">Ready to Make a Difference?</h2>
        <p className="text-xl font-body mb-8">
          Join us today and become a part of the solution. Whether you're a donor or a volunteer, your contribution matters.
        </p>
        <Link
          to="/contact"
          className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 text-lg"
        >
          Contact Us
        </Link>
      </div>
    </section>
  </div>
);

export default Home;