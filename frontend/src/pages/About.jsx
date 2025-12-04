import { FaHandsHelping, FaHeart, FaUsers } from 'react-icons/fa';

const About = () => (
  <div className="bg-accent text-text py-20">
    <div className="container mx-auto px-6">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-heading font-extrabold text-primary mb-4">
          Our Story
        </h1>
        <p className="text-xl font-body max-w-3xl mx-auto">
          HarvestHub was born from a simple idea: to bridge the gap between food surplus and food scarcity. We are a passionate team dedicated to creating a sustainable future by fighting hunger and reducing waste.
        </p>
      </div>

      {/* Mission and Vision Section */}
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-2xl p-12 mb-16">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img 
            src="https://i.pinimg.com/474x/91/4c/6a/914c6a028009ced5d207009f46d7362b.jpg?nii=t" 
            alt="Community Kitchen"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 md:pl-12">
          <h2 className="text-4xl font-heading text-primary mb-6">Our Mission & Vision</h2>
          <p className="text-lg font-body mb-4">
            Our mission is to build a nationwide network that efficiently redistributes surplus food to those in need. We envision a world where every community has access to nutritious food, and no edible food is wasted.
          </p>
          <p className="text-lg font-body italic">
            "To create a world where food is a source of connection, not division."
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="text-center">
        <h2 className="text-4xl font-heading text-primary mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <FaHandsHelping className="text-secondary text-6xl mx-auto mb-6" />
            <h3 className="text-2xl font-heading text-primary mb-4">Community</h3>
            <p className="font-body">
              We believe in the power of community to create lasting change and support one another.
            </p>
          </div>
          <div className="text-center">
            <FaHeart className="text-secondary text-6xl mx-auto mb-6" />
            <h3 className="text-2xl font-heading text-primary mb-4">Compassion</h3>
            <p className="font-body">
              Every action we take is guided by empathy and a deep commitment to serving others.
            </p>
          </div>
          <div className="text-center">
            <FaUsers className="text-secondary text-6xl mx-auto mb-6" />
            <h3 className="text-2xl font-heading text-primary mb-4">Collaboration</h3>
            <p className="font-body">
              We partner with donors, volunteers, and organizations to maximize our collective impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;