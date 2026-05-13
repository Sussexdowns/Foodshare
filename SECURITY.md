### Client-Side Flow

1. User clicks flag icon on a location (popup or footer).
2. If not signed in → prompt → Google sign-in popup → after success, modal opens.
3. Modal shows with reason dropdown and optional details textarea.
4. On submit:
   - Validates required fields.
   - Creates a new report document in Firestore `reports` collection.
   - Closes modal.
   - Also sends feedback to Apps Script to increment the source's `reports` counter (for backwards compatibility with UI display).
   - Stores a session flag to prevent duplicate reports this session.
5. Report button is disabled for the remainder of the session.

---

## Bugs Fixed (2026-05-13)

- **Duplicate `itemsData` declaration** — `form.js` was declaring `let itemsData = {}` which conflicted with global `itemsData` from `app.js`. Changed to use the global.
- **Extra closing brace in submit.html** — Removed duplicate/incorrectly nested block causing `Unexpected token '}'` error at line 431.
- **Firebase "No Firebase App" error** — Fixed script load order: `config.js` must load before Firebase SDKs. Corrected paths in `submit.html` (`../config.js` → `config.js`). Removed duplicate inline Firebase initialization that conflicted with `app.js`'s `initializeFirebase()`.
- **Leaflet fullscreen icon CSP violation** — Added `cdn.jsdelivr.net` to `img-src` in CSP meta tags for pages using Leaflet fullscreen control (`index.html`, `submit.html`).
- **Syntax/duplicate function definitions** — Cleaned up `app.js` after refactor: removed stray duplicate code blocks, ensured all functions defined once.
- **Auth errors on report modal** — Added robust `signInWithGoogle()` with detailed error messages and proper timing. Ensured Firebase Auth is initialized before use.

---

## Deployment Checklist (Final)

- [x] Firestore rules deployed with `reports` collection permissions
- [x] All HTML pages include correct script order: `config.js` → Firebase SDKs → `sanitize.js` → `base.js` → `app.js` / page-specific scripts
- [x] CSP updated on all pages to include necessary image sources
- [x] Report modal present in `index.html` (or loaded via footer-details if using same modal globally)
- [x] Google sign-in enabled in Firebase Console → Authentication → Sign-in method
- [x] Authorized domains include `*.github.io` and any custom domain
- [ ] (Optional) Restrict Firebase API key in Google Cloud Console to authorized referrers
- [ ] (Optional) Update Apps Script to verify Firebase ID token for like/dislike/report actions
- [ ] (Optional) Create admin dashboard to manage reports

---

## Testing Steps

### Authentication
1. Open site in incognito.
2. Click a Like button → should see "Please sign in with Google" status, then sign-in popup.
3. Complete sign-in → success message, button count increments (if backend works).
4. Sign out (clear session or add sign-out button if implemented).

### Report Modal
1. Click flag icon → if not signed in, sign in first.
2. Modal opens; select a reason from dropdown, optionally add details.
3. Click Submit → spinner → success → modal closes.
4. Verify Firestore `reports` collection has a new document with correct fields (`sourceId`, `reason`, `userId`, `name`, `details`, `status: 'pending'`, `createdAt`).
5. Try reporting same location again → button disabled, sessionStorage prevents duplicate.
6. Check browser console for any errors.

### Submit Form
1. Navigate to Submit Content page.
2. Click on map to set location, optionally drag to adjust.
3. Fill form (category, item, name, description, etc.). Ensure name ≥ 2 chars.
4. Submit → if not signed in, must sign in first.
5. After auth, form submits to Firestore `sources` collection (approved=false).
6. Verify success message and form reset.

### Contact Form
1. Navigate to Contact page.
2. Fill name, email, message.
3. Submit → if not signed in, must sign in first.
4. After auth, form posts to Google Form.
5. Verify success alert.

### CSP & XSS
- Open browser console → no CSP violations (Leaflet icon allowed, images allowed).
- Try entering HTML tags in any text field → should be escaped (e.g., `<script>` appears as text, not executed).

### Firestore Rules
- Try writing directly to `sources` without auth or with missing fields → permission denied.
- Try writing to `reports` as non-Google user → permission denied.
- Admin can read/write reports; regular users can only create.

---

## Outstanding Issues

### Report Count Increment
Currently, `submitReport()` calls `submitFeedback(sourceId, 'report')` which POSTs to the Apps Script endpoint to increment the `reports` column in a Google Sheet. This is a separate backend from Firestore. For consistency, you may want to:
- Update the source document's `reports` field directly in Firestore using a transaction in the `submitReport` function after adding the report.
- Or rely solely on the `reports` collection and compute counts client-side by querying reports by sourceId.

The current approach duplicates report data (one in Firestore reports, one count in Apps Script sheet). Choose one source of truth.

### Admin Panel
No UI exists to view or manage reports. Create an admin-only page that:
- Lists all reports (query `reports` collection, ordered by `createdAt` desc)
- Allows admin to update `status` (`pending`, `resolved_delete`, `resolved_fixed`, `dismissed`) and add `adminNote`.
- Optionally delete the report or the associated source.

Admin check: `request.auth.token.firebase.sign_in_provider == 'google.com' && get(.../users/...).data.role == 'admin'`.

### User Role Management
Set admin role by manually updating a user's document in Firestore `users` collection: `{ role: 'admin', ... }`. Or create a self-serve admin grant (secure).

### reCAPTCHA on Submit Form
Currently no CAPTCHA on the source submission form. Consider adding reCAPTCHA v2/v3 to prevent spam. The client check is not server-verified currently.

### Contact Form Server Verification
Contact messages go directly to Google Forms without server-side auth check. To enforce Google login server-side, route through Apps Script that verifies Firebase ID token before posting to Google Sheet/Form.

---

## File Change Summary

**Modified:**
- `firestore.rules` — cleaned, added `/reports` with proper rules
- `index.html` — added report modal, updated CSP, fixed script order
- `submit.html` — fixed config path, removed duplicate init, fixed syntax error, updated CSP
- `contact.html` — cleaned script order, removed duplicate auth init
- `scripts/app.js` — added `openReportModal`, `submitReport`, auth checks, `initializeFirebase` improvements
- `scripts/form.js` — removed duplicate `itemsData` declaration
- `scripts/sanitize.js` — new (XSS/CSRF utilities)
- `SECURITY.md` — comprehensive documentation

**New:**
- Report modal in `index.html` (Bootstrap 5)
- `apps-script-code.gs` (server-side rate limiting stub)

---

**Last updated:** 2026-05-13  
**By:** Kilo Security Hardening & Report Feature Implementation
