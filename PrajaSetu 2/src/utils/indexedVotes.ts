// Minimal IndexedDB helper for anonymized voting tallies and entries
const DB_NAME = 'civic-votes-db';
const DB_VERSION = 1;
const TALLIES_STORE = 'tallies';
const ENTRIES_STORE = 'entries';

function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(TALLIES_STORE)) {
        db.createObjectStore(TALLIES_STORE, { keyPath: 'candidateId' });
      }
      if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
        db.createObjectStore(ENTRIES_STORE, { autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function appendAnonymizedEntry(entry: { candidateId: number; candidateName?: string; time: string }) {
  const db = await openDB();
  const tx = db.transaction([ENTRIES_STORE, TALLIES_STORE], 'readwrite');
  const entries = tx.objectStore(ENTRIES_STORE);
  const tallies = tx.objectStore(TALLIES_STORE);
  entries.add(entry);
  // update tally
  const getReq = tallies.get(entry.candidateId);
  getReq.onsuccess = function () {
    const existing = getReq.result;
    if (existing) {
      existing.count = (existing.count || 0) + 1;
      existing.candidateName = existing.candidateName || entry.candidateName || existing.candidateName;
      tallies.put(existing);
    } else {
      tallies.put({ candidateId: entry.candidateId, candidateName: entry.candidateName || '', count: 1 });
    }
  };
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getTallies() {
  const db = await openDB();
  const tx = db.transaction(TALLIES_STORE, 'readonly');
  const store = tx.objectStore(TALLIES_STORE);
  return new Promise<any[]>((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getEntries() {
  const db = await openDB();
  const tx = db.transaction(ENTRIES_STORE, 'readonly');
  const store = tx.objectStore(ENTRIES_STORE);
  return new Promise<any[]>((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function clearAll() {
  const db = await openDB();
  const tx = db.transaction([TALLIES_STORE, ENTRIES_STORE], 'readwrite');
  tx.objectStore(TALLIES_STORE).clear();
  tx.objectStore(ENTRIES_STORE).clear();
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
