# Purple Dragon Attendance PWA — Phase 1

This is a deliberately small offline-first prototype.

## What works

- Installable Progressive Web App structure
- Service worker caches the application shell
- Student roster stored in IndexedDB
- PIN lookup happens locally
- Confirmed attendance is written locally
- Duplicate same-day attendance is blocked on the device
- Online/offline indicator
- Pending-sync counter
- Demo roster for testing

## What is NOT included yet

- Google Apps Script synchronization
- Downloading the real Members roster
- Uploading pending attendance to the Google Sheet
- Forgot-PIN search
- Admin PIN / student administration
- Catch-up attendance
- Dashboard/reporting
- NFC/QR
- Multi-location selection

Those will be layered on after the offline core is proven.

## Demo PINs

- 101 — Demo Student One
- 202 — Demo Student Two
- 303 — Demo Student Three

## Important

A service worker does not work correctly when index.html is opened directly as a file.
The project must be served over HTTPS (or localhost during development).

The easiest deployment target for this prototype is GitHub Pages.
