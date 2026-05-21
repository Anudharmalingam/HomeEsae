const Worker = require('../models/Worker');
const User = require('../models/User');

exports.getAllWorkers = async (req, res) => {
  try {
    const { category, city } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (city) query['location.address'] = { $regex: city, $options: 'i' };

    const workers = await Worker.find(query).populate('userId', 'name email phone');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('userId', 'name email phone');
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id }).populate('userId', 'name email phone');
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
