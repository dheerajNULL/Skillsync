/**
 * SkillSync – API Service
 * Centralized Fetch API wrapper with JWT token handling
 */

const API_BASE = 'https://skillsync-dizx.onrender.com/api';

/**
 * Get stored JWT token from localStorage
 */
function getToken() {
  return localStorage.getItem('skillsync_token');
}

/**
 * Get stored user data from localStorage
 */
function getUser() {
  const user = localStorage.getItem('skillsync_user');
  return user ? JSON.parse(user) : null;
}

/**
 * Save auth data to localStorage
 */
function saveAuth(token, user) {
  localStorage.setItem('skillsync_token', token);
  localStorage.setItem('skillsync_user', JSON.stringify(user));
}

/**
 * Clear auth data (logout)
 */
function clearAuth() {
  localStorage.removeItem('skillsync_token');
  localStorage.removeItem('skillsync_user');
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  return !!getToken();
}

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/auth/login')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    // Handle token expiration
    if (response.status === 401) {
      clearAuth();
      showToast('Session expired. Please log in again.', 'warning');
      setTimeout(() => {
        window.location.href = '/frontend/pages/auth.html';
      }, 1500);
      return null;
    }

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, info, warning)
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;

  container.appendChild(toast);

  // Auto-remove after 3.5 seconds
  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Show/hide loading spinner
 * @param {boolean} show - Whether to show the spinner
 */
function toggleSpinner(show) {
  const spinner = document.getElementById('spinnerOverlay');
  if (spinner) {
    if (show) {
      spinner.classList.add('active');
    } else {
      spinner.classList.remove('active');
    }
  }
}

/**
 * Redirect to auth page if not authenticated
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = window.location.pathname.includes('/pages/')
      ? 'auth.html'
      : 'pages/auth.html';
    return false;
  }
  return true;
}
