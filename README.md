# Purple Dragon Attendance PWA — Phase 3

This build adds the production-facing student experience on top of the proven
Phase 2 offline sync architecture.

## New in Phase 3

- Purple Dragon crest on the student screens
- **Forgot Your Number?** button and offline local-roster search
- search result → normal name confirmation → attendance
- **Trial Class Sign-In**
- trial sign-ins are stored locally first and sync later
- reliable reconnect sync:
  - immediately on online event
  - retry after 3, 10 and 30 seconds
  - retry when app returns to foreground
  - retry on focus
  - one-minute safety check while open
- Clear Attendance test control removed from the UI
- Device / Sync Status retained
- separate pending counts for attendance and trials

## Important: keep your existing config.js

This ZIP deliberately contains **config.example.js**, not `config.js`.

Your GitHub repository already has a working `config.js` containing your Apps
Script `/exec` URL. Leave that file alone when uploading Phase 3.

## Google Sheet changes

### Log
- A Timestamp
- B Name
- C PIN
- D Attendance ID

### Trials
- A Timestamp
- B Full Name
- C Email
- D Notes
- E Trial ID

Existing rows remain valid.

## Deploy

1. Replace your Apps Script Code.gs with the supplied Phase 3 Code.gs.
2. Save and update the existing Apps Script web-app deployment.
3. Upload the Phase 3 PWA files to GitHub.
4. Do **not** delete or replace the existing `config.js`.
5. Commit.
6. Wait for GitHub Pages to deploy.
7. Open the PWA online, close it, then reopen once so service-worker v5 controls it.
8. Open Device / Sync Status and press Sync Now once.
9. Test:
   - regular student sign-in
   - Forgot Your Number?
   - Trial Class Sign-In
   - offline sign-in, then reconnect and watch it sync automatically.

The crest is loaded from the same Purple Dragon URL used in the production
Apps Script app and is cached by the service worker after the first successful
online load, so it remains available offline afterward.
