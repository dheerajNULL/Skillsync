const Results = require('../models/Results');

/**
 * @desc    Save prediction results
 * @route   POST /api/results/save
 * @access  Private
 */
const saveResults = async (req, res) => {
  try {
    const { predicted_role, confidence_score, top_matches, skills_used } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!predicted_role || !confidence_score || !top_matches) {
      return res.status(400).json({
        success: false,
        message: 'Prediction data is incomplete'
      });
    }

    // Create results entry
    const result = await Results.create({
      userId,
      predicted_role,
      confidence_score,
      top_matches,
      skills_used: skills_used || {}
    });

    res.status(201).json({
      success: true,
      message: 'Results saved successfully',
      data: result
    });
  } catch (error) {
    console.error('Save Results Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving results',
      error: error.message
    });
  }
};

/**
 * @desc    Get prediction history for a user
 * @route   GET /api/results/history/:userId
 * @access  Private
 */
const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await Results.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching results',
      error: error.message
    });
  }
};

module.exports = { saveResults, getHistory };
