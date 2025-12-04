import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-primary text-white py-8">
    <div className="container mx-auto text-center">
      <p className="text-xl font-body mb-6 italic">
        "The greatest good is what we do for one another."
      </p>
      <div className="flex justify-center space-x-6 mb-6">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-transform transform hover:scale-125">
          <FaFacebook size={28} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-transform transform hover:scale-125">
          <FaTwitter size={28} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-transform transform hover:scale-125">
          <FaInstagram size={28} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-transform transform hover:scale-125">
          <FaLinkedin size={28} />
        </a>
      </div>
      <p className="font-body text-sm">
        © {new Date().getFullYear()} Scrap-to-Smile. All Rights Reserved.
      </p>
    </div>
  </footer>
);

export default Footer;