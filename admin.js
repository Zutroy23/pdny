(() => {
  let adminPin = '';

  const $ = id => document.getElementById(id);

  function show(id) {
    document.body.classList.add('admin-mode');
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
    document.body.classList.remove('admin-mode');
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
      if (window.PDSyncNow) {
        window.PDSyncNow().catch(console.error);
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
            if (window.PDSyncNow) window.PDSyncNow().catch(console.error);
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
            if (window.PDSyncNow) window.PDSyncNow().catch(console.error);
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

        const actions = document.createElement('div');
        actions.className = 'today-entry-actions';

        const time = document.createElement('span');
        time.textContent = entry.time;

        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'today-delete';
        del.textContent = 'Delete';
        del.addEventListener('click', async () => {
          if (!confirm(`Delete today's sign-in for ${entry.name} (${entry.pin})?`)) {
            return;
          }

          del.disabled = true;

          try {
            const deleted = await api('deleteTodaySignIn', { pin: entry.pin });

            // Also remove the same day's local PWA record, if it exists,
            // so the student can sign in again on this device.
            if (
              window.PDDB &&
              typeof window.PDDB.deleteAttendanceForPinDate === 'function'
            ) {
              await window.PDDB.deleteAttendanceForPinDate(
                entry.pin,
                todayKey()
              );
            }

            message('todaySigninsMessage', deleted.message || 'Sign-in deleted.');
            await loadToday();
          } catch (err) {
            message('todaySigninsMessage', err.message);
            del.disabled = false;
          }
        });

        actions.append(time, del);
        row.append(left, actions);
        box.appendChild(row);
      });

    } catch (err) {
      box.innerHTML = '';
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

  let dashboardStudentFilter = '';

  function parseLocalDateKey(key) {
    const parts = String(key || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
  }

  function formatDashboardDate(key, includeYear = false) {
    const d = parseLocalDateKey(key);
    if (!d) return key;

    return d.toLocaleDateString(
      undefined,
      includeYear
        ? { month: 'short', day: 'numeric', year: 'numeric' }
        : { month: 'short', day: 'numeric' }
    );
  }

  function renderDashboardChart(result) {
    const box = $('attendanceChart');
    box.innerHTML = '';

    const rows = Array.isArray(result.chartRows) ? result.chartRows : [];

    if (!rows.length) {
      box.textContent = 'No chart data for this range.';
      return;
    }

    const width = 720;
    const height = 245;
    const pad = { left: 42, right: 14, top: 16, bottom: 45 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    const maxCount = Math.max(1, ...rows.map(r => Number(r.count) || 0));
    const yMax = Math.max(4, Math.ceil(maxCount / 4) * 4);

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute(
      'aria-label',
      dashboardStudentFilter
        ? `Daily attendance for ${dashboardStudentFilter}`
        : 'Daily attendance'
    );

    function el(name, attrs = {}, text = '') {
      const node = document.createElementNS(ns, name);
      Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
      if (text !== '') node.textContent = text;
      return node;
    }

    // Horizontal grid and Y labels.
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (plotH * i / 4);
      const value = Math.round(yMax * (1 - i / 4));

      svg.appendChild(el('line', {
        x1: pad.left,
        y1: y,
        x2: width - pad.right,
        y2: y,
        class: 'chart-grid'
      }));

      svg.appendChild(el('text', {
        x: pad.left - 8,
        y: y + 4,
        'text-anchor': 'end',
        class: 'chart-y-label'
      }, String(value)));
    }

    svg.appendChild(el('line', {
      x1: pad.left,
      y1: pad.top,
      x2: pad.left,
      y2: height - pad.bottom,
      class: 'chart-axis'
    }));

    svg.appendChild(el('line', {
      x1: pad.left,
      y1: height - pad.bottom,
      x2: width - pad.right,
      y2: height - pad.bottom,
      class: 'chart-axis'
    }));

    const crossesYear =
      result.startDate &&
      result.endDate &&
      String(result.startDate).slice(0, 4) !== String(result.endDate).slice(0, 4);

    const points = rows.map((row, i) => {
      const x = rows.length === 1
        ? pad.left + plotW / 2
        : pad.left + (plotW * i / (rows.length - 1));
      const count = Number(row.count) || 0;
      const y = pad.top + plotH - (count / yMax) * plotH;
      return { x, y, count, date: row.date };
    });

    svg.appendChild(el('polyline', {
      points: points.map(p => `${p.x},${p.y}`).join(' '),
      class: 'chart-line'
    }));

    points.forEach(point => {
      const circle = el('circle', {
        cx: point.x,
        cy: point.y,
        r: 4,
        class: 'chart-point'
      });
      const title = el(
        'title',
        {},
        `${formatDashboardDate(point.date, true)}: ${point.count} sign-in${point.count === 1 ? '' : 's'}`
      );
      circle.appendChild(title);
      svg.appendChild(circle);
    });

    const labelEvery =
      rows.length <= 14 ? 1 : Math.ceil(rows.length / 7);

    points.forEach((point, i) => {
      if (
        i !== 0 &&
        i !== points.length - 1 &&
        i % labelEvery !== 0
      ) {
        return;
      }

      svg.appendChild(el('text', {
        x: point.x,
        y: height - pad.bottom + 19,
        'text-anchor': 'middle',
        class: 'chart-label'
      }, formatDashboardDate(point.date, crossesYear)));
    });

    box.appendChild(svg);
  }

  function renderDashboardStudentList(result) {
    const box = $('dashboardTable');
    box.innerHTML = '';

    const rows = Array.isArray(result.studentRows) ? result.studentRows : [];

    if (!rows.length) {
      box.textContent = 'No students attended during this range.';
      return;
    }

    rows.forEach(student => {
      const row = document.createElement('div');
      row.className = 'admin-list-row';
      row.tabIndex = 0;

      const left = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = student.name;
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = student.pin
        ? `Number ${student.pin}`
        : 'Historical attendance';
      left.append(name, meta);

      const count = document.createElement('span');
      const days = Number(student.daysAttended) || 0;
      count.textContent = `${days} day${days === 1 ? '' : 's'}`;

      const applyFilter = async () => {
        dashboardStudentFilter = student.name;
        await loadDashboard();
      };

      row.addEventListener('click', applyFilter);
      row.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          applyFilter();
        }
      });

      row.append(left, count);
      box.appendChild(row);
    });
  }

  async function loadDashboard() {
    const start = $('dashboardStart').value;
    const end = $('dashboardEnd').value;

    message('dashboardMessage', 'Loading…');
    $('dashboardSummary').innerHTML = '';
    $('dashboardTable').innerHTML = '';
    $('attendanceChart').innerHTML = '';

    try {
      const result = await api('dashboard', {
        start,
        end,
        student: dashboardStudentFilter
      });

      message('dashboardMessage', '');

      const metrics = result.metrics || {};
      const busiest = metrics.busiestDay
        ? `${formatDashboardDate(metrics.busiestDay)} (${metrics.busiestDayCount})`
        : '—';

      const cards = [
        ['Total Sign-ins', metrics.totalLogins ?? 0],
        ['Unique Students', metrics.uniqueStudents ?? 0],
        ['Avg / Active Day', metrics.averagePerActiveDay ?? 0],
        ['Busiest Day', busiest]
      ];

      cards.forEach(([label, value]) => {
        const card = document.createElement('div');
        card.className = 'metric-card';

        const strong = document.createElement('strong');
        strong.textContent = String(value);

        const span = document.createElement('span');
        span.textContent = label;

        card.append(strong, span);
        $('dashboardSummary').appendChild(card);
      });

      if (dashboardStudentFilter) {
        $('dashboardSelectedStudentName').textContent = dashboardStudentFilter;
        $('dashboardSelectedStudent').style.display = 'flex';
      } else {
        $('dashboardSelectedStudent').style.display = 'none';
      }

      renderDashboardChart(result);
      renderDashboardStudentList(result);

    } catch (err) {
      message('dashboardMessage', err.message);
    }
  }

  function setDashboardRange(kind) {
    const end = new Date();
    const start = new Date(end);

    if (kind === 'today') {
      // no change
    } else if (kind === '7') {
      start.setDate(end.getDate() - 6);
    } else if (kind === '30') {
      start.setDate(end.getDate() - 29);
    } else if (kind === 'week') {
      const day = end.getDay();
      const daysSinceMonday = (day + 6) % 7;
      start.setDate(end.getDate() - daysSinceMonday);
    } else if (kind === 'month') {
      start.setDate(1);
    }

    function key(d) {
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0')
      ].join('-');
    }

    $('dashboardStart').value = key(start);
    $('dashboardEnd').value = key(end);
    loadDashboard();
  }

  async function downloadCsv() {
    try {
      message('csvMessage', 'Preparing…');
      const result = await api('csv', {
        start: $('csvStart').value,
        end: $('csvEnd').value
      });

      const blob = new Blob([result.csvData], { type: 'text/csv;charset=utf-8' });
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
    dashboardStudentFilter = '';
    $('dashboardStart').value = daysAgoKey(29);
    $('dashboardEnd').value = todayKey();
    show('adminDashboardScreen');
    loadDashboard();
  });

  document.querySelectorAll('.dashboard-shortcut').forEach(btn => {
    btn.addEventListener('click', () => setDashboardRange(btn.dataset.range));
  });

  $('clearDashboardStudentBtn').addEventListener('click', async () => {
    dashboardStudentFilter = '';
    await loadDashboard();
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
