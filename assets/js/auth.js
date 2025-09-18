// Structure
// ----------------------
// 1. Signup Modal Authentication
// 2. signin MOdal Authentication



// 1. Signup Modal Authentication

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const signupBtn = document.getElementById('signupBtn');
  const signupBtnText = document.getElementById('signupBtnText');
  const signupSpinner = document.getElementById('signupSpinner');

  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const serverError = document.getElementById('serverError');
  const serverSuccess = document.getElementById('serverSuccess');

  function clearErrors() {
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    serverError.textContent = '';
    serverSuccess.textContent = '';
  }

  function setLoading(on) {
    if (on) {
      signupBtn.setAttribute('disabled', 'disabled');
      signupSpinner.classList.remove('d-none');
    } else {
      signupBtn.removeAttribute('disabled');
      signupSpinner.classList.add('d-none');
    }
  }

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    // gather values
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const contactNo = document.getElementById('contactNo').value.trim();
    const genderInput = signupForm.querySelector('input[name="gender"]:checked');
    const gender = genderInput ? genderInput.value : null;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const membershipSelect = document.getElementById('membership');
    const membership = membershipSelect ? membershipSelect.value : null;

    // client-side checks (UX only)
    let hasError = false;
    if (password !== confirmPassword) {
      confirmPasswordError.textContent = 'Passwords do not match.';
      hasError = true;
    }
    if (password.length < 8) {
      passwordError.textContent = 'Password must be at least 8 characters.';
      hasError = true;
    }
    if (!email) {
      serverError.textContent = 'Email is required.'; // alternatively show under email input by adding placeholder
      hasError = true;
    }
    if (!membership) {
      serverError.textContent = 'Please choose a membership.';
      hasError = true;
    }
    if (hasError) return;

    const payload = { fullname, email, contactNo, gender, membership, password };

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include' // include cookies if backend sets httpOnly cookie
      });

      // parse JSON if possible
      const text = await response.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (err) { data = null; }

      if (!response.ok) {
        // handle common error shapes:
        // 1) { message: "..." }
        // 2) { errors: { field1: "msg", field2: "msg" } }
        if (data) {
          if (data.errors && typeof data.errors === 'object') {
            // map field errors to inputs (best-effort)
            if (data.errors.password) passwordError.textContent = data.errors.password;
            if (data.errors.confirmPassword) confirmPasswordError.textContent = data.errors.confirmPassword;
            if (data.errors.email) serverError.textContent = data.errors.email;
            // fallback general message
            if (data.message) serverError.textContent = data.message;
          } else if (data.message) {
            serverError.textContent = data.message;
          } else {
            serverError.textContent = `Registration failed: ${response.status}`;
          }
        } else {
          serverError.textContent = `Registration failed: ${response.status}`;
        }
        setLoading(false);
        return;
      }

      // success
      // data may contain { token: "...", message: "..." } OR the backend may set an httpOnly cookie
      if (data && data.token) {
        try {
          // fallback: store token if backend returns it (not ideal for security)
          localStorage.setItem('token', data.token);
        } catch (e) { /* ignore storage errors */ }
      }

      serverSuccess.textContent = (data && data.message) ? data.message : 'Registration successful';

      // close modal after short delay so user sees success text (optional)
      setTimeout(() => {
        const modalEl = document.getElementById('signupModal');
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
        // optional: redirect to dashboard or refresh
        // window.location.href = '/dashboard';
      }, 700);

    } catch (err) {
      console.error('Network error', err);
      serverError.textContent = 'Network error. Please try again later.';
    } finally {
      setLoading(false);
    }
  });

  // toggle password visibility (optional)
  // document.querySelectorAll('.toggle-password').forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     const input = btn.closest('.input-group').querySelector('input[type="password"], input[type="text"]');
  //     if (!input) return;
  //     input.type = (input.type === 'password') ? 'text' : 'password';
  //     btn.querySelector('i').classList.toggle('fa-eye-slash');
  //   });
  // });



});

// 1. Signup modal Authentication end











// 2. Signin modal Authentication start

// auth.js
document.addEventListener('DOMContentLoaded', () => {
  const LOGIN_URL = 'http://localhost:8081/api/auth/login'; // update if backend base url differs

  // Form + elements (IDs expected to exist from your HTML)
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginSubmitBtn');
  const loginBtnText = document.getElementById('loginBtnText'); // optional
  const loginSpinner = document.getElementById('loginSpinner'); // optional (a spinner element)
  const loginError = document.getElementById('loginError');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const rememberCheckbox = document.getElementById('rememberMe');

  if (!loginForm) {
    console.warn('auth.js: #loginForm not found — aborting initialization.');
    return;
  }

  // Safe helpers for UI feedback
  function clearError() {
    if (!loginError) return;
    loginError.textContent = '';
    loginError.classList.add('d-none');
  }

  function showError(message) {
    if (!loginError) {
      // fallback: alert
      console.warn('loginError element missing; fallback to alert.');
      alert(message || 'Login failed. Please try again.');
      return;
    }
    loginError.textContent = message || 'Login failed. Please try again.';
    loginError.classList.remove('d-none');
  }

  function setLoading(on) {
    try {
      if (on) {
        if (loginBtn) loginBtn.setAttribute('disabled', 'disabled');
        if (loginSpinner) loginSpinner.classList.remove('d-none');
        // if separate text node exists, hide it and show spinner inside button
        if (loginBtnText) loginBtnText.classList.add('visually-hidden');
        // fallback: change innerHTML
        if (!loginSpinner && loginBtn) {
          loginBtn._origHtml = loginBtn._origHtml || loginBtn.innerHTML;
          loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing in...';
        }
      } else {
        if (loginBtn) loginBtn.removeAttribute('disabled');
        if (loginSpinner) loginSpinner.classList.add('d-none');
        if (loginBtnText) loginBtnText.classList.remove('visually-hidden');
        if (loginBtn && loginBtn._origHtml) loginBtn.innerHTML = loginBtn._origHtml;
      }
    } catch (err) {
      console.warn('setLoading error', err);
    }
  }

  // Restore remembered email (if any)
  try {
    const remembered = localStorage.getItem('rememberEmail');
    if (remembered && emailInput) {
      emailInput.value = remembered;
      if (rememberCheckbox) rememberCheckbox.checked = true;
    }
  } catch (e) {
    console.warn('localStorage unavailable', e);
  }

  // Toggle password visibility (uses .toggle-password buttons inside input-group)
  // document.querySelectorAll('.toggle-password').forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     const input = (btn.closest && btn.closest('.input-group')) 
  //       ? btn.closest('.input-group').querySelector('input[type="password"], input[type="text"]') 
  //       : passwordInput;
  //     if (!input) return;
  //     input.type = (input.type === 'password') ? 'text' : 'password';

  //     const icon = btn.querySelector('i');
  //     if (icon) {
  //       icon.classList.toggle('fa-eye');
  //       icon.classList.toggle('fa-eye-slash');
  //     }
  //   });
  // });



  // Main submit handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const resp = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        // include credentials if your backend sets cookies (optional)
        // credentials: 'include'
      });

      // Try to parse response body (safe)
      const text = await resp.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (err) { data = null; }

      if (!resp.ok) {
        // derive a friendly message from common shapes
        if (data) {
          if (data.message) showError(data.message);
          else if (data.error) showError(data.error);
          else showError(JSON.stringify(data));
        } else {
          showError(`Login failed: ${resp.status} ${resp.statusText}`);
        }
        return;
      }

      // Success: expected shape { token, email, role, fullname }
      if (!data || !data.token) {
        showError('Login succeeded but server did not return a token.');
        return;
      }

      // Persist token & user info (localStorage). Consider server-set httpOnly cookies for production.
      try {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.email || '');
        localStorage.setItem('userFullname', data.fullname || '');
        localStorage.setItem('userRole', data.role ? JSON.stringify(data.role) : '');
      } catch (err) {
        console.warn('Failed to write localStorage', err);
      }

      // Remember email if requested
      try {
        if (rememberCheckbox && rememberCheckbox.checked) {
          localStorage.setItem('rememberEmail', email);
        } else {
          localStorage.removeItem('rememberEmail');
        }
      } catch (err) { /* ignore */ }

      // Close Bootstrap modal if it exists
      try {
        const modalEl = document.getElementById('loginModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      } catch (err) { /* ignore */ }

      // Redirect to dashboard
      window.location.href = 'dashboard.html';

    } catch (err) {
      console.error('Network/login error', err);
      showError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  });

  // Expose a helper for authenticated fetch calls (adds Authorization header)
  window.authFetch = async (url, opts = {}) => {
    const token = (() => {
      try { return localStorage.getItem('authToken'); } catch (e) { return null; }
    })();

    const headers = new Headers(opts.headers || {});
    if (token) headers.set('Authorization', 'Bearer ' + token);

    let body = opts.body;
    if (body && typeof body === 'object' && !(body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(body);
    }

    const merged = { ...opts, headers, body };
    return fetch(url, merged);
  };

});





/* Delegated password visibility toggle — add this ONCE at the end of auth.js */
(function passwordToggleDelegated() {
  // ensure icons accept clicks (useful if FA inserted svg with pointer-events:none)
  try {
    const style = document.createElement('style');
    style.textContent = `
      .toggle-password { cursor: pointer; user-select: none; }
      .toggle-password i, .toggle-password svg { pointer-events: auto; vertical-align: middle; }
    `;
    document.head.appendChild(style);
  } catch (e) { /* ignore if head not present yet */ }

  // Helper to set a predictable <i> icon (so toggling classes is consistent)
  function setButtonIcon(btn, showText) {
    const iEl = btn.querySelector('i');
    if (iEl) {
      if (showText) {
        iEl.classList.remove('fa-eye');
        iEl.classList.add('fa-eye-slash');
      } else {
        iEl.classList.remove('fa-eye-slash');
        iEl.classList.add('fa-eye');
      }
      return;
    }
    // Replace inner content with <i> if FA kit produced svg (makes subsequent toggling predictable)
    btn.innerHTML = showText ? '<i class="fas fa-eye-slash" aria-hidden="true"></i>' : '<i class="fas fa-eye" aria-hidden="true"></i>';
  }

  // Delegated click handler (works for dynamic content & after FA swaps nodes)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest ? e.target.closest('.toggle-password') : null;
    if (!btn) return;

    // prevent default in case it's inside an <a> or similar
    e.preventDefault();

    const group = btn.closest('.input-group');
    if (!group) return;
    const input = group.querySelector('input[type="password"], input[type="text"]');
    if (!input) return;

    const willShowText = input.type === 'password';
    input.type = willShowText ? 'text' : 'password';

    setButtonIcon(btn, willShowText);

    // focus input so typing continues smoothly
    try { input.focus(); } catch (err) { /* ignore */ }

    // accessibility labels
    btn.setAttribute('aria-pressed', String(willShowText));
    btn.setAttribute('aria-label', willShowText ? 'Hide password' : 'Show password');
  }, { passive: false });
})();


