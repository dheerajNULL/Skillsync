const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route
router.get('/me', verifyToken, getMe);

module.exports = router;
