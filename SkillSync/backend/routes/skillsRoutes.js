const express = require('express');
const router = express.Router();
const { addSkills, getSkills } = require('../controllers/skillsController');
const verifyToken = require('../middleware/verifyToken');

// All skills routes are protected
router.post('/add', verifyToken, addSkills);
router.get('/:userId', verifyToken, getSkills);

module.exports = router;
