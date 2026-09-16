const PDDB = (() => {
  const DB_NAME = 'purpleDragonAttendance';
  const DB_VERSION = 3;

  const STUDENTS = 'students';
  const ATTENDANCE = 'attendance';
  const TRIALS = 'trials';
  const META = 'meta';

  function open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = () => {
        const db = req.result;

        if (!db.objectStoreNames.contains(STUDENTS)) {
          const students = db.createObjectStore(STUDENTS, { keyPath: 'pin' });
          students.createIndex('nameLower', 'nameLower', { unique: false });
        }

        if (!db.objectStoreNames.contains(ATTENDANCE)) {
          const attendance = db.createObjectStore(ATTENDANCE, { keyPath: 'id' });
          attendance.createIndex('syncStatus', 'syncStatus', { unique: false });
          attendance.createIndex('dateKey', 'dateKey', { unique: false });
          attendance.createIndex('pinDate', 'pinDate', { unique: false });
        }

        if (!db.objectStoreNames.contains(TRIALS)) {
          const trials = db.createObjectStore(TRIALS, { keyPath: 'id' });
          trials.createIndex('syncStatus', 'syncStatus', { unique: false });
        }

        if (!db.objectStoreNames.contains(META)) {
          db.createObjectStore(META, { keyPath: 'key' });
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function transaction(storeName, mode, work) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      let value;

      try {
        value = work(store);
      } catch (err) {
        reject(err);
        return;
      }

      tx.oncomplete = () => resolve(value);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async function replaceStudents(students) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STUDENTS, 'readwrite');
      const store = tx.objectStore(STUDENTS);
      store.clear();

      students.forEach(student => {
        store.put({
          pin: String(student.pin),
          name: String(student.name),
          nameLower: String(student.name).toLowerCase(),
          active: student.active !== false,
          updatedAt: Date.now()
        });
      });

      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async function getStudent(pin) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STUDENTS, 'readonly')
        .objectStore(STUDENTS)
        .get(String(pin));

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function searchStudents(term, limit = 20) {
    term = String(term || '').trim().toLowerCase();
    if (!term) return [];

    const db = await open();
    return new Promise((resolve, reject) => {
      const store = db.transaction(STUDENTS, 'readonly').objectStore(STUDENTS);
      const req = store.openCursor();
      const rows = [];

      req.onsuccess = () => {
        const cursor = req.result;

        if (!cursor || rows.length >= limit) {
          rows.sort((a, b) => a.name.localeCompare(b.name));
          resolve(rows);
          return;
        }

        const student = cursor.value;
        const name = String(student.name || '');
        const pin = String(student.pin || '');

        if (
          student.active !== false &&
          (
            name.toLowerCase().includes(term) ||
            pin.includes(term)
          )
        ) {
          rows.push(student);
        }

        cursor.continue();
      };

      req.onerror = () => reject(req.error);
    });
  }

  async function count(storeName) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const req = db.transaction(storeName, 'readonly')
        .objectStore(storeName)
        .count();

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function localDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async function hasAttendanceToday(pin) {
    const db = await open();
    const key = `${String(pin)}|${localDateKey()}`;

    return new Promise((resolve, reject) => {
      const req = db.transaction(ATTENDANCE, 'readonly')
        .objectStore(ATTENDANCE)
        .index('pinDate')
        .get(key);

      req.onsuccess = () => resolve(Boolean(req.result));
      req.onerror = () => reject(req.error);
    });
  }

  function uuid() {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function deleteAttendanceForPinDate(pin, dateKey) {
    const db = await open();
    const key = `${String(pin)}|${String(dateKey)}`;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(ATTENDANCE, 'readwrite');
      const store = tx.objectStore(ATTENDANCE);
      const index = store.index('pinDate');
      const req = index.openCursor(IDBKeyRange.only(key));
      let deleted = 0;

      req.onsuccess = () => {
        const cursor = req.result;

        if (!cursor) {
          return;
        }

        cursor.delete();
        deleted++;
        cursor.continue();
      };

      req.onerror = () => reject(req.error);
      tx.oncomplete = () => resolve(deleted);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async function addAttendance(student) {
    const now = new Date();
    const dateKey = localDateKey(now);

    const row = {
      id: uuid(),
      pin: String(student.pin),
      name: String(student.name),
      timestamp: now.toISOString(),
      dateKey,
      pinDate: `${String(student.pin)}|${dateKey}`,
      syncStatus: 'pending',
      syncMessage: '',
      createdOnDeviceAt: Date.now()
    };

    await transaction(ATTENDANCE, 'readwrite', store => store.add(row));
    return row;
  }

  async function addTrial(fullName, email, notes) {
    const row = {
      id: uuid(),
      timestamp: new Date().toISOString(),
      fullName: String(fullName || '').trim(),
      email: String(email || '').trim(),
      notes: String(notes || '').trim(),
      syncStatus: 'pending',
      syncMessage: '',
      createdOnDeviceAt: Date.now()
    };

    await transaction(TRIALS, 'readwrite', store => store.add(row));
    return row;
  }

  async function pendingRows(storeName, limit = 250) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const index = db.transaction(storeName, 'readonly')
        .objectStore(storeName)
        .index('syncStatus');

      const req = index.openCursor(IDBKeyRange.only('pending'));
      const rows = [];

      req.onsuccess = () => {
        const cursor = req.result;

        if (!cursor || rows.length >= limit) {
          resolve(rows);
          return;
        }

        rows.push(cursor.value);
        cursor.continue();
      };

      req.onerror = () => reject(req.error);
    });
  }

  async function statusCount(storeName, status) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const req = db.transaction(storeName, 'readonly')
        .objectStore(storeName)
        .index('syncStatus')
        .count(status);

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function applyResults(storeName, results) {
    if (!Array.isArray(results) || !results.length) return;

    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      results.forEach(result => {
        if (!result || !result.id) return;

        const req = store.get(String(result.id));
        req.onsuccess = () => {
          const row = req.result;
          if (!row) return;

          if (result.status === 'synced' || result.status === 'duplicate') {
            row.syncStatus = 'synced';
          } else if (result.status === 'rejected') {
            row.syncStatus = 'rejected';
          } else {
            return;
          }

          row.syncMessage = String(result.message || '');
          row.syncedAt = Date.now();
          store.put(row);
        };
      });

      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async function recentAttendance(limit = 20) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const req = db.transaction(ATTENDANCE, 'readonly')
        .objectStore(ATTENDANCE)
        .openCursor(null, 'prev');

      const rows = [];

      req.onsuccess = () => {
        const cursor = req.result;

        if (!cursor || rows.length >= limit) {
          resolve(rows);
          return;
        }

        rows.push(cursor.value);
        cursor.continue();
      };

      req.onerror = () => reject(req.error);
    });
  }

  async function setMeta(key, value) {
    return transaction(META, 'readwrite', store => {
      store.put({ key: String(key), value, updatedAt: Date.now() });
    });
  }

  async function getMeta(key) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const req = db.transaction(META, 'readonly')
        .objectStore(META)
        .get(String(key));

      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => reject(req.error);
    });
  }

  return {
    replaceStudents,
    getStudent,
    searchStudents,
    countStudents: () => count(STUDENTS),
    countAttendance: () => count(ATTENDANCE),
    countTrials: () => count(TRIALS),
    hasAttendanceToday,
    deleteAttendanceForPinDate,
    addAttendance,
    addTrial,
    getPendingAttendance: limit => pendingRows(ATTENDANCE, limit),
    getPendingTrials: limit => pendingRows(TRIALS, limit),
    pendingAttendanceCount: () => statusCount(ATTENDANCE, 'pending'),
    pendingTrialCount: () => statusCount(TRIALS, 'pending'),
    applyAttendanceResults: results => applyResults(ATTENDANCE, results),
    applyTrialResults: results => applyResults(TRIALS, results),
    recentAttendance,
    setMeta,
    getMeta
  };
})();
