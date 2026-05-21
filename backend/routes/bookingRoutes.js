const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createBooking, 
  getUserBookings, 
  getWorkerBookings, 
  updateBookingStatus 
} = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/worker', protect, getWorkerBookings);
router.put('/:id', protect, updateBookingStatus);

module.exports = router;
