const express = require('express');
   const auth = require('../middleware/auth');
   const Donation = require('../models/Donation');
   const Request = require('../models/Request');
   const router = express.Router();

   // Create request
   router.post('/', auth, async (req, res) => {
     if (req.user.role !== 'volunteer') return res.status(403).json({ message: 'Access denied' });
     const { donationId, message } = req.body;

     if (!donationId) {
        return res.status(400).json({ message: 'Donation ID is required' });
     }

     try {
       const donation = await Donation.findById(donationId);
       if (!donation || donation.status !== 'available') {
         return res.status(400).json({ message: 'Donation not available' });
       }
       const request = new Request({
         donation: donationId,
         volunteer: req.user.id,
         message,
       });
       await request.save();
       res.status(201).json(request);
     } catch (error) {
       res.status(500).json({ message: 'Server error', error: error.message });
     }
   });

   // Get all requests (admin only)
   router.get('/', auth, async (req, res) => {
     if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
     try {
       const requests = await Request.find()
         .populate('donation', 'foodType quantity')
         .populate('volunteer', 'name');
       res.json(requests);
     } catch (error) {
       res.status(500).json({ message: 'Server error', error: error.message });
     }
   });

    // Get all requests for a specific donation
    router.get('/donation/:donationId', auth, async (req, res) => {
        if (req.user.role !== 'donor') return res.status(403).json({ message: 'Access denied' });
        try {
            const requests = await Request.find({ donation: req.params.donationId })
                .populate('volunteer', 'name email');
            res.json(requests);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

   // Approve/reject request (admin only)
   router.put('/:id', auth, async (req, res) => {
     if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
     const { status } = req.body;

     if (!status || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
     }

     try {
       const request = await Request.findById(req.params.id);
       if (!request) return res.status(404).json({ message: 'Request not found' });
       request.status = status;
       await request.save();
       if (status === 'accepted') {
         const donation = await Donation.findById(request.donation);
         donation.status = 'claimed';
         donation.volunteer = request.volunteer;
         await donation.save();
       }
       res.json(request);
     } catch (error) {
       res.status(500).json({ message: 'Server error', error: error.message });
     }
   });

   router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const { status } = req.body;

  if (!status || !['accepted', 'rejected'].includes(status)) {
     return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const request = await Request.findById(req.params.id)
      .populate('donation', 'foodType quantity')
      .populate('volunteer', 'name email');
      
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    request.status = status;
    await request.save();
    
    if (status === 'accepted') {
      const donation = await Donation.findById(request.donation._id);
      donation.status = 'claimed';
      donation.volunteer = request.volunteer._id;
      await donation.save();
      
      // Emit socket event for donation status update
      if (req.io) {
        req.io.emit('donationStatusUpdated', donation);
      }
    }
    
    // Emit socket event for request status update
    if (req.io) {
      req.io.emit('requestStatusUpdated', request);
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

   module.exports = router;