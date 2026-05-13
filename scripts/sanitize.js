/**
 * Security Utilities - sanitize.js
 * Provides XSS protection, input validation, and auth helpers
 */

// --- Admin Configuration ---
const ADMIN_EMAILS = ['fluphbusiness@gmail.com']; // Keep in sync with app.js

// --- Authentication Helpers ---

/**
 * Check if user is signed in with Google (non-anonymous)
 */
function isUserAuthenticated() {
  return typeof firebase !== 'undefined'
    && firebase.auth
    && firebase.auth().currentUser
    && firebase.auth().currentUser.providerData.some(p => p.providerId === 'google.com');
}

/**
 * Prompt user to sign in with Google
 * Returns a promise that resolves to true if sign-in successful
 */
async function signInWithGoogle() {
  if (typeof firebase === 'undefined' || typeof firebase.auth === 'undefined') {
    console.error('Firebase Auth not available');
    if (typeof addStatusMessage === 'function') {
      addStatusMessage('Firebase not loaded. Please refresh.', 'error');
    }
    return false;
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    const user = result.user;
    
    console.log('Signed in:', user.uid, user.email);
    
    // Create or update user profile in Firestore
    await createOrUpdateUserProfile(user);
    
    if (typeof addStatusMessage === 'function') {
      addStatusMessage('✅ Signed in with Google', 'success');
    }
    return true;
  } catch (err) {
    console.error('Google sign-in error:', err.code, err.message);
    
    if (err.code === 'auth/popup-blocked') {
      if (typeof addStatusMessage === 'function') addStatusMessage('Popup blocked. Allow popups.', 'error');
      alert('Popup blocked. Please allow popups for this site.');
    } else if (err.code === 'auth/popup-closed-by-user') {
      if (typeof addStatusMessage === 'function') addStatusMessage('Sign-in cancelled', 'info');
    } else if (err.code === 'auth/internal-error') {
      if (typeof addStatusMessage === 'function') addStatusMessage('Auth error. Check console.', 'error');
      alert('Authentication error. Ensure Google sign-in is enabled in Firebase Console and third-party cookies are allowed.');
    } else if (err.code === 'auth/network-request-failed') {
      if (typeof addStatusMessage === 'function') addStatusMessage('Network error.', 'error');
      alert('Network error.');
    } else {
      if (typeof addStatusMessage === 'function') addStatusMessage('Sign-in failed: ' + err.message, 'error');
    }
    return false;
  }
}

/**
 * Create or update user profile document in Firestore
 */
async function createOrUpdateUserProfile(user) {
  if (!user || !user.uid) return;

  try {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();

    const isAdmin = ADMIN_EMAILS.includes((user.email || '').toLowerCase());
    const role = doc.exists ? (doc.data()?.role || (isAdmin ? 'admin' : 'user')) : (isAdmin ? 'admin' : 'user');

    const userData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      photoURL: user.photoURL || null,
      role: role,
      createdAt: doc.exists ? doc.data()?.createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    };

    await userRef.set(userData, { merge: true });
    console.log('User profile ensured:', user.uid, 'role:', userData.role);
  } catch (err) {
    console.error('Error creating/updating user profile:', err);
  }
}

// --- XSS Protection ---

// Simple HTML escape function for text content
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Sanitize URL - ensure it's a valid HTTP/HTTPS URL
function sanitizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url, window.location.origin);
    // Only allow http and https protocols
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch (e) {
    // Invalid URL
  }
  return '';
}

// Sanitize and escape for use in HTML attribute context
function escapeAttribute(value) {
  if (!value) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Create safe text node
function safeText(text) {
  return escapeHtml(text);
}

// CSRF token management - generates per-session token
function generateCsrfToken() {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  try {
    localStorage.setItem('csrf_token', token);
  } catch (e) {
    console.warn('Unable to save CSRF token to localStorage:', e);
  }
  return token;
}

function getCsrfToken() {
  try {
    let token = localStorage.getItem('csrf_token');
    if (!token) {
      token = generateCsrfToken();
    }
    return token;
  } catch (e) {
    return generateCsrfToken();
  }
}

function validateCsrfToken(token) {
  try {
    const stored = localStorage.getItem('csrf_token');
    return token && stored && token === stored;
  } catch (e) {
    return false;
  }
}

// DOMPurify-like simple sanitizer for rich text (basic)
function sanitizeHtml(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Rate limiting helpers
function getRateLimitKey(action, identifier) {
  return `rate_limit_${action}_${identifier}`;
}

function checkRateLimit(key, maxCalls, windowMs) {
  const now = Date.now();
  const calls = JSON.parse(localStorage.getItem(key) || '[]');

  // Filter out calls outside the window
  const recentCalls = calls.filter(time => now - time < windowMs);

  if (recentCalls.length >= maxCalls) {
    return { allowed: false, remaining: 0, reset: now + windowMs };
  }

  return { allowed: true, remaining: maxCalls - recentCalls.length - 1 };
}

function recordRateLimitCall(key, windowMs) {
  const now = Date.now();
  const calls = JSON.parse(localStorage.getItem(key) || '[]');
  calls.push(now);
  localStorage.setItem(key, JSON.stringify(calls));
}

// Export to global scope
window.SecurityUtils = {
  escapeHtml,
  sanitizeUrl,
  escapeAttribute,
  safeText,
  generateCsrfToken,
  getCsrfToken,
  validateCsrfToken,
  sanitizeHtml,
  getRateLimitKey,
  checkRateLimit,
  recordRateLimitCall
};

// Export auth helpers to window for cross-script access
window.isUserAuthenticated = isUserAuthenticated;
window.signInWithGoogle = signInWithGoogle;
