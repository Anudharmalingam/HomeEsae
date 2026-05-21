const express = require('express');
const router = express.Router();
const { getAllWorkers, getWorkerById, getMyProfile, updateWorkerProfile } = require('../controllers/workerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllWorkers);
router.get('/me', protect, getMyProfile);
router.get('/:id', getWorkerById);
router.put('/:id', protect, updateWorkerProfile);

module.exports = router;
