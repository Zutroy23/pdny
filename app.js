(() => {
  let pin = '';
  let selectedStudent = null;
  let resetTimer = null;
  let syncInProgress = false;

  const $ = id => document.getElementById(id);

  function apiConfigured() {
    return (
      window.PD_CONFIG &&
      PD_CONFIG.API_URL &&
      !PD_CONFIG.API_URL.includes('PASTE_YOUR_APPS_SCRIPT')
    );
  }

  function apiUrl() {
    return String(PD_CONFIG.API_URL || '').trim();
  }

  function showScreen(id) {
    document
      .querySelectorAll('.screen')
      .forEach(el => el.classList.remove('active'));

    $(id).classList.add('active');
  }

  function renderPin() {
    $('pinDisplay').textContent =
      [0, 1, 2].map(i => pin[i] || '_').join(' ');
  }

  function resetToPin(delay = 0) {
    clearTimeout(resetTimer);

    resetTimer = setTimeout(() => {
      pin = '';
      selectedStudent = null;
      renderPin();
      $('pinMessage').textContent = '';
      showScreen('pinScreen');
    }, delay);
  }

  async function processPin() {
    $('pinMessage').textContent = 'Looking up locally…';

    try {
      const student = await PDDB.getStudent(pin);

      if (!student || student.active === false) {
        $('pinMessage').textContent =
          'Number not found on this device.';

        setTimeout(() => {
          pin = '';
          renderPin();
          $('pinMessage').textContent = '';
        }, 1300);

        return;
      }

      selectedStudent = student;
      $('confirmName').textContent = student.name;
      $('confirmPin').textContent = `Number ${student.pin}`;
      $('pinMessage').textContent = '';
      showScreen('confirmScreen');

    } catch (err) {
      console.error(err);
      $('pinMessage').textContent = 'Local database error.';
    }
  }

  async function confirmSignIn() {
    if (!selectedStudent) return;

    $('confirmBtn').disabled = true;

    try {
      const duplicate =
        await PDDB.hasAttendanceToday(selectedStudent.pin);

      if (duplicate) {
        $('successName').textContent = selectedStudent.name;
        $('syncHint').textContent =
          'Already signed in on this device today.';

        showScreen('successScreen');
        await refreshStatus();
        resetToPin(1800);
        return;
      }

      await PDDB.addAttendance(selectedStudent);

      $('successName').textContent = selectedStudent.name;
      $('syncHint').textContent = navigator.onLine
        ? 'Saved locally. Syncing…'
        : 'Offline — safely queued on this device.';

      showScreen('successScreen');
      await refreshStatus();

      if (navigator.onLine) {
        syncNow({ quiet: true }).catch(console.error);
      }

      resetToPin(1800);

    } catch (err) {
      console.error(err);
      $('syncHint').textContent = 'Could not save locally.';
      showScreen('successScreen');
      resetToPin(2200);

    } finally {
      $('confirmBtn').disabled = false;
    }
  }

  function formatStoredDate(value) {
    if (!value) return 'Never';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString();
  }

  async function refreshStatus() {
    const online = navigator.onLine;

    $('connectionBadge').textContent =
      online ? '● Online' : '● Offline';

    $('connectionBadge').classList.toggle('online', online);
    $('connectionBadge').classList.toggle('offline', !online);

    const pending = await PDDB.pendingCount();
    $('pendingBadge').textContent = `${pending} pending`;

    const rosterLastSync = await PDDB.getMeta('lastRosterSync');
    const attendanceLastSync =
      await PDDB.getMeta('lastAttendanceSync');

    if ($('rosterSyncValue')) {
      $('rosterSyncValue').textContent =
        formatStoredDate(rosterLastSync);
    }

    if ($('attendanceSyncValue')) {
      $('attendanceSyncValue').textContent =
        formatStoredDate(attendanceLastSync);
    }
  }

  async function refreshLocalScreen(message = '') {
    $('studentCount').textContent =
      await PDDB.countStudents();

    $('attendanceCount').textContent =
      await PDDB.countAttendance();

    $('pendingCount').textContent =
      await PDDB.pendingCount();

    $('localMessage').textContent = message;

    const rosterLastSync = await PDDB.getMeta('lastRosterSync');
    const attendanceLastSync =
      await PDDB.getMeta('lastAttendanceSync');

    $('rosterSyncValue').textContent =
      formatStoredDate(rosterLastSync);

    $('attendanceSyncValue').textContent =
      formatStoredDate(attendanceLastSync);

    const rows = await PDDB.recentAttendance();
    const box = $('recentAttendance');
    box.innerHTML = '';

    rows.forEach(row => {
      const div = document.createElement('div');
      div.className = 'recent-row';

      const left = document.createElement('span');
      left.textContent = `${row.name} (${row.pin})`;

      const right = document.createElement('span');
      right.textContent =
        `${new Date(row.timestamp).toLocaleString()} · ${row.syncStatus}`;

      div.append(left, right);
      box.appendChild(div);
    });
  }

  async function fetchRoster() {
    const url =
      `${apiUrl()}?api=roster&_=${Date.now()}`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`Roster request failed (${response.status})`);
    }

    const data = await response.json();

    if (!data || data.success !== true || !Array.isArray(data.students)) {
      throw new Error(
        data && data.message
          ? data.message
          : 'Invalid roster response.'
      );
    }

    await PDDB.replaceStudents(data.students);
    await PDDB.setMeta('lastRosterSync', new Date().toISOString());

    return data.students.length;
  }

  async function uploadPendingAttendance() {
    const rows = await PDDB.getPendingAttendance();

    if (!rows.length) {
      return {
        sent: 0,
        synced: 0,
        duplicates: 0,
        rejected: 0
      };
    }

    const payload = {
      action: 'syncAttendance',
      attendance: rows.map(row => ({
        id: row.id,
        pin: row.pin,
        name: row.name,
        timestamp: row.timestamp
      }))
    };

    // text/plain keeps this a simple cross-origin request and avoids
    // browser preflight complications with Apps Script web apps.
    const response = await fetch(apiUrl(), {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(
        `Attendance sync failed (${response.status})`
      );
    }

    const data = await response.json();

    if (!data || data.success !== true || !Array.isArray(data.results)) {
      throw new Error(
        data && data.message
          ? data.message
          : 'Invalid attendance response.'
      );
    }

    await PDDB.applySyncResults(data.results);
    await PDDB.setMeta(
      'lastAttendanceSync',
      new Date().toISOString()
    );

    return {
      sent: rows.length,
      synced: data.results.filter(x => x.status === 'synced').length,
      duplicates:
        data.results.filter(x => x.status === 'duplicate').length,
      rejected:
        data.results.filter(x => x.status === 'rejected').length
    };
  }

  async function syncNow(options = {}) {
    const quiet = Boolean(options.quiet);

    if (syncInProgress) {
      return;
    }

    if (!navigator.onLine) {
      if (!quiet && $('localMessage')) {
        $('localMessage').textContent =
          'Offline. Sign-ins will stay queued until connection returns.';
      }
      return;
    }

    if (!apiConfigured()) {
      if (!quiet && $('localMessage')) {
        $('localMessage').textContent =
          'Apps Script API URL has not been configured yet.';
      }
      return;
    }

    syncInProgress = true;

    const syncButton = $('syncNowBtn');

    if (syncButton) {
      syncButton.disabled = true;
      syncButton.textContent = 'Syncing…';
    }

    try {
      // Upload first so attendance recorded against the previously cached
      // roster is preserved even if member status changed since last sync.
      const attendanceResult =
        await uploadPendingAttendance();

      const rosterCount =
        await fetchRoster();

      await refreshStatus();

      if ($('localScreen').classList.contains('active')) {
        await refreshLocalScreen(
          `Sync complete. ${rosterCount} active students stored. ` +
          `${attendanceResult.synced} uploaded, ` +
          `${attendanceResult.duplicates} duplicate(s), ` +
          `${attendanceResult.rejected} rejected.`
        );
      }

    } catch (err) {
      console.error('Sync failed:', err);

      if (!quiet && $('localMessage')) {
        $('localMessage').textContent =
          `Sync failed: ${err.message}`;
      }

    } finally {
      syncInProgress = false;

      if (syncButton) {
        syncButton.disabled = false;
        syncButton.textContent = 'Sync Now';
      }

      await refreshStatus();
    }
  }

  document
    .querySelectorAll('[data-digit]')
    .forEach(button => {
      button.addEventListener('click', () => {
        if (pin.length >= 3) return;

        pin += button.dataset.digit;
        renderPin();

        if (pin.length === 3) {
          processPin();
        }
      });
    });

  $('clearBtn').addEventListener('click', () => {
    pin = '';
    renderPin();
    $('pinMessage').textContent = '';
  });

  $('cancelConfirmBtn')
    .addEventListener('click', () => resetToPin());

  $('confirmBtn')
    .addEventListener('click', confirmSignIn);

  $('showLocalBtn').addEventListener('click', async () => {
    await refreshLocalScreen();
    showScreen('localScreen');
  });

  $('syncNowBtn').addEventListener('click', async () => {
    await syncNow();
  });

  $('clearAttendanceBtn').addEventListener('click', async () => {
    if (
      !confirm(
        'Clear ALL locally stored attendance on this device? ' +
        'Do not do this if there are pending sign-ins.'
      )
    ) {
      return;
    }

    const pending = await PDDB.pendingCount();

    if (pending > 0) {
      alert(
        `There are ${pending} pending sign-in(s). ` +
        'Sync them before clearing attendance.'
      );
      return;
    }

    await PDDB.clearAttendance();
    await refreshLocalScreen('Local attendance cleared.');
    await refreshStatus();
  });

  $('backBtn').addEventListener('click', () => resetToPin());

  window.addEventListener('online', () => {
    refreshStatus();
    syncNow({ quiet: true }).catch(console.error);
  });

  window.addEventListener('offline', refreshStatus);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register(
          './service-worker.js'
        );
      } catch (err) {
        console.error(
          'Service worker registration failed',
          err
        );
      }
    });
  }

  async function init() {
    renderPin();
    await refreshStatus();

    const studentCount =
      await PDDB.countStudents();

    if (!studentCount && !navigator.onLine) {
      $('pinMessage').textContent =
        'No roster is stored yet. Connect once to download it.';
    }

    if (navigator.onLine && apiConfigured()) {
      syncNow({ quiet: true }).catch(console.error);
    }
  }

  init();
})();
