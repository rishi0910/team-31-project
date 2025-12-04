const mongoose = require('mongoose');

   const donationSchema = new mongoose.Schema({
     donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     foodType: { type: String, required: true },
     quantity: { type: Number, required: true },
     preparationTime: { type: Date, required: true },
     expiryDate: { type: Date, required: true },
     address: { type: String, required: true },
     location: {
       type: { type: String, enum: ['Point'], default: 'Point' },
       coordinates: { type: [Number], required: true }, // [longitude, latitude]
     },
     status: { type: String, enum: ['available', 'claimed', 'delivered'], default: 'available' },
     volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   }, { timestamps: true });

   donationSchema.index({ location: '2dsphere' });
   module.exports = mongoose.model('Donation', donationSchema);
