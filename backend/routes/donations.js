const express = require('express');
   const auth = require('../middleware/auth');
   const Donation = require('../models/Donation');
   const router = express.Router();

   // Create donation
   router.post('/', auth, async (req, res) => {
     if (req.user.role !== 'donor') return res.status(403).json({ message: 'Access denied' });
     const { foodType, quantity, preparationTime, expiryDate, address, latitude, longitude } = req.body;

     if (!foodType || !quantity || !preparationTime || !expiryDate || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required' });
     }

     try {
       const donation = new Donation({
         donor: req.user.id,
         foodType,
         quantity,
         preparationTime,
         expiryDate,
         address,
         location: { coordinates: [longitude, latitude] },
       });
       await donation.save();
       res.status(201).json(donation);
     } catch (error) {
       res.status(500).json({ message: 'Server error', error: error.message });
     }
   });

   // Get nearby donations (within 10km)
   router.get('/nearby', auth, async (req, res) => {
     if (req.user.role !== 'volunteer') return res.status(403).json({ message: 'Access denied' });
     const { latitude, longitude } = req.query;

     if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
     }

     try {
       const donations = await Donation.find({
         status: 'available',
         location: {
           $near: {
             $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
             $maxDistance: 10000, // 10km
           },
         },
       }).populate('donor', 'name email');
       res.json(donations);
     } catch (error) {
       res.status(500).json({ message: 'Server error', error: error.message });
     }
   });

   // Get user's donations
   router.get('/my-donations', auth, async (req, res) => {
     if (req.user.role !== 'donor') return res.status(403).json({ message: 'Access denied' });
     try {
       const donations = await Donation.find({ donor: req.user.id });
       res.json(donations);
     } catch (error) {
       res.status(500).json({ message: 'Server error', error: error.message });
     }
   });

   // Get single donation by ID
    router.get('/:id', auth, async (req, res) => {
        try {
            const donation = await Donation.findById(req.params.id).populate('donor', 'name email');
            if (!donation) {
                return res.status(404).json({ message: 'Donation not found' });
            }
            res.json(donation);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    router.get('/all-available', auth, async (req, res) => {
  if (req.user.role !== 'volunteer') return res.status(403).json({ message: 'Access denied' });
  
  try {
    const donations = await Donation.find({
      status: 'available'
    }).populate('donor', 'name email').sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    console.error('Error fetching all available donations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

   module.exports = router;