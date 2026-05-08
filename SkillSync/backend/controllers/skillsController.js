const Skills = require('../models/Skills');

/**
 * @desc    Add or update user skills
 * @route   POST /api/skills/add
 * @access  Private
 */
const addSkills = async (req, res) => {
  try {
    const { technical_skills, soft_skills, interest_level } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!technical_skills || technical_skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one technical skill is required'
      });
    }

    if (!interest_level) {
      return res.status(400).json({
        success: false,
        message: 'Interest area is required'
      });
    }

    // Check if skills already exist for this user — update or create
    let skills = await Skills.findOne({ userId });

    if (skills) {
      // Update existing skills
      skills.technical_skills = technical_skills;
      skills.soft_skills = soft_skills || [];
      skills.interest_level = interest_level;
      await skills.save();
    } else {
      // Create new skills entry
      skills = await Skills.create({
        userId,
        technical_skills,
        soft_skills: soft_skills || [],
        interest_level
      });
    }

    res.status(201).json({
      success: true,
      message: 'Skills saved successfully',
      data: skills
    });
  } catch (error) {
    console.error('Add Skills Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving skills',
      error: error.message
    });
  }
};

/**
 * @desc    Get user skills by userId
 * @route   GET /api/skills/:userId
 * @access  Private
 */
const getSkills = async (req, res) => {
  try {
    const { userId } = req.params;

    const skills = await Skills.findOne({ userId }).populate('userId', 'name email');

    if (!skills) {
      return res.status(404).json({
        success: false,
        message: 'No skills found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    console.error('Get Skills Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching skills',
      error: error.message
    });
  }
};

module.exports = { addSkills, getSkills };
