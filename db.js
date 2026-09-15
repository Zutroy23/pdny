const PDDB = (() => {
  const DB_NAME = 'purpleDragonAttendance';
  const DB_VERSION = 1;
  const STUDENTS = 'students';
  const ATTENDANCE = 'attendance';

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
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function withStore(storeName, mode, work) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);

      let result;
      try {
        result = work(store);
      } catch (err) {
        reject(err);
        return;
      }

      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async function putStudents(students) {
    return withStore(STUDENTS, 'readwrite', store => {
      students.forEach(student => {
        store.put({
          pin: String(student.pin),
          name: String(student.name),
          nameLower: String(student.name).toLowerCase(),
          active: student.active !== false,
          updatedAt: Date.now()
        });
      });
    });
  }

  async function getStudent(pin) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STUDENTS, 'readonly');
      const req = tx.objectStore(STUDENTS).get(String(pin));
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function count(storeName) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).count();
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
      const tx = db.transaction(ATTENDANCE, 'readonly');
      const index = tx.objectStore(ATTENDANCE).index('pinDate');
      const req = index.get(key);
      req.onsuccess = () => resolve(Boolean(req.result));
      req.onerror = () => reject(req.error);
    });
  }

  async function addAttendance(student) {
    const now = new Date();
    const dateKey = localDateKey(now);
    const id = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const row = {
      id,
      pin: String(student.pin),
      name: String(student.name),
      timestamp: now.toISOString(),
      dateKey,
      pinDate: `${String(student.pin)}|${dateKey}`,
      syncStatus: 'pending',
      createdOnDeviceAt: Date.now()
    };

    await withStore(ATTENDANCE, 'readwrite', store => store.add(row));
    return row;
  }

  async function pendingCount() {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(ATTENDANCE, 'readonly');
      const index = tx.objectStore(ATTENDANCE).index('syncStatus');
      const req = index.count('pending');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function recentAttendance(limit = 20) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(ATTENDANCE, 'readonly');
      const store = tx.objectStore(ATTENDANCE);
      const req = store.openCursor(null, 'prev');
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

  async function clearAttendance() {
    return withStore(ATTENDANCE, 'readwrite', store => store.clear());
  }

  return {
    putStudents,
    getStudent,
    countStudents: () => count(STUDENTS),
    countAttendance: () => count(ATTENDANCE),
    hasAttendanceToday,
    addAttendance,
    pendingCount,
    recentAttendance,
    clearAttendance
  };
})();
