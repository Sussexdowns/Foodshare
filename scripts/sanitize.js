/**
 * Security Utilities - sanitize.js
 * Provides XSS protection and input validation
 */

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
