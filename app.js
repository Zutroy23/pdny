(() => {
  let pin = '';
  let selectedStudent = null;
  let resetTimer = null;
  let syncInProgress = false;
  let syncRequested = false;
  const reconnectTimers = [];

  const $ = id => document.getElementById(id);

  function apiConfigured() {
    return Boolean(
      window.PD_CONFIG &&
      window.PD_CONFIG.API_URL &&
      !String(window.PD_CONFIG.API_URL).includes('PASTE_YOUR_APPS_SCRIPT')
    );
  }

  function apiUrl() {
    return String(
      window.PD_CONFIG && window.PD_CONFIG.API_URL
        ? window.PD_CONFIG.API_URL
        : ''
    ).trim();
  }

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => {
      el.classList.remove('active');
    });
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

  function prepareStudentConfirmation(student) {
    selectedStudent = student;
    $('confirmName').textContent = student.name;
    $('confirmPin').textContent = `Number ${student.pin}`;

    const beltWrap = $('confirmBeltWrap');
    const beltImage = $('confirmBeltImage');
    const beltName = $('confirmBeltName');

    if (student.beltImage && student.rankName) {
      beltImage.src = `./belts/${student.beltImage}`;
      beltImage.alt = student.rankName;
      beltName.textContent = student.rankName + (student.elite ? ' — Elite' : '');
      beltWrap.hidden = false;
    } else {
      beltImage.removeAttribute('src');
      beltName.textContent = '';
      beltWrap.hidden = true;
    }

    showScreen('confirmScreen');
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

      $('pinMessage').textContent = '';
      prepareStudentConfirmation(student);

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

      $('successTitle').textContent = duplicate
        ? 'Already Signed In'
        : 'Signed In';

      $('successName').textContent = selectedStudent.name;

      if (duplicate) {
        $('syncHint').textContent =
          'This student already signed in on this device today.';
      } else {
        await PDDB.addAttendance(selectedStudent);

        $('syncHint').textContent = navigator.onLine
          ? 'Saved locally. Syncing…'
          : 'Offline — safely queued on this device.';
      }

      showScreen('successScreen');
      await refreshStatus();

      if (!duplicate && navigator.onLine) {
        syncNow({ quiet: true }).catch(console.error);
      }

      resetToPin(1800);

    } catch (err) {
      console.error(err);
      $('successTitle').textContent = 'Sign-In Problem';
      $('successName').textContent = selectedStudent.name;
      $('syncHint').textContent = 'Could not save locally.';
      showScreen('successScreen');
      resetToPin(2300);

    } finally {
      $('confirmBtn').disabled = false;
    }
  }

  async function searchForgotNumber() {
    const term = $('forgotSearch').value.trim();
    const box = $('forgotResults');
    box.innerHTML = '';
    $('forgotMessage').textContent = '';

    if (!term) {
      $('forgotMessage').textContent = 'Enter part of your name.';
      return;
    }

    try {
      const matches = await PDDB.searchStudents(term, 30);

      if (!matches.length) {
        $('forgotMessage').textContent =
          'No matching active student found in the stored roster.';
        return;
      }

      matches.forEach(student => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'search-result';

        const name = document.createElement('strong');
        name.textContent = student.name;

        const number = document.createElement('span');
        number.className = 'result-pin';
        const rankText = student.rankName
          ? ` · ${student.rankName}${student.elite ? ' — Elite' : ''}`
          : '';
        number.textContent = `#${student.pin}${rankText}`;

        button.append(name, number);
        button.addEventListener('click', () => {
          prepareStudentConfirmation(student);
        });

        box.appendChild(button);
      });

    } catch (err) {
      console.error(err);
      $('forgotMessage').textContent = 'Unable to search the local roster.';
    }
  }

  async function submitTrial() {
    const fullName = $('trialName').value.trim();
    const email = $('trialEmail').value.trim();
    const notes = $('trialNotes').value.trim();

    $('trialMessage').textContent = '';

    if (!fullName || !email) {
      $('trialMessage').textContent =
        'Please provide both your name and email.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $('trialMessage').textContent =
        'Please enter a valid email address.';
      return;
    }

    $('trialSubmitBtn').disabled = true;

    try {
      await PDDB.addTrial(fullName, email, notes);

      $('trialName').value = '';
      $('trialEmail').value = '';
      $('trialNotes').value = '';

      $('successTitle').textContent = 'Trial Class Signed In';
      $('successName').textContent = fullName;
      $('syncHint').textContent = navigator.onLine
        ? 'Saved locally. Syncing…'
        : 'Offline — safely queued on this device.';

      showScreen('successScreen');
      await refreshStatus();

      if (navigator.onLine) {
        syncNow({ quiet: true }).catch(console.error);
      }

      resetToPin(2000);

    } catch (err) {
      console.error(err);
      $('trialMessage').textContent =
        'Could not save the trial sign-in on this device.';
    } finally {
      $('trialSubmitBtn').disabled = false;
    }
  }

  function formatStoredDate(value) {
    if (!value) return 'Never';

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleString();
  }

  async function pendingTotal() {
    const [attendance, trials] = await Promise.all([
      PDDB.pendingAttendanceCount(),
      PDDB.pendingTrialCount()
    ]);

    return { attendance, trials, total: attendance + trials };
  }

  async function refreshStatus() {
    const online = navigator.onLine;

    $('connectionBadge').textContent =
      online ? '● Online' : '● Offline';

    $('connectionBadge').classList.toggle('online', online);
    $('connectionBadge').classList.toggle('offline', !online);

    const pending = await pendingTotal();
    $('pendingBadge').textContent = `${pending.total} pending`;

    if ($('pendingAttendanceCount')) {
      $('pendingAttendanceCount').textContent = pending.attendance;
    }

    if ($('pendingTrialCount')) {
      $('pendingTrialCount').textContent = pending.trials;
    }
  }

  async function refreshLocalScreen(message = '') {
    const [
      students,
      attendance,
      trials,
      pending,
      rosterLastSync,
      lastSync
    ] = await Promise.all([
      PDDB.countStudents(),
      PDDB.countAttendance(),
      PDDB.countTrials(),
      pendingTotal(),
      PDDB.getMeta('lastRosterSync'),
      PDDB.getMeta('lastSuccessfulSync')
    ]);

    $('studentCount').textContent = students;
    $('attendanceCount').textContent = attendance;
    $('trialCount').textContent = trials;
    $('pendingAttendanceCount').textContent = pending.attendance;
    $('pendingTrialCount').textContent = pending.trials;
    $('rosterSyncValue').textContent = formatStoredDate(rosterLastSync);
    $('lastSyncValue').textContent = formatStoredDate(lastSync);
    $('localMessage').textContent = message;

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
    const response = await fetch(
      `${apiUrl()}?api=roster&_=${Date.now()}`,
      {
        method: 'GET',
        cache: 'no-store',
        redirect: 'follow'
      }
    );

    if (!response.ok) {
      throw new Error(`Roster request failed (${response.status})`);
    }

    const data = await response.json();

    if (!data || data.success !== true || !Array.isArray(data.students)) {
      throw new Error(
        data && data.message ? data.message : 'Invalid roster response.'
      );
    }

    await PDDB.replaceStudents(data.students);
    await PDDB.setMeta('lastRosterSync', new Date().toISOString());

    return data.students.length;
  }

  async function postPayload(payload) {
    const response = await fetch(apiUrl(), {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Sync failed (${response.status})`);
    }

    return response.json();
  }

  async function uploadPendingAttendance() {
    const rows = await PDDB.getPendingAttendance(250);

    if (!rows.length) {
      return { sent: 0, synced: 0, duplicates: 0, rejected: 0 };
    }

    const data = await postPayload({
      action: 'syncAttendance',
      attendance: rows.map(row => ({
        id: row.id,
        pin: row.pin,
        name: row.name,
        timestamp: row.timestamp
      }))
    });

    if (!data || data.success !== true || !Array.isArray(data.results)) {
      throw new Error(
        data && data.message ? data.message : 'Invalid attendance response.'
      );
    }

    await PDDB.applyAttendanceResults(data.results);

    return {
      sent: rows.length,
      synced: data.results.filter(x => x.status === 'synced').length,
      duplicates: data.results.filter(x => x.status === 'duplicate').length,
      rejected: data.results.filter(x => x.status === 'rejected').length
    };
  }

  async function uploadPendingTrials() {
    const rows = await PDDB.getPendingTrials(250);

    if (!rows.length) {
      return { sent: 0, synced: 0, duplicates: 0, rejected: 0 };
    }

    const data = await postPayload({
      action: 'syncTrials',
      trials: rows.map(row => ({
        id: row.id,
        timestamp: row.timestamp,
        fullName: row.fullName,
        email: row.email,
        notes: row.notes
      }))
    });

    if (!data || data.success !== true || !Array.isArray(data.results)) {
      throw new Error(
        data && data.message ? data.message : 'Invalid trial response.'
      );
    }

    await PDDB.applyTrialResults(data.results);

    return {
      sent: rows.length,
      synced: data.results.filter(x => x.status === 'synced').length,
      duplicates: data.results.filter(x => x.status === 'duplicate').length,
      rejected: data.results.filter(x => x.status === 'rejected').length
    };
  }

  async function syncNow(options = {}) {
    const quiet = Boolean(options.quiet);

    if (syncInProgress) {
      syncRequested = true;
      return;
    }

    if (!navigator.onLine) {
      if (!quiet && $('localMessage')) {
        $('localMessage').textContent =
          'Offline. Sign-ins will remain queued until connection returns.';
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
      const attendanceResult = await uploadPendingAttendance();
      const trialResult = await uploadPendingTrials();
      const rosterCount = await fetchRoster();

      await PDDB.setMeta('lastSuccessfulSync', new Date().toISOString());
      await refreshStatus();

      if ($('localScreen').classList.contains('active')) {
        await refreshLocalScreen(
          `Sync complete. ${rosterCount} active students stored. ` +
          `${attendanceResult.synced} attendance uploaded, ` +
          `${trialResult.synced} trial sign-in(s) uploaded.`
        );
      }

    } catch (err) {
      console.error('Sync failed:', err);

      if (!quiet && $('localMessage')) {
        $('localMessage').textContent = `Sync failed: ${err.message}`;
      }

    } finally {
      syncInProgress = false;

      if (syncButton) {
        syncButton.disabled = false;
        syncButton.textContent = 'Sync Now';
      }

      await refreshStatus();

      if (syncRequested && navigator.onLine) {
        syncRequested = false;
        setTimeout(() => {
          syncNow({ quiet: true }).catch(console.error);
        }, 0);
      }
    }
  }

  function clearReconnectTimers() {
    while (reconnectTimers.length) {
      clearTimeout(reconnectTimers.pop());
    }
  }

  function scheduleReconnectSync() {
    clearReconnectTimers();

    [0, 3000, 10000, 30000].forEach(delay => {
      reconnectTimers.push(
        setTimeout(async () => {
          if (!navigator.onLine) return;

          await refreshStatus();
          const pending = await pendingTotal();

          if (pending.total > 0) {
            syncNow({ quiet: true }).catch(console.error);
          }
        }, delay)
      );
    });
  }

  document.querySelectorAll('[data-digit]').forEach(button => {
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

  $('backspaceBtn').addEventListener('click', () => {
    pin = pin.slice(0, -1);
    renderPin();
    $('pinMessage').textContent = '';
  });

  $('cancelConfirmBtn').addEventListener('click', () => resetToPin());
  $('confirmBtn').addEventListener('click', confirmSignIn);

  $('forgotBtn').addEventListener('click', () => {
    $('forgotSearch').value = '';
    $('forgotMessage').textContent = '';
    $('forgotResults').innerHTML = '';
    showScreen('forgotScreen');
    setTimeout(() => $('forgotSearch').focus(), 50);
  });

  $('forgotBackBtn').addEventListener('click', () => resetToPin());
  $('forgotSearchBtn').addEventListener('click', searchForgotNumber);
  $('forgotSearch').addEventListener('keydown', event => {
    if (event.key === 'Enter') searchForgotNumber();
  });

  $('trialBtn').addEventListener('click', () => {
    $('trialMessage').textContent = '';
    showScreen('trialScreen');
  });

  $('trialBackBtn').addEventListener('click', () => resetToPin());
  $('trialSubmitBtn').addEventListener('click', submitTrial);

  $('showLocalBtn').addEventListener('click', async () => {
    await refreshLocalScreen();
    showScreen('localScreen');
  });

  $('syncNowBtn').addEventListener('click', async () => {
    await syncNow();
  });

  $('backBtn').addEventListener('click', () => resetToPin());

  window.addEventListener('online', () => {
    refreshStatus();
    scheduleReconnectSync();
  });

  window.addEventListener('offline', () => {
    clearReconnectTimers();
    refreshStatus();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && navigator.onLine) {
      scheduleReconnectSync();
    }
  });

  window.addEventListener('focus', () => {
    if (navigator.onLine) {
      scheduleReconnectSync();
    }
  });

  setInterval(async () => {
    if (document.hidden || !navigator.onLine || syncInProgress) return;

    const pending = await pendingTotal();

    if (pending.total > 0) {
      syncNow({ quiet: true }).catch(console.error);
    }
  }, 60000);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register('./service-worker.js');
      } catch (err) {
        console.error('Service worker registration failed', err);
      }
    });
  }

  // Allow the admin UI to force a roster refresh after member changes.
  window.PDSyncNow = function() {
    return syncNow({ quiet: true });
  };

  async function init() {
    renderPin();
    await refreshStatus();

    const studentCount = await PDDB.countStudents();

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
