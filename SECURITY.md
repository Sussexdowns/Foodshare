# Security Hardening Documentation — Google Authentication Requirement

## Overview

The Foodshare app now **requires Google sign-in** for all user-submitted content actions:
- Submitting a new source/location
- Liking / disliking a source
- Reporting a source (via modal)
- Sending a contact message

Public read access to approved locations remains available without authentication.

---

## Report Modal Implementation

A Bootstrap 5 modal has been added for reporting locations. The modal includes:

- **Reason dropdown**: incorrect, unsafe, duplicate, seasonal, other
- **Details textarea**: optional context
- **Submit button**: creates a document in the `reports` Firestore collection

### Data Model

```javascript
{
  sourceId: string,   // ID of reported source
  reason: string,     // selected reason (e.g., 'duplicate')
  details: string,    // optional free-text description
  userId: string,     // Firebase UID of reporter
  userEmail: string,  // Reporter's email
  name: string,       // reason (mirrors your schema)
  status: 'pending',  // initial status
  adminNote: '',      // for admin use
  createdAt: serverTimestamp
}
```

### Firestore Rules for `/reports`

```firestore
match /reports/{reportId} {
  // Admins can read, update, delete
  allow read, update, delete: if request.auth != null
    && request.auth.token.firebase.sign_in_provider == 'google.com'
    && exists(/databases/$(database)/documents/users/$(request.auth.uid))
    && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

  // Authenticated Google users can create reports
  allow create: if request.auth != null
                && request.auth.token.firebase.sign_in_provider == 'google.com'
                && request.resource.data.keys().hasAll(['sourceId', 'reason', 'userId', 'name'])
                && request.resource.data.sourceId is string
                && request.resource.data.reason is string
                && request.resource.data.userId is string
                && request.resource.data.name is string
                && (request.resource.data.details is string || request.resource.data.details == null);
}
```

### Client-Side Flow

1. User clicks flag icon on a location (popup or footer).
2. If not signed in → prompt → Google sign-in popup → then modal opens.
3. Modal opens, user selects reason and optional details.
4. On submit:
   - Validates required fields.
   - Creates a new report document in `reports` collection.
   - Closes modal.
   - Also sends feedback to Apps Script to increment the source's `reports` counter (for display).
   - Stores a session flag to prevent duplicate reports this session.
5. Report button is disabled for the remainder of the session (sessionStorage).

### Files Modified

- `footer-details.html` — added report modal markup inside footer panel
- `index.html` — added report modal markup (before scripts), ensuring Bootstrap modal component exists
- `scripts/app.js` — added `openReportModal()`, `submitReport()`, updated `handleFeedbackClick` and `handleFooterActionClick` to route report action to modal, attached submit event listener (line ~2418)

---

## Previously Completed Hardening (Recap)

[... previous sections remain ...]

---

## Deployment Checklist (Updated)

- [x] Deploy Firestore rules with `reports` collection (publish in Firebase Console)
- [x] Add `firebase-auth-compat.js` to `index.html` (done)
- [x] `submit.html` and `contact.html` load Firebase Auth and `config.js` (done)
- [x] Deploy updated `scripts/app.js` to GitHub Pages
- [ ] (Optional) Update Apps Script to verify Firebase ID token
- [ ] Restrict Firebase API key to your domains in Google Cloud Console

---

## Testing Report Flow

1. Open map in incognito (no auth).
2. Click a location's flag → should prompt Google sign-in.
3. After sign-in, modal opens.
4. Select a reason, optionally add details, click Submit.
5. Verify success message appears.
6. Verify `reports` collection in Firestore gets a new document with correct fields.
7. Verify source's report count increments via Apps Script (check Google Sheet or UI).
8. Try reporting same location again → button disabled, sessionStorage prevents repeat.

---

## Outstanding Risks & Future Work

### Apps Script Feedback Endpoint (Like/Dislike/Report)
The Apps Script endpoint (`fileExec`) still does not verify Firebase ID tokens. For production-grade protection against API abuse, pass `firebase.auth().currentUser.getIdToken()` in the request and verify it server-side.

**Note**: The report modal writes directly to Firestore `reports` collection, which **does** enforce Google auth via security rules. The Apps Script increment for the report count is still used for backwards compatibility with existing sheet but is not the source of truth for report records.

### Contact Form Verification
The contact form posts to Google Forms; protection is client-side only. Consider routing through Apps Script with token validation.

### Admin Interface
You need an admin panel to view, update status (`pending`, `resolved_delete`, etc.), and add `adminNote` to reports. Create a simple protected page (admin-only) that queries `/reports` and allows updates.

### User Role Management
The admin check relies on a `role` field in the user's Firestore document at `/users/{uid}`. Ensure this field is set to `'admin'` for admin accounts. You can manually set via Firebase Console or create a self-service admin grant (securely).

### API Key Restrictions
Restrict Firebase API key to authorized domains in Google Cloud Console.
