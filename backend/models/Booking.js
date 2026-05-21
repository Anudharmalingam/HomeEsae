const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'paid', 'cancelled', 'rejected'],
    default: 'pending',
  },
  problemImage: {
    type: String, // URL to the image
  },
  isUrgent: {
    type: Boolean,
    default: false,
  },
  completionDetails: {
    completedAt: Date,
    actualPrice: Number,
    notes: String,
    location: String
  }
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
