const Notification = require('../models/Notification');

exports.createNotification = async (userId, title, message, type, data = null) => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      data
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification && notification.user.toString() === req.user.id) {
      notification.isRead = true;
      await notification.save();
    }
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
