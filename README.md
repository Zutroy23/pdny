# Purple Dragon Attendance PWA — Phase 6

Phase 6 adds belt/rank tracking, student management, bulk post-exam promotions, and belt images while preserving the existing offline-first attendance workflow.

## New in Phase 6

- New students default to **Unofficial White Belt** and **Elite = false**.
- Active-roster sync now includes rank, Elite status, belt image, base days, and standard next exam rank.
- Student confirmation shows the student's belt image and rank when a rank is assigned.
- Forgot-number results also show rank to help distinguish duplicate names.
- **Manage Students** admin screen:
  - search all students (active or inactive)
  - edit name
  - edit rank
  - toggle Elite where that rank supports it
  - edit base days
  - edit Active status
  - student number remains read-only
  - explicit review/confirm before saving
- **Belt Promotions** admin screen:
  - choose exam date
  - load/search active students
  - normal target defaults to the next full belt/rank, skipping bars/partial ranks
  - override any student's target rank
  - toggle Elite on eligible target ranks
  - apply selected promotions in one batch
- Rank/Elite changes are logged to a new `BeltHistory` sheet automatically.
- `Members` adds:
  - Column E: `Rank ID`
  - Column F: `Elite`
- 89 local belt PNG assets are included under `/belts`, so belt confirmation works offline after the service worker is installed.
- PWA cache bumped to `purple-dragon-pwa-v8`.
- The obsolete PWA **Refresh App Cache** button was removed.
- Fixed the nested Attendance-by-Student list width overflow.
- Fixed admin deletion of today's attendance so it can also remove the matching local PWA attendance record (`window.PDDB` is now exposed intentionally for this admin action).

## Existing students

Existing Members rows are **not automatically assigned Unofficial White**. Their Rank ID remains blank until set in Manage Students. This avoids incorrectly changing the rank of existing students.

New students are automatically:

- Base days: 0
- Active: TRUE
- Rank ID: `UNOFFICIAL_WHITE`
- Elite: FALSE

## Deployment

### 1. Apps Script

Replace the current Apps Script `Code.gs` contents with `Dojo_Code_PWA_Phase6.gs`.

Then:

1. Save the Apps Script project.
2. Open **Deploy → Manage deployments**.
3. Edit the existing Web app deployment.
4. Create/select a **new version**.
5. Deploy/update it.

Do not create a different endpoint unless you intentionally want the PWA URL configuration to change.

### 2. GitHub Pages PWA

Upload/replace the Phase 6 PWA files in the `pdny` repository.

**Keep your existing `config.js`.** This package intentionally contains only `config.example.js`; do not delete or overwrite your configured `config.js`.

Upload the entire `belts` folder as well.

Commit the changes and wait for GitHub Pages to publish.

### 3. Refresh the installed PWA

Open the PWA while online, then close and reopen it once so service worker v8 can install and take control.

Use **Device / Sync Status → Sync Now** once after deployment to confirm the new roster fields have downloaded.

## First test sequence

1. Sign in as Admin.
2. Open **Manage Students**.
3. Choose an existing student and assign a rank.
4. Save and return to student sign-in.
5. Sign that student in and confirm the correct belt image/rank appears.
6. Add a test student and verify the new student is Unofficial White.
7. Open **Belt Promotions**.
8. Select a student and verify the target defaults to the next full belt/rank rather than Bar 1.
9. Change one target manually to a bar/partial rank to test override.
10. Test the Elite checkbox on an eligible rank and verify its distinct belt image.
11. Confirm a `BeltHistory` sheet was created after the first rank change/promotion.
12. Verify Today's Sign-ins delete still works and permits a deleted student to sign in again on that device.

## Belt model

The progression uses 79 base rank states plus 10 Elite visual variants, producing 89 distinct belt images. Elite is stored separately as a boolean, while the belt image resolver uses both Rank ID and Elite status.
