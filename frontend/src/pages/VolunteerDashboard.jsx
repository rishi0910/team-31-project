import React from 'react';
import DonationList from '../components/DonationList';

const VolunteerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-8 text-center">Volunteer Dashboard</h1>
        <DonationList role="volunteer" />
      </div>
    </div>
  );
};

export default VolunteerDashboard;