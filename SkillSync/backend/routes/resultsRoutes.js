const express = require('express');
const router = express.Router();
const { saveResults, getHistory } = require('../controllers/resultsController');
const verifyToken = require('../middleware/verifyToken');

// All results routes are protected
router.post('/save', verifyToken, saveResults);
router.get('/history/:userId', verifyToken, getHistory);

module.exports = router;
