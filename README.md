# Purple Dragon Attendance PWA — Phase 2

This version adds real Google Sheet synchronization.

## What Phase 2 does

- downloads the active student roster from Google Apps Script
- stores the roster in IndexedDB for offline use
- records confirmed attendance locally first
- gives every attendance record a unique Attendance ID
- queues sign-ins when offline
- uploads queued sign-ins when online
- server-side duplicate protection
- displays:
  - Online / Offline
  - students stored
  - pending sign-ins
  - roster last updated
  - attendance last synced
- automatically syncs:
  - when the app opens online
  - when connectivity returns
  - after a sign-in while online
- includes a manual **Sync Now** button

## Members sheet

Expected columns:

- A = PIN / student number
- B = Name
- C = Historical / initial attendance count
- D = Active

Only active students are downloaded to the PWA roster.

## Log sheet

Phase 2 uses:

- A = Timestamp
- B = Name
- C = PIN
- D = Attendance ID

Old rows may have column D blank. That is fine.

## Setup

1. Replace your Apps Script `Code.gs` with the Phase 2 version supplied separately.
2. Save the Apps Script project.
3. Update the existing web-app deployment to the new version.
4. Copy the web-app `/exec` URL.
5. Open `config.js` and replace:

   `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE`

   with that `/exec` URL.
6. Upload the PWA files to the root of the GitHub repository.
7. Commit the changes.
8. Wait for GitHub Pages to redeploy.
9. Open the PWA while online.
10. Open **Device / Sync Status** and press **Sync Now**.
11. Confirm that the real student count appears.
12. Test one online sign-in, then one offline sign-in.

Do not clear local attendance while pending sign-ins exist.
