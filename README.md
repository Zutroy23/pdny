# Purple Dragon Attendance PWA — Phase 4

Phase 4 brings the production admin/member workflow into the PWA and includes
the two fixes identified during Phase 3 testing.

## Phase 3 fixes carried forward

- Keypad bottom row is now: **Clear | 0 | ⌫**
- `⌫` removes only the last entered digit.
- If a student or trial sign-in is created while another sync is already in
  progress, the app remembers that another sync is required and immediately
  runs a second pass when the current sync finishes.
- The reconnect retry logic from the prior build remains:
  - immediate
  - 3 seconds
  - 10 seconds
  - 30 seconds
  - foreground/focus retry
  - one-minute safety retry

## PWA Admin

Tap the Purple Dragon crest on the main keypad to open Admin.

The main Admin hub uses the six-tile layout:

1. Add Student
2. Deactivate Student
3. Today's Sign-ins
4. Attendance Catch Up
5. Reporting
6. Admin

### Member management

- Add Student creates the next student number and sets Active = TRUE.
- Deactivate Student sets Members column D to FALSE.
- Reactivate Student sets it back to TRUE.
- Member rows and historical attendance are never deleted.

### Reporting

- Attendance Dashboard uses the existing server-side dashboard calculations.
- CSV export uses the existing attendance CSV report.

### Admin settings

- Open Google Sheet
- Change Admin PIN
- Refresh App Cache
- Exit to Sign-In

## Important deployment note

Keep your existing configured `config.js` in GitHub. This package contains only
`config.example.js` so it cannot accidentally overwrite your working Apps
Script URL.

## Deployment

1. Replace Apps Script `Code.gs` with `Dojo_Code_PWA_Phase4.gs`.
2. Save and update the existing Apps Script web-app deployment.
3. Upload the files from this PWA package to GitHub.
4. Do NOT remove or replace your existing `config.js`.
5. Commit and wait for GitHub Pages.
6. Open the PWA online, close it, and reopen it once so service worker v6 takes control.
7. Press Sync Now once.
8. Test a normal online sign-in and confirm it syncs promptly.
9. Test the ⌫ keypad button.
10. Tap the crest and test the Admin PIN and member/admin screens.

Admin operations intentionally require an internet connection because they
change or report on the authoritative Google Sheet data.
