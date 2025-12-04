import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => (
  <div className="bg-accent text-text py-20">
    <div className="container mx-auto px-6">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-heading font-extrabold text-primary mb-4">
          Get in Touch
        </h1>
        <p className="text-xl font-body max-w-3xl mx-auto">
          We are here to answer any questions you may have. Reach out to us and we'll respond as soon as we can.
        </p>
      </div>

      {/* Contact Form and Information Section */}
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-2xl p-12">
        {/* Contact Form */}
        <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
          <h2 className="text-3xl font-heading text-primary mb-6">Send Us a Message</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg font-body mb-2">Full Name</label>
              <input type="text" id="name" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-body mb-2">Email Address</label>
              <input type="email" id="email" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-lg font-body mb-2">Message</label>
              <textarea id="message" rows="5" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
              Submit
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="md:w-1/2 md:pl-12 border-t md:border-t-0 md:border-l border-gray-200 pt-12 md:pt-0">
          <h2 className="text-3xl font-heading text-primary mb-6">Contact Information</h2>
          <div className="flex items-center mb-6">
            <FaMapMarkerAlt className="text-secondary text-3xl mr-4" />
            <p className="text-lg font-body">123 Harvest Lane, Foodie City, FC 12345</p>
          </div>
          <div className="flex items-center mb-6">
            <FaPhone className="text-secondary text-3xl mr-4" />
            <p className="text-lg font-body">(123) 456-7890</p>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="text-secondary text-3xl mr-4" />
            <a href="mailto:contact@harvesthub.com" className="text-lg font-body hover:text-primary transition">
              contact@harvesthub.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;