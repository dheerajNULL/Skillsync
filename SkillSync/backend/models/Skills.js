const mongoose = require('mongoose');

/**
 * Skills Schema
 * Stores user's technical skills, soft skills, and interest level
 */
const skillsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  technical_skills: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: 'At least one technical skill is required'
    }
  },
  soft_skills: {
    type: [String],
    default: []
  },
  interest_level: {
    type: String,
    required: [true, 'Interest level/area is required'],
    enum: [
      'Web Development',
      'Data Science',
      'DevOps',
      'UI/UX',
      'Cybersecurity',
      'Machine Learning',
      'Mobile Development',
      'Cloud Computing'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
skillsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Skills', skillsSchema);
