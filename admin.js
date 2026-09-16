(() => {
  let adminPin = '';

  const $ = id => document.getElementById(id);

  function show(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    $(id).classList.add('active');
  }

  function todayKey() {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

  function daysAgoKey(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

  async function api(action, data = {}) {
    if (!window.PD_CONFIG || !window.PD_CONFIG.API_URL) {
      throw new Error('Apps Script API URL is not configured.');
    }

    if (!navigator.onLine) {
      throw new Error('Admin functions require an internet connection.');
    }

    const response = await fetch(window.PD_CONFIG.API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'adminAction',
        adminAction: action,
        adminPin,
        data
      })
    });

    const result = await response.json();

    if (!result || result.success !== true) {
      throw new Error(result && result.message ? result.message : 'Admin request failed.');
    }

    return result;
  }

  function message(id, text = '') {
    $(id).textContent = text;
  }

  function backHome() {
    adminPin = '';
    if (typeof window !== 'undefined') {
      document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
      $('pinScreen').classList.add('active');
    }
  }

  async function openAdminLogin() {
    $('adminPinInput').value = '';
    message('adminLoginMessage', navigator.onLine ? '' : 'Admin functions require internet.');
    show('adminLoginScreen');
    setTimeout(() => $('adminPinInput').focus(), 50);
  }

  async function verifyAdmin() {
    const candidate = $('adminPinInput').value.trim();

    if (!candidate) {
      message('adminLoginMessage', 'Enter the Admin PIN.');
      return;
    }

    adminPin = candidate;
    message('adminLoginMessage', 'Checking…');

    try {
      await api('verify');
      message('adminLoginMessage', '');
      show('adminHubScreen');
    } catch (err) {
      adminPin = '';
      message('adminLoginMessage', err.message);
    }
  }

  async function addStudent() {
    const name = $('newStudentName').value.trim();
    if (!name) {
      message('addStudentMessage', 'Enter the student name.');
      return;
    }

    try {
      const result = await api('addStudent', { name });
      message('addStudentMessage', `${result.name} added. Number: ${result.pin}`);
      $('newStudentName').value = '';
      if (window.PDDB && navigator.onLine && window.PD_CONFIG) {
        // Normal foreground sync will refresh the roster shortly.
        window.dispatchEvent(new Event('online'));
      }
    } catch (err) {
      message('addStudentMessage', err.message);
    }
  }

  function renderMemberResults(boxId, matches, actionLabel, actionClass, handler) {
    const box = $(boxId);
    box.innerHTML = '';

    matches.forEach(member => {
      const row = document.createElement('div');
      row.className = 'admin-list-row';

      const info = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = member.name;
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `Number ${member.pin}`;
      info.append(name, meta);

      const btn = document.createElement('button');
      btn.className = `result-action ${actionClass || ''}`.trim();
      btn.textContent = actionLabel;
      btn.addEventListener('click', () => handler(member));

      row.append(info, btn);
      box.appendChild(row);
    });
  }

  async function searchDeactivate() {
    const term = $('deactivateSearch').value.trim();
    if (!term) return;

    try {
      const result = await api('searchDeactivate', { term });
      message('deactivateMessage', '');
      renderMemberResults(
        'deactivateResults',
        result.matches,
        'Deactivate',
        '',
        async member => {
          if (!confirm(`Deactivate ${member.name} (${member.pin})?`)) return;
          try {
            const r = await api('deactivate', { pin: member.pin });
            message('deactivateMessage', r.message);
            searchDeactivate();
          } catch (err) {
            message('deactivateMessage', err.message);
          }
        }
      );
    } catch (err) {
      $('deactivateResults').innerHTML = '';
      message('deactivateMessage', err.message);
    }
  }

  async function searchReactivate() {
    const term = $('reactivateSearch').value.trim();
    if (!term) return;

    try {
      const result = await api('searchReactivate', { term });
      message('reactivateMessage', '');
      renderMemberResults(
        'reactivateResults',
        result.matches,
        'Reactivate',
        'reactivate',
        async member => {
          if (!confirm(`Reactivate ${member.name} (${member.pin})?`)) return;
          try {
            const r = await api('reactivate', { pin: member.pin });
            message('reactivateMessage', r.message);
            searchReactivate();
          } catch (err) {
            message('reactivateMessage', err.message);
          }
        }
      );
    } catch (err) {
      $('reactivateResults').innerHTML = '';
      message('reactivateMessage', err.message);
    }
  }

  async function loadToday() {
    show('adminTodayScreen');
    const box = $('todaySigninsList');
    box.innerHTML = '';
    message('todaySigninsMessage', 'Loading…');

    try {
      const result = await api('todaySignins');
      message('todaySigninsMessage', '');

      result.entries.forEach(entry => {
        const row = document.createElement('div');
        row.className = 'admin-list-row';

        const left = document.createElement('div');
        const name = document.createElement('strong');
        name.textContent = entry.name;
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = `Number ${entry.pin}`;
        left.append(name, meta);

        const time = document.createElement('div');
        time.textContent = entry.time;

        row.append(left, time);
        box.appendChild(row);
      });
    } catch (err) {
      message('todaySigninsMessage', err.message);
    }
  }

  async function loadCatchup() {
    const date = $('catchupDate').value;
    const box = $('catchupResults');
    box.innerHTML = '';
    $('submitCatchupBtn').style.display = 'none';

    try {
      const result = await api('catchupList', { date });

      if (!result.students.length) {
        message('catchupMessage', `Everyone is already signed in for ${result.dateLabel}.`);
        return;
      }

      message('catchupMessage', `${result.count} student(s) not signed in for ${result.dateLabel}.`);

      result.students.forEach(student => {
        const label = document.createElement('label');
        label.className = 'check-row';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = student.pin;

        const text = document.createElement('span');
        text.textContent = `${student.name} — ${student.pin}`;

        label.append(checkbox, text);
        box.appendChild(label);
      });

      $('submitCatchupBtn').style.display = '';
    } catch (err) {
      message('catchupMessage', err.message);
    }
  }

  async function submitCatchup() {
    const pins = Array.from(
      document.querySelectorAll('#catchupResults input[type="checkbox"]:checked')
    ).map(el => el.value);

    if (!pins.length) {
      message('catchupMessage', 'Select at least one student.');
      return;
    }

    try {
      const result = await api('catchupSubmit', {
        date: $('catchupDate').value,
        pins
      });
      message('catchupMessage', result.message || `${result.count || pins.length} attendance record(s) added.`);
      await loadCatchup();
    } catch (err) {
      message('catchupMessage', err.message);
    }
  }

  async function loadDashboard() {
    const start = $('dashboardStart').value;
    const end = $('dashboardEnd').value;
    message('dashboardMessage', 'Loading…');
    $('dashboardSummary').innerHTML = '';
    $('dashboardTable').innerHTML = '';

    try {
      const result = await api('dashboard', { start, end });
      message('dashboardMessage', '');

      const metrics = [
        ['Total Sign-ins', result.totalSignIns],
        ['Unique Students', result.uniqueStudents],
        ['Avg / Active Day', result.averagePerActiveDay],
        ['Busiest Day', result.busiestDay || '—']
      ];

      metrics.forEach(([label, value]) => {
        const card = document.createElement('div');
        card.className = 'metric-card';
        const strong = document.createElement('strong');
        strong.textContent = value;
        const span = document.createElement('span');
        span.textContent = label;
        card.append(strong, span);
        $('dashboardSummary').appendChild(card);
      });

      (result.studentTotals || []).forEach(student => {
        const row = document.createElement('div');
        row.className = 'admin-list-row';
        const name = document.createElement('strong');
        name.textContent = student.name;
        const count = document.createElement('span');
        count.textContent = `${student.days} day${student.days === 1 ? '' : 's'}`;
        row.append(name, count);
        $('dashboardTable').appendChild(row);
      });
    } catch (err) {
      message('dashboardMessage', err.message);
    }
  }

  async function downloadCsv() {
    try {
      message('csvMessage', 'Preparing…');
      const result = await api('csv', {
        start: $('csvStart').value,
        end: $('csvEnd').value
      });

      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename || 'attendance.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      message('csvMessage', 'CSV downloaded.');
    } catch (err) {
      message('csvMessage', err.message);
    }
  }

  async function openSheet() {
    try {
      const result = await api('sheetUrl');
      window.open(result.url, '_blank', 'noopener');
    } catch (err) {
      message('adminSettingsMessage', err.message);
    }
  }

  async function refreshCache() {
    try {
      const result = await api('refreshCache');
      message('adminSettingsMessage', result.message || 'Cache refreshed.');
    } catch (err) {
      message('adminSettingsMessage', err.message);
    }
  }

  async function changePin() {
    const one = $('newAdminPin').value.trim();
    const two = $('confirmAdminPin').value.trim();

    if (!one || one !== two) {
      message('changePinMessage', 'The new PINs do not match.');
      return;
    }

    try {
      const result = await api('changePin', { newPin: one });
      adminPin = one;
      $('newAdminPin').value = '';
      $('confirmAdminPin').value = '';
      message('changePinMessage', result.message);
    } catch (err) {
      message('changePinMessage', err.message);
    }
  }

  $('adminEntryLogo').addEventListener('click', openAdminLogin);
  $('adminLoginBackBtn').addEventListener('click', backHome);
  $('adminLoginBtn').addEventListener('click', verifyAdmin);
  $('adminPinInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') verifyAdmin();
  });

  document.querySelectorAll('[data-admin-nav]').forEach(btn => {
    btn.addEventListener('click', () => show(btn.dataset.adminNav));
  });

  document.querySelectorAll('.admin-hub-back').forEach(btn => {
    btn.addEventListener('click', () => show('adminHubScreen'));
  });

  document.querySelectorAll('.admin-back-home').forEach(btn => {
    btn.addEventListener('click', backHome);
  });

  $('addStudentBtn').addEventListener('click', addStudent);
  $('deactivateSearchBtn').addEventListener('click', searchDeactivate);
  $('reactivateSearchBtn').addEventListener('click', searchReactivate);
  $('openReactivateBtn').addEventListener('click', () => show('adminReactivateScreen'));
  $('reactivateBackBtn').addEventListener('click', () => show('adminDeactivateScreen'));
  $('todaySigninsTile').addEventListener('click', loadToday);

  $('catchupDate').value = todayKey();
  $('loadCatchupBtn').addEventListener('click', loadCatchup);
  $('submitCatchupBtn').addEventListener('click', submitCatchup);

  $('openDashboardBtn').addEventListener('click', () => {
    $('dashboardStart').value = daysAgoKey(29);
    $('dashboardEnd').value = todayKey();
    show('adminDashboardScreen');
  });
  $('dashboardBackBtn').addEventListener('click', () => show('adminReportingScreen'));
  $('loadDashboardBtn').addEventListener('click', loadDashboard);

  $('openCsvBtn').addEventListener('click', () => {
    $('csvStart').value = daysAgoKey(29);
    $('csvEnd').value = todayKey();
    show('adminCsvScreen');
  });
  $('csvBackBtn').addEventListener('click', () => show('adminReportingScreen'));
  $('downloadCsvBtn').addEventListener('click', downloadCsv);

  $('openSheetBtn').addEventListener('click', openSheet);
  $('refreshCacheBtn').addEventListener('click', refreshCache);
  $('changePinNavBtn').addEventListener('click', () => {
    message('changePinMessage', '');
    show('adminChangePinScreen');
  });
  $('changePinBackBtn').addEventListener('click', () => show('adminSettingsScreen'));
  $('changePinBtn').addEventListener('click', changePin);
})();
