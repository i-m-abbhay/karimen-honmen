// ===== Exam history: IndexedDB (attempts) + localStorage (per-exam summary) =====
const EXAM_SUMMARY_KEY = 'karimen-exam-progress';
const EXAM_DB_NAME = 'karimen-knowledge-hub';
const EXAM_DB_VERSION = 1;
const EXAM_STORE = 'examAttempts';

let examDbPromise = null;

function openExamDb() {
  if (examDbPromise) return examDbPromise;
  examDbPromise = new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(EXAM_DB_NAME, EXAM_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(EXAM_STORE)) {
        const store = db.createObjectStore(EXAM_STORE, { keyPath: 'id' });
        store.createIndex('examId', 'examId', { unique: false });
        store.createIndex('finishedAt', 'finishedAt', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return examDbPromise;
}

function loadExamSummaries() {
  try {
    return JSON.parse(localStorage.getItem(EXAM_SUMMARY_KEY) || '{}');
  } catch (_) {
    return {};
  }
}

function saveExamSummaries(summaries) {
  localStorage.setItem(EXAM_SUMMARY_KEY, JSON.stringify(summaries));
}

function getExamSummary(examId) {
  return loadExamSummaries()[examId] || null;
}

function formatExamSummaryLine(summary) {
  if (!summary || !summary.attempts) return '';
  const best = summary.best ?? 0;
  const last = summary.last ?? 0;
  const pass = summary.passed ? ' · Passed' : '';
  return `Best ${best} · Last ${last} · ${summary.attempts} attempt${summary.attempts === 1 ? '' : 's'}${pass}`;
}

async function addExamAttempt(attempt) {
  const record = {
    id: `${attempt.finishedAt}-${attempt.examId}-${Math.random().toString(36).slice(2, 8)}`,
    ...attempt
  };

  try {
    const db = await openExamDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(EXAM_STORE, 'readwrite');
      tx.objectStore(EXAM_STORE).add(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, using localStorage fallback', err);
    const key = 'karimen-exam-history-fallback';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.unshift(record);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 200)));
  }

  const summaries = loadExamSummaries();
  const prev = summaries[attempt.examId] || { best: 0, attempts: 0, passed: false };
  summaries[attempt.examId] = {
    best: Math.max(prev.best ?? 0, attempt.score),
    last: attempt.score,
    attempts: (prev.attempts ?? 0) + 1,
    passed: prev.passed || attempt.passed,
    lastAt: attempt.finishedAt
  };
  saveExamSummaries(summaries);
  return record;
}

async function getExamHistory(limit = 100) {
  try {
    const db = await openExamDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(EXAM_STORE, 'readonly');
      const req = tx.objectStore(EXAM_STORE).index('finishedAt').openCursor(null, 'prev');
      const results = [];
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (_) {
    const fallback = JSON.parse(localStorage.getItem('karimen-exam-history-fallback') || '[]');
    return fallback.slice(0, limit);
  }
}

async function clearExamHistory() {
  try {
    const db = await openExamDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(EXAM_STORE, 'readwrite');
      tx.objectStore(EXAM_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (_) { /* ignore */ }
  localStorage.removeItem('karimen-exam-history-fallback');
  localStorage.removeItem(EXAM_SUMMARY_KEY);
}

function formatAttemptDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDuration(seconds) {
  if (seconds == null) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
