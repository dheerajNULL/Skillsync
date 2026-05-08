const mongoose = require('mongoose');

/**
 * Results Schema
 * Stores ML prediction results for career recommendations
 */
const resultsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  predicted_role: {
    type: String,
    required: [true, 'Predicted role is required']
  },
  confidence_score: {
    type: Number,
    required: [true, 'Confidence score is required'],
    min: 0,
    max: 100
  },
  top_matches: [
    {
      role: {
        type: String,
        required: true
      },
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      recommended_skills: {
        type: [String],
        default: []
      }
    }
  ],
  skills_used: {
    technical: [String],
    soft: [String],
    interest: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Results', resultsSchema);
