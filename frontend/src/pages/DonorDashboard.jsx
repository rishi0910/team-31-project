import React, { useState } from 'react';
import DonationForm from '../components/DonationForm';
import DonationList from '../components/DonationList';

const DonorDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDonationCreated = (newDonation) => {
    console.log('New donation created:', newDonation);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-8 text-center">Donor Dashboard</h1>
        <DonationForm onDonationCreated={handleDonationCreated} />
        <DonationList key={refreshKey} role="donor" />
      </div>
    </div>
  );
};

export default DonorDashboard;