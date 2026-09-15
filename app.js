(() => {
  const demoStudents = [
    { pin: '101', name: 'Demo Student One' },
    { pin: '202', name: 'Demo Student Two' },
    { pin: '303', name: 'Demo Student Three' }
  ];

  let pin = '';
  let selectedStudent = null;
  let resetTimer = null;

  const $ = id => document.getElementById(id);

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
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
        $('pinMessage').textContent = 'PIN not found on this device.';
        setTimeout(() => {
          pin = '';
          renderPin();
          $('pinMessage').textContent = '';
        }, 1200);
        return;
      }

      selectedStudent = student;
      $('confirmName').textContent = student.name;
      $('confirmPin').textContent = `PIN ${student.pin}`;
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
      const duplicate = await PDDB.hasAttendanceToday(selectedStudent.pin);

      if (duplicate) {
        $('successName').textContent = selectedStudent.name;
        $('syncHint').textContent = 'Already signed in on this device today.';
        showScreen('successScreen');
        await refreshStatus();
        resetToPin(1800);
        return;
      }

      await PDDB.addAttendance(selectedStudent);

      $('successName').textContent = selectedStudent.name;
      $('syncHint').textContent = navigator.onLine
        ? 'Saved locally. Server sync will be added in Phase 2.'
        : 'Offline — safely queued on this device.';

      showScreen('successScreen');
      await refreshStatus();
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

  async function refreshStatus() {
    const online = navigator.onLine;
    $('connectionBadge').textContent = online ? '● Online' : '● Offline';
    $('connectionBadge').classList.toggle('online', online);
    $('connectionBadge').classList.toggle('offline', !online);

    const pending = await PDDB.pendingCount();
    $('pendingBadge').textContent = `${pending} pending`;
  }

  async function refreshLocalScreen(message = '') {
    $('studentCount').textContent = await PDDB.countStudents();
    $('attendanceCount').textContent = await PDDB.countAttendance();
    $('pendingCount').textContent = await PDDB.pendingCount();
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

  document.querySelectorAll('[data-digit]').forEach(button => {
    button.addEventListener('click', () => {
      if (pin.length >= 3) return;
      pin += button.dataset.digit;
      renderPin();
      if (pin.length === 3) processPin();
    });
  });

  $('clearBtn').addEventListener('click', () => {
    pin = '';
    renderPin();
    $('pinMessage').textContent = '';
  });

  $('demoBtn').addEventListener('click', async () => {
    await PDDB.putStudents(demoStudents);
    $('pinMessage').textContent = 'Demo roster loaded. Try PIN 101.';
    await refreshStatus();
  });

  $('cancelConfirmBtn').addEventListener('click', () => resetToPin());
  $('confirmBtn').addEventListener('click', confirmSignIn);

  $('showLocalBtn').addEventListener('click', async () => {
    await refreshLocalScreen();
    showScreen('localScreen');
  });

  $('loadDemoBtn').addEventListener('click', async () => {
    await PDDB.putStudents(demoStudents);
    await refreshLocalScreen('Demo students loaded.');
    await refreshStatus();
  });

  $('clearAttendanceBtn').addEventListener('click', async () => {
    if (!confirm('Clear all locally stored attendance on this test device?')) return;
    await PDDB.clearAttendance();
    await refreshLocalScreen('Local attendance cleared.');
    await refreshStatus();
  });

  $('backBtn').addEventListener('click', () => resetToPin());

  window.addEventListener('online', refreshStatus);
  window.addEventListener('offline', refreshStatus);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register('./service-worker.js');
      } catch (err) {
        console.error('Service worker registration failed', err);
      }
    });
  }

  renderPin();
  refreshStatus();
})();
