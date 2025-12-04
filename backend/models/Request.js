const mongoose = require('mongoose');

   const requestSchema = new mongoose.Schema({
     donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
     volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
     message: { type: String },
   }, { timestamps: true });

   module.exports = mongoose.model('Request', requestSchema);