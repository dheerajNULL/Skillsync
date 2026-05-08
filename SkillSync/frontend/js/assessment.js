/**
 * SkillSync – Assessment JavaScript
 * Handles multi-step form navigation, validation, and submission
 */

document.addEventListener('DOMContentLoaded', () => {
  // Require authentication
  if (!requireAuth()) return;

  let currentStep = 1;
  const totalSteps = 3;

  // DOM Elements
  const progressFill = document.getElementById('progressFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const form = document.getElementById('assessmentForm');

  /**
   * Update the progress bar and step indicators
   */
  function updateProgress() {
    const percent = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${percent}%`;

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach(step => {
      const stepNum = parseInt(step.dataset.step);
      step.classList.remove('active', 'completed');
      if (stepNum === currentStep) step.classList.add('active');
      else if (stepNum < currentStep) step.classList.add('completed');
    });
  }

  /**
   * Show a specific step
   */
  function showStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');

    // Show/hide navigation buttons
    prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
    if (step === totalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }

    updateProgress();
  }

  /**
   * Validate the current step
   */
  function validateStep(step) {
    const errorEl = document.getElementById(`step${step}Error`);
    errorEl.textContent = '';

    if (step === 1) {
      const checked = document.querySelectorAll('input[name="technical"]:checked');
      if (checked.length === 0) {
        errorEl.textContent = 'Please select at least one technical skill.';
        return false;
      }
    } else if (step === 2) {
      const checked = document.querySelectorAll('input[name="soft"]:checked');
      if (checked.length === 0) {
        errorEl.textContent = 'Please select at least one soft skill.';
        return false;
      }
    } else if (step === 3) {
      const checked = document.querySelector('input[name="interest"]:checked');
      if (!checked) {
        errorEl.textContent = 'Please select an interest area.';
        return false;
      }
    }
    return true;
  }

  // Next button handler
  nextBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Previous button handler
  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  /**
   * Handle form submission — send skills to API and get predictions
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    // Collect form data
    const technical_skills = Array.from(document.querySelectorAll('input[name="technical"]:checked')).map(el => el.value);
    const soft_skills = Array.from(document.querySelectorAll('input[name="soft"]:checked')).map(el => el.value);
    const interest_level = document.querySelector('input[name="interest"]:checked').value;

    toggleSpinner(true);

    try {
      // 1. Save skills
      await apiRequest('/skills/add', {
        method: 'POST',
        body: JSON.stringify({ technical_skills, soft_skills, interest_level })
      });

      // 2. Get ML predictions
      const predData = await apiRequest('/ml/predict', {
        method: 'POST',
        body: JSON.stringify({ technical_skills, soft_skills, interest_level })
      });

      if (predData && predData.success) {
        const predictions = predData.data;

        // 3. Save results
        await apiRequest('/results/save', {
          method: 'POST',
          body: JSON.stringify({
            predicted_role: predictions.predicted_role,
            confidence_score: predictions.confidence_score,
            top_matches: predictions.top_matches,
            skills_used: { technical: technical_skills, soft: soft_skills, interest: interest_level }
          })
        });

        // Store latest predictions for dashboard
        localStorage.setItem('skillsync_latest_predictions', JSON.stringify(predictions));
        localStorage.setItem('skillsync_latest_skills', JSON.stringify({
          technical: technical_skills,
          soft: soft_skills,
          interest: interest_level
        }));

        showToast('Career predictions generated successfully!', 'success');

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '../dashboard.html';
        }, 1200);
      }
    } catch (error) {
      showToast(error.message || 'Error generating predictions. Please try again.', 'error');
    } finally {
      toggleSpinner(false);
    }
  });

  // Initialize
  showStep(1);
});
