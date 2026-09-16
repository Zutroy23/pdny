# Purple Dragon Attendance PWA — Phase 5

Phase 5 fixes the Admin regressions found during Phase 4 testing.

## Fixed

### Today's Sign-ins
- Every row again has a **Delete** button.
- Delete requires confirmation.
- The server-side Log row is removed.
- The matching local attendance record is also removed on that device so the
  student can legitimately sign in again after an accidental entry is deleted.

### Attendance Dashboard
The PWA now uses the real server response structure:
- `metrics`
- `chartRows`
- `studentRows`

It restores:
- KPI cards
- daily attendance graph
- attendance-by-student list
- tap a student to filter the graph and KPI cards
- clear student filter
- Today / Last 7 Days / This Week / This Month / Last 30 Days shortcuts

The student list always continues to show everyone in the selected range,
matching the production dashboard behavior.

### Admin sizing
- Online / Pending status header is hidden while inside Admin.
- Admin content is slightly narrower.
- Manage Members tiles and spacing are more compact vertically.

### Existing fixes retained
- Keypad: Clear | 0 | Backspace
- immediate second sync pass when a sign-in arrives during an active sync
- reconnect retries
- one-minute safety sync
- offline attendance and trial queues

### Additional fixes
- CSV export now reads the backend's actual `csvData` field.
- Add/deactivate/reactivate forces an immediate roster refresh on the PWA.

## Deployment

1. Replace Apps Script `Code.gs` with `Dojo_Code_PWA_Phase5.gs`.
2. Save and update the existing Apps Script web-app deployment.
3. Upload the Phase 5 PWA files to GitHub, replacing matching files.
4. Keep your existing configured `config.js`; do not replace it.
5. Commit and wait for GitHub Pages.
6. Open the PWA online, close it, then reopen it once so service worker v7 controls it.
7. Verify:
   - Today's Sign-ins -> Delete
   - Attendance Dashboard graph + student list
   - tap student -> filtered graph/KPIs
   - Admin screens fit without horizontal crowding
   - Manage Members fits vertically
