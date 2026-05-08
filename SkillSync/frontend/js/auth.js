/**
 * SkillSync – Authentication JavaScript
 * Handles login, signup, form validation, and JWT storage
 */

document.addEventListener('DOMContentLoaded', () => {

  /**
   * Detect network/connection errors across browsers
   */
  function isNetworkError(error) {
    const msg = (error.message || '').toLowerCase();
    return error instanceof TypeError && (
      msg.includes('load failed') ||        // Safari
      msg.includes('failed to fetch') ||     // Chrome
      msg.includes('networkerror')           // Firefox
    );
  }

  // If already logged in, redirect to dashboard
  if (isAuthenticated()) {
    window.location.href = '../dashboard.html';
    return;
  }

  // DOM Elements
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const tabIndicator = document.getElementById('tabIndicator');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const switchToSignup = document.getElementById('switchToSignup');
  const switchToLogin = document.getElementById('switchToLogin');

  // Check URL params for mode
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'signup') {
    switchTab('signup');
  }

  /**
   * Switch between login and signup tabs
   */
  function switchTab(tab) {
    if (tab === 'signup') {
      loginTab.classList.remove('active');
      signupTab.classList.add('active');
      loginForm.classList.remove('active');
      signupForm.classList.add('active');
      tabIndicator.classList.add('right');
      document.title = 'SkillSync – Sign Up';
    } else {
      signupTab.classList.remove('active');
      loginTab.classList.add('active');
      signupForm.classList.remove('active');
      loginForm.classList.add('active');
      tabIndicator.classList.remove('right');
      document.title = 'SkillSync – Sign In';
    }
  }

  // Tab click handlers
  loginTab.addEventListener('click', () => switchTab('login'));
  signupTab.addEventListener('click', () => switchTab('signup'));
  switchToSignup.addEventListener('click', (e) => { e.preventDefault(); switchTab('signup'); });
  switchToLogin.addEventListener('click', (e) => { e.preventDefault(); switchTab('login'); });

  // Password visibility toggles
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (target.type === 'password') {
        target.type = 'text';
        btn.textContent = '🙈';
      } else {
        target.type = 'password';
        btn.textContent = '👁️';
      }
    });
  });

  /**
   * Handle Login Form Submission
   */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    toggleSpinner(true);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (data && data.success) {
        saveAuth(data.token, data.user);
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '../dashboard.html';
        }, 1000);
      }
    } catch (error) {
      const msg = isNetworkError(error)
        ? 'Cannot connect to the server. Please make sure the backend is running.'
        : (error.message || 'Login failed. Please check your credentials.');
      showToast(msg, 'error');
    } finally {
      toggleSpinner(false);
    }
  });

  /**
   * Handle Signup Form Submission
   */
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const major = document.getElementById('signupMajor').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    // Validation
    if (!name || !email || !password) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    if (password !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }

    toggleSpinner(true);

    try {
      const data = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, major })
      });

      if (data && data.success) {
        saveAuth(data.token, data.user);
        showToast('Account created! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '../dashboard.html';
        }, 1000);
      }
    } catch (error) {
      const msg = isNetworkError(error)
        ? 'Cannot connect to the server. Please make sure the backend is running.'
        : (error.message || 'Signup failed. Please try again.');
      showToast(msg, 'error');
    } finally {
      toggleSpinner(false);
    }
  });
});
