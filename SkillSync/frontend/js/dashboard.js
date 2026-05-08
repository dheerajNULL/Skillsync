/**
 * SkillSync – Dashboard JavaScript
 * Handles dashboard rendering, Chart.js charts, predictions display, and history
 */

document.addEventListener('DOMContentLoaded', () => {
  // Require authentication
  if (!requireAuth()) return;

  const user = getUser();
  let latestPredictions = null;
  let latestSkills = null;

  // Set welcome message
  const userName = document.getElementById('userName');
  if (userName && user) {
    userName.textContent = user.name || 'User';
  }

  // Load cached data
  try {
    latestPredictions = JSON.parse(localStorage.getItem('skillsync_latest_predictions'));
    latestSkills = JSON.parse(localStorage.getItem('skillsync_latest_skills'));
  } catch (e) { /* ignore */ }

  // ============================================================
  // Sidebar Navigation
  // ============================================================
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const sections = document.querySelectorAll('.dash-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = item.dataset.section;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      sections.forEach(s => s.classList.remove('active'));
      const target = document.getElementById(`section${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`);
      if (target) target.classList.add('active');
    });
  });

  // Mobile sidebar toggle
  const mobileSidebarBtn = document.getElementById('mobileSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  if (mobileSidebarBtn) {
    mobileSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearAuth();
    localStorage.removeItem('skillsync_latest_predictions');
    localStorage.removeItem('skillsync_latest_skills');
    showToast('Logged out successfully', 'info');
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
  });

  // ============================================================
  // Load Dashboard Data
  // ============================================================
  initDashboard();

  async function initDashboard() {
    toggleSpinner(true);

    try {
      // Load history
      if (user) {
        const historyData = await apiRequest(`/results/history/${user.id}`);
        if (historyData && historyData.success && historyData.data.length > 0) {
          renderHistory(historyData.data);
          document.getElementById('assessmentCountDisplay').textContent = historyData.data.length;

          // Use latest from history if no cached predictions
          if (!latestPredictions && historyData.data.length > 0) {
            const latest = historyData.data[0];
            latestPredictions = {
              predicted_role: latest.predicted_role,
              confidence_score: latest.confidence_score,
              top_matches: latest.top_matches
            };
            latestSkills = latest.skills_used;
          }
        }

        // Load skills
        try {
          const skillsData = await apiRequest(`/skills/${user.id}`);
          if (skillsData && skillsData.success) {
            latestSkills = {
              technical: skillsData.data.technical_skills,
              soft: skillsData.data.soft_skills,
              interest: skillsData.data.interest_level
            };
          }
        } catch (e) { /* no skills yet */ }
      }
    } catch (e) {
      console.error('Dashboard load error:', e);
    }

    // Render dashboard
    if (latestPredictions) {
      renderOverview();
      renderPredictions();
      renderCharts();
      document.getElementById('emptyState').style.display = 'none';
    } else {
      document.getElementById('emptyState').style.display = 'block';
      // Hide charts row if no data
      const chartsRow = document.querySelector('.charts-row');
      if (chartsRow) chartsRow.style.display = 'none';
      const statsRow = document.querySelector('.stats-row');
      if (statsRow) statsRow.style.display = 'none';
    }

    toggleSpinner(false);
  }

  // ============================================================
  // Render Overview Stats
  // ============================================================
  function renderOverview() {
    if (!latestPredictions) return;

    document.getElementById('topRoleDisplay').textContent = latestPredictions.predicted_role;
    document.getElementById('confidenceDisplay').textContent = `${latestPredictions.confidence_score}%`;

    const totalSkills = (latestSkills?.technical?.length || 0) + (latestSkills?.soft?.length || 0);
    document.getElementById('skillCountDisplay').textContent = totalSkills;
  }

  // ============================================================
  // Render Charts
  // ============================================================
  function renderCharts() {
    if (!latestSkills || !latestPredictions) return;

    // Pie Chart — Skill Distribution
    const pieCtx = document.getElementById('skillPieChart').getContext('2d');
    new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Technical Skills', 'Soft Skills', 'Interest Area'],
        datasets: [{
          data: [
            latestSkills.technical?.length || 0,
            latestSkills.soft?.length || 0,
            1
          ],
          backgroundColor: [
            'rgba(79, 70, 229, 0.8)',
            'rgba(124, 58, 237, 0.8)',
            'rgba(6, 182, 212, 0.8)'
          ],
          borderColor: [
            'rgba(79, 70, 229, 1)',
            'rgba(124, 58, 237, 1)',
            'rgba(6, 182, 212, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10, font: { family: 'Inter', size: 12, weight: '500' } }
          }
        }
      }
    });

    // Bar Chart — Career Match Scores
    const barCtx = document.getElementById('careerBarChart').getContext('2d');
    const allScores = latestPredictions.all_scores || latestPredictions.top_matches;
    const topRoles = (allScores || []).slice(0, 5);

    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: topRoles.map(r => r.role),
        datasets: [{
          label: 'Match Score %',
          data: topRoles.map(r => r.score),
          backgroundColor: [
            'rgba(79, 70, 229, 0.8)',
            'rgba(124, 58, 237, 0.7)',
            'rgba(6, 182, 212, 0.7)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(245, 158, 11, 0.6)'
          ],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 36
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: { max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'Inter', size: 11 } } },
          y: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12, weight: '600' } } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // ============================================================
  // Render Predictions
  // ============================================================
  function renderPredictions() {
    if (!latestPredictions || !latestPredictions.top_matches) return;

    const grid = document.getElementById('predictionsGrid');
    grid.innerHTML = '';

    latestPredictions.top_matches.forEach((match, index) => {
      const card = document.createElement('div');
      card.className = `prediction-card ${index === 0 ? 'top-match' : ''}`;

      const rankLabels = ['🥇 Top Match', '🥈 2nd Match', '🥉 3rd Match'];
      const skillTags = (match.recommended_skills || []).slice(0, 4).map(s => `<span class="skill-tag">${s}</span>`).join('');

      card.innerHTML = `
        <span class="prediction-rank">${rankLabels[index] || `#${index + 1}`}</span>
        <h3 class="prediction-role">${match.role}</h3>
        <div class="prediction-score">${match.score}<span>%</span></div>
        <div class="prediction-skills">
          <h4>Recommended Skills</h4>
          <div>${skillTags}</div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Render roadmap for top match
    renderRoadmap(latestPredictions.top_matches[0]);
  }

  // ============================================================
  // Render Roadmap
  // ============================================================
  function renderRoadmap(topMatch) {
    if (!topMatch || !topMatch.roadmap) return;

    const section = document.getElementById('roadmapSection');
    const timeline = document.getElementById('roadmapTimeline');
    section.style.display = 'block';
    timeline.innerHTML = '';

    topMatch.roadmap.forEach((step, i) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'roadmap-step';
      stepEl.innerHTML = `
        <span class="roadmap-step-num">Step ${i + 1}</span>
        <span class="roadmap-step-title">${step}</span>
      `;
      timeline.appendChild(stepEl);
    });
  }

  // ============================================================
  // Render History
  // ============================================================
  function renderHistory(history) {
    const list = document.getElementById('historyList');
    if (!history || history.length === 0) return;

    list.innerHTML = '';

    history.forEach(item => {
      const date = new Date(item.timestamp).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const el = document.createElement('div');
      el.className = 'history-item';
      el.innerHTML = `
        <div>
          <div class="history-role">${item.predicted_role}</div>
          <div class="history-date">${date}</div>
        </div>
        <div class="history-score">${item.confidence_score}%</div>
      `;
      list.appendChild(el);
    });
  }
});
