const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const { createNotification } = require('./notificationController');

exports.createBooking = async (req, res) => {
  try {
    const { workerId, serviceType, date, time, price, isUrgent } = req.body;
    
    const booking = await Booking.create({
      user: req.user.id,
      worker: workerId,
      serviceType,
      date,
      time,
      price,
      isUrgent
    });

    // Notify Worker
    const worker = await Worker.findById(workerId);
    if (worker) {
      await createNotification(
        worker.userId,
        'New Booking Request',
        `You have a new ${serviceType} booking request for ${date} at ${time}.`,
        'booking_request',
        { bookingId: booking._id }
      );
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('worker').populate({
      path: 'worker',
      populate: { path: 'userId', select: 'name email phone' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkerBookings = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    const bookings = await Booking.find({ worker: worker._id }).populate('user', 'name email phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify ownership (simplified for now)
    booking.status = status;
    await booking.save();

    // Notify User
    await createNotification(
      booking.user,
      'Booking Status Updated',
      `Your booking for ${booking.serviceType} has been ${status}.`,
      'booking_update',
      { bookingId: booking._id }
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
