/**
 * Storage Service — localStorage adapter with backend-ready interface.
 *
 * All persistence goes through this layer so it can be swapped
 * for a REST/GraphQL client later without touching store logic.
 */

const STORAGE_KEY = 'cinelens_v4';
const DB_NAME = 'cinelens_media';
const DB_VERSION = 1;
const STORE_NAME = 'images';

/**
 * Load persisted state from localStorage.
 * @returns {Object|null} Saved state or null if none exists.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Storage] Failed to load state:', err.message);
    return null;
  }
}

/**
 * Save state to localStorage.
 * @param {Object} state - State to persist.
 * @returns {{ success: boolean, error?: string }}
 */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { success: true };
  } catch (err) {
    console.warn('[Storage] Failed to save state:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Clear all persisted state.
 */
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[Storage] Failed to clear state:', err.message);
  }
}

/**
 * Get approximate storage usage in bytes.
 * @returns {number}
 */
export function getStorageSize() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || '';
    return raw.length * 2; // UTF-16 ≈ 2 bytes/char
  } catch {
    return 0;
  }
}

/**
 * Get formatted storage info.
 * @returns {{ usedKB: string, usedMB: string, percent: string, isHigh: boolean }}
 */
export function getStorageInfo() {
  const bytes = getStorageSize();
  const MAX = 5 * 1024 * 1024; // ~5MB typical localStorage limit
  const percent = Math.min(100, (bytes / MAX) * 100);

  return {
    usedKB: (bytes / 1024).toFixed(0),
    usedMB: (bytes / 1024 / 1024).toFixed(2),
    percent: percent.toFixed(1),
    isHigh: percent > 80,
    isMedium: percent > 50,
  };
}

function openMediaDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function withImageStore(mode, fn) {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const result = fn(store);
    tx.oncomplete = () => {
      db.close();
      resolve(result?.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export function saveImage(key, dataUrl) {
  if (!dataUrl) return deleteImage(key);
  return withImageStore('readwrite', store => store.put(dataUrl, key));
}

export function loadImage(key) {
  return withImageStore('readonly', store => store.get(key));
}

export function deleteImage(key) {
  return withImageStore('readwrite', store => store.delete(key));
}
