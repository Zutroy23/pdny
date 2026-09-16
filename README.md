# Purple Dragon Attendance PWA — Development v0.69


## New in development v0.63

- Development versioning now uses **0.xx**; **1.0** is reserved for the first production-ready release.
- Main hub simplified to day-to-day functions: Manage Students, Today’s Sign-ins, Attendance Catch Up, Reporting, Admin.
- **Add Student** moved into Admin.
- New **Admin → Belt Management** submenu.
- Belt Promotions moved under Belt Management.
- New **Initialize Current Ranks** bulk setup tool.
- Belt Promotions now lists all active students and automatically checks students who attended on the selected exam date.
- New Admin **Check for Update** button.

v0.63 adds belt/rank tracking, student management, bulk post-exam promotions, and belt images while preserving the existing offline-first attendance workflow.

## New in v0.63

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
- PWA cache bumped to `purple-dragon-pwa-v0.63`.
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

Replace the current Apps Script `Code.gs` contents with `Dojo_Code_PWA_v0.63.gs`.

Then:

1. Save the Apps Script project.
2. Open **Deploy → Manage deployments**.
3. Edit the existing Web app deployment.
4. Create/select a **new version**.
5. Deploy/update it.

Do not create a different endpoint unless you intentionally want the PWA URL configuration to change.

### 2. GitHub Pages PWA

Upload/replace the v0.63 PWA files in the `pdny` repository.

**Keep your existing `config.js`.** This package intentionally contains only `config.example.js`; do not delete or overwrite your configured `config.js`.

Upload the entire `belts` folder as well.

Commit the changes and wait for GitHub Pages to publish.

### 3. Refresh the installed PWA

Open the PWA while online, then close and reopen it once so service worker v0.63 can install and take control.

Use **Device / Sync Status → Sync Now** once after deployment to confirm the new roster fields have downloaded.

## First test sequence

1. Sign in as Admin.
2. Open **Manage Students**.
3. Choose an existing student and assign a rank.
4. Save and return to student sign-in.
5. Sign that student in and confirm the correct belt image/rank appears.
6. Open **Admin → Add Student**, add a test student, and verify the new student is Unofficial White.
7. Open **Admin → Belt Management → Initialize Current Ranks** and verify bulk assignment works.
8. Open **Admin → Belt Management → Belt Promotions**.
9. Select a student and verify the target defaults to the next full belt/rank rather than Bar 1.
10. Change one target manually to a bar/partial rank to test override.
11. Test the Elite checkbox on an eligible rank and verify its distinct belt image.
12. Confirm a `BeltHistory` sheet was created after the first rank change/promotion.
13. Verify Today's Sign-ins delete still works and permits a deleted student to sign in again on that device.

## Belt model

The progression uses 79 base rank states plus 10 Elite visual variants, producing 89 distinct belt images. Elite is stored separately as a boolean, while the belt image resolver uses both Rank ID and Elite status.


## v0.63 update/version behavior

- The running build is visibly labelled **App v0.63** in the bottom-right corner and **v0.63** in the header.
- Core CSS/JS files use `?v=0.63` URLs so an older service worker cannot silently serve the previous build after deployment.
- Online navigation is network-first; offline navigation falls back to the cached app shell.
- Service worker registration uses `updateViaCache: none`, explicitly checks for updates on online launch, and reloads once when a new worker takes control.
- Keep your existing `config.js`; this package still contains only `config.example.js`.

### If the installed PWA is currently stuck on an older build

After uploading/committing all v0.63 files, open the GitHub Pages URL in a normal browser tab once with `?force=0.63` appended. The old cache should miss that navigation URL; the v0.63 HTML then requests versioned CSS/JS assets. Once you see **App v0.63**, close and reopen the installed PWA.


## v0.63 UI fixes
- Embedded belt image bundle prevents broken belt previews if nested asset files are missed during GitHub upload.
- Student Details styling tightened and made consistent with dark theme.
- Belt Promotions cards use dark theme, readable names, student number metadata, labeled Elite control, compact layout, and custom checkboxes.
- Service worker install no longer depends on all 89 nested belt files being present.

## v0.63 admin organization

- Main hub: Manage Students, Today’s Sign-ins, Attendance Catch Up, Reporting, Admin.
- Admin: Add Student, Belt Management, Check for Update, Open Google Sheet, Change Admin PIN, Exit to Sign-In.
- Belt Management: Belt Promotions, Initialize Current Ranks.
- Belt Promotions lists all active students; students with attendance on the selected exam date are checked by default and sorted first.
- Initialize Current Ranks writes `INITIAL_SETUP` history entries and supports an optional effective date.

## v0.63 icon update
The installed PWA icon now uses a Purple Dragon-themed PD/belt badge rather than the temporary PD initials icon.

## v0.63 official-logo icon trial
This package uses the official Purple Dragon crest itself as the installed app icon (cropped to the crest, without the lower AT letters) so you can test how the real logo reads on-device.

## New in development v0.65 — responsive layout audit
- Audited all 23 app/admin screens for narrow phones, short portrait screens, landscape phones, and tablets.
- Removed viewport-width sizing that could make nested cards wider than their containers.
- Added narrow-screen stacking rules for search controls, date ranges, action buttons, and admin tiles.
- Added short-screen and landscape-specific layouts so controls do not overlap or become excessively tall.
- Added safe-area-aware top/bottom/side padding and extra bottom clearance for the fixed version badge.
- The manifest now allows both portrait and landscape orientation.
- Main and admin screens are allowed to scroll naturally when content is taller than the device rather than squeezing/overlapping.
- The launch/install icon now uses separate normal and maskable crest assets. The maskable version has a larger safe margin so the top of the Purple Dragon crest is not clipped on Android launch/splash screens.
- Visible build number is **v0.65**.

No Apps Script backend changes are required for v0.65. Keep your existing `config.js`.

## v0.65 logo icon patch
This package updates the app icon files to use the exact uploaded Purple Dragon crest/logo on a white background. The maskable icons use extra padding so the top of the crest should no longer be clipped on app launch or on Android home-screen masking.

## New in development v0.65 — resilient Apps Script requests
- Admin API responses are read as text and validated before JSON parsing, so temporary Google HTML/error pages no longer surface as raw `Unexpected token '<'` errors.
- Transient network failures, HTML responses, timeouts, and common 5xx/429 responses retry automatically with short backoff delays.
- Admin requests have a 45-second per-attempt ceiling so truly stalled requests eventually recover instead of hanging forever.
- Manage Students shows `Loading student…` while a selected student record is being fetched and visually marks the selected row as loading.
- Manage Students and Attendance Dashboard show a friendly Retry button after automatic retries are exhausted.
- No Apps Script backend changes are required for v0.65.


## v0.69 performance pass
- Belt definitions load from the local PWA asset instead of Apps Script.
- The app no longer refreshes the roster from Apps Script on every launch; a locally cached roster is considered fresh for 30 minutes, while member edits still force an immediate refresh.
- Removed the duplicate 366 KB embedded belt-image JavaScript bundle; belt PNGs remain local PWA assets and are cached on use.
- Attendance Dashboard no longer auto-queries when opened. It shows a clear instruction until a user picks a shortcut/range and requests the report.
- Attendance Dashboard student filtering is now client-side after the first report load, eliminating a full Apps Script/Sheet scan on every student tap.
- Backend member/rank admin builds the belt definition map once per request rather than once per student row, and reads only Members columns A:F.
- Dashboard backend now returns per-student daily counts so filtering can happen locally.


**Backend deployment required for v0.69:** replace `Code.gs` with the supplied v0.69 file, save, then update the existing Apps Script web-app deployment to a new version. Keep the existing PWA `config.js`.

## v0.69 rank-data reliability fix
- Belt/rank definitions are now embedded directly in `admin.js`.
- Manage Students, Belt Promotions and Initialize Current Ranks no longer fetch `belts/ranks.json` at runtime.
- This eliminates the `Could not load local belt definitions` failure caused by a missing/stale ranks JSON file or service-worker cache mismatch.
- The service worker no longer requires `belts/ranks.json` during installation.
- No Apps Script backend changes from v0.66 are required.

## v0.69 belt image + admin sign-in fix
- Restores a local `belt-images.js` bundle containing all belt PNGs as embedded data URLs.
- Student Details and sign-in confirmation use the embedded image first, so belt images no longer depend on 89 separate GitHub file requests.
- The belt image bundle is included in the service-worker app shell for reliable offline display.
- Opening Admin now sends a tiny background `ping` to wake the Apps Script deployment while the PIN is being entered.
- Admin PIN verification remains server-side; the warm-up request returns no private data and does not bypass authentication.
- The Admin Sign In button visibly changes to `Checking…` and is disabled during verification to prevent duplicate requests.

## v0.69 Admin navigation cleanup
- Removed `Device / Sync Status` from the public student sign-in screen.
- Added a `Device / Sync Status` icon/tile to the Admin menu.
- The Device / Sync Status Back button now returns to Admin when opened from Admin.
- No Apps Script backend changes from v0.68 are required.
