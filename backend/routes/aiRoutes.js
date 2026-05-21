const express = require('express');
const { diagnoseProblem } = require('../controllers/aiController');
const router = express.Router();

router.post('/diagnose', diagnoseProblem);

module.exports = router;
