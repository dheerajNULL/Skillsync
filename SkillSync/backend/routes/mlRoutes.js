const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getRecommendations } = require('../services/recommendationEngine');

/**
 * @desc    Get ML career predictions based on user skills
 * @route   POST /api/ml/predict
 * @access  Private
 */
router.post('/predict', verifyToken, async (req, res) => {
  try {
    const { technical_skills, soft_skills, interest_level } = req.body;

    // Validate inputs
    if (!technical_skills || technical_skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one technical skill is required for prediction'
      });
    }

    if (!interest_level) {
      return res.status(400).json({
        success: false,
        message: 'Interest area is required for prediction'
      });
    }

    // Run recommendation engine
    const predictions = getRecommendations({
      technical_skills,
      soft_skills: soft_skills || [],
      interest_level
    });

    res.status(200).json({
      success: true,
      message: 'Career predictions generated successfully',
      data: predictions
    });
  } catch (error) {
    console.error('ML Prediction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating predictions',
      error: error.message
    });
  }
});

module.exports = router;
