/**
 * SkillSync – ML Recommendation Engine
 * 
 * Uses a Weighted Scoring Algorithm to match user skills to career roles.
 * Each role has a profile of weighted skills; the engine calculates a
 * percentage match based on the user's submitted skills and interests.
 */

// ============================================================
// Career Role Profiles
// Each role has weighted skills across technical, soft, and interest areas.
// Weights range from 0.5 (nice-to-have) to 1.0 (essential)
// ============================================================
const careerProfiles = {
  'Frontend Developer': {
    technical: {
      'JavaScript': 1.0,
      'React': 1.0,
      'HTML/CSS': 0.8,
      'TypeScript': 0.6,
      'Node.js': 0.4
    },
    soft: {
      'Communication': 0.7,
      'Problem Solving': 0.8,
      'Teamwork': 0.6,
      'Creativity': 0.9
    },
    interests: ['Web Development', 'UI/UX'],
    recommended_skills: ['TypeScript', 'Next.js', 'Figma', 'Tailwind CSS', 'Testing (Jest)'],
    roadmap: ['HTML/CSS Mastery', 'JavaScript ES6+', 'React Framework', 'State Management', 'Build Tools']
  },

  'Backend Developer': {
    technical: {
      'Node.js': 1.0,
      'Python': 0.8,
      'SQL': 0.9,
      'JavaScript': 0.6,
      'Docker': 0.5,
      'MongoDB': 0.7
    },
    soft: {
      'Problem Solving': 1.0,
      'Teamwork': 0.6,
      'Communication': 0.5
    },
    interests: ['Web Development', 'DevOps', 'Cloud Computing'],
    recommended_skills: ['Express.js', 'PostgreSQL', 'Redis', 'Docker', 'API Design'],
    roadmap: ['Server-Side Languages', 'Database Design', 'API Development', 'Authentication', 'Deployment']
  },

  'Full Stack Developer': {
    technical: {
      'JavaScript': 1.0,
      'React': 0.8,
      'Node.js': 1.0,
      'SQL': 0.7,
      'Python': 0.5,
      'MongoDB': 0.6,
      'Docker': 0.4
    },
    soft: {
      'Problem Solving': 0.9,
      'Communication': 0.7,
      'Leadership': 0.6,
      'Teamwork': 0.7
    },
    interests: ['Web Development'],
    recommended_skills: ['Next.js', 'GraphQL', 'Docker', 'AWS/GCP', 'CI/CD'],
    roadmap: ['Frontend Basics', 'Backend Basics', 'Database Integration', 'Full Stack Projects', 'DevOps Basics']
  },

  'Data Scientist': {
    technical: {
      'Python': 1.0,
      'SQL': 0.9,
      'Machine Learning': 1.0,
      'R': 0.5,
      'TensorFlow': 0.6
    },
    soft: {
      'Problem Solving': 1.0,
      'Communication': 0.8,
      'Critical Thinking': 0.9,
      'Creativity': 0.5
    },
    interests: ['Data Science', 'Machine Learning'],
    recommended_skills: ['Pandas', 'NumPy', 'Scikit-learn', 'Deep Learning', 'Data Visualization'],
    roadmap: ['Statistics & Math', 'Python for Data', 'ML Algorithms', 'Deep Learning', 'Model Deployment']
  },

  'DevOps Engineer': {
    technical: {
      'Docker': 1.0,
      'Python': 0.7,
      'Linux': 0.9,
      'AWS': 0.8,
      'Node.js': 0.4,
      'SQL': 0.5
    },
    soft: {
      'Problem Solving': 1.0,
      'Teamwork': 0.8,
      'Communication': 0.6,
      'Leadership': 0.5
    },
    interests: ['DevOps', 'Cloud Computing'],
    recommended_skills: ['Kubernetes', 'Terraform', 'Jenkins', 'Ansible', 'Monitoring Tools'],
    roadmap: ['Linux Administration', 'Networking Basics', 'CI/CD Pipelines', 'Containerization', 'Cloud Platforms']
  },

  'UI/UX Designer': {
    technical: {
      'HTML/CSS': 0.8,
      'JavaScript': 0.5,
      'React': 0.4,
      'Figma': 1.0
    },
    soft: {
      'Creativity': 1.0,
      'Communication': 0.9,
      'Problem Solving': 0.7,
      'Teamwork': 0.8,
      'Leadership': 0.4
    },
    interests: ['UI/UX', 'Web Development'],
    recommended_skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    roadmap: ['Design Principles', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing']
  },

  'Cybersecurity Analyst': {
    technical: {
      'Python': 0.8,
      'Linux': 1.0,
      'SQL': 0.7,
      'Networking': 0.9,
      'Node.js': 0.3
    },
    soft: {
      'Problem Solving': 1.0,
      'Critical Thinking': 0.9,
      'Communication': 0.6,
      'Teamwork': 0.5
    },
    interests: ['Cybersecurity'],
    recommended_skills: ['Ethical Hacking', 'Network Security', 'SIEM Tools', 'Penetration Testing', 'Compliance'],
    roadmap: ['Networking Fundamentals', 'Operating Systems', 'Security Principles', 'Ethical Hacking', 'Incident Response']
  },

  'ML Engineer': {
    technical: {
      'Python': 1.0,
      'Machine Learning': 1.0,
      'TensorFlow': 0.8,
      'SQL': 0.6,
      'Docker': 0.5
    },
    soft: {
      'Problem Solving': 1.0,
      'Critical Thinking': 0.8,
      'Communication': 0.5,
      'Teamwork': 0.6
    },
    interests: ['Machine Learning', 'Data Science'],
    recommended_skills: ['PyTorch', 'MLOps', 'Feature Engineering', 'Model Optimization', 'Cloud ML Services'],
    roadmap: ['Math & Statistics', 'ML Fundamentals', 'Deep Learning', 'MLOps', 'Production ML Systems']
  }
};

/**
 * Calculate the match score between user skills and a career profile
 * @param {Object} userSkills - User's technical skills, soft skills, and interests
 * @param {Object} profile - Career profile to compare against
 * @returns {number} Match score as a percentage (0-100)
 */
function calculateMatchScore(userSkills, profile) {
  let totalWeight = 0;
  let matchedWeight = 0;

  // Score technical skills (60% weight)
  const techWeight = 0.60;
  let techTotal = 0;
  let techMatched = 0;

  for (const [skill, weight] of Object.entries(profile.technical)) {
    techTotal += weight;
    if (userSkills.technical_skills.includes(skill)) {
      techMatched += weight;
    }
  }

  if (techTotal > 0) {
    totalWeight += techWeight;
    matchedWeight += techWeight * (techMatched / techTotal);
  }

  // Score soft skills (20% weight)
  const softWeight = 0.20;
  let softTotal = 0;
  let softMatched = 0;

  for (const [skill, weight] of Object.entries(profile.soft)) {
    softTotal += weight;
    if (userSkills.soft_skills.includes(skill)) {
      softMatched += weight;
    }
  }

  if (softTotal > 0) {
    totalWeight += softWeight;
    matchedWeight += softWeight * (softMatched / softTotal);
  }

  // Score interest alignment (20% weight)
  const interestWeight = 0.20;
  totalWeight += interestWeight;

  if (profile.interests.includes(userSkills.interest_level)) {
    matchedWeight += interestWeight;
  }

  // Calculate final percentage
  const score = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;

  return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Get career recommendations based on user skills
 * @param {Object} userSkills - { technical_skills: [], soft_skills: [], interest_level: '' }
 * @returns {Object} Recommendation results with top matches
 */
function getRecommendations(userSkills) {
  const results = [];

  // Calculate match score for each career profile
  for (const [role, profile] of Object.entries(careerProfiles)) {
    const score = calculateMatchScore(userSkills, profile);
    results.push({
      role,
      score,
      recommended_skills: profile.recommended_skills,
      roadmap: profile.roadmap
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Return top 3 matches
  const topMatches = results.slice(0, 3);

  return {
    predicted_role: topMatches[0].role,
    confidence_score: topMatches[0].score,
    top_matches: topMatches.map(match => ({
      role: match.role,
      score: match.score,
      recommended_skills: match.recommended_skills,
      roadmap: match.roadmap
    })),
    all_scores: results
  };
}

module.exports = { getRecommendations, careerProfiles };
