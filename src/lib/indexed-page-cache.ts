// Dynamic data only. HTML and static assets belong to the service worker.
const databaseName = "prodeveloper-dynamic";
const storeName = "pages";
const schema = 1;
export const pageRetentionMs = 30 * 24 * 60 * 60 * 1000;
const maxEntries = 120;
const maxBytes = 12 * 1024 * 1024;

export type CachedPage<T> = {
  key: string;
  scope: string;
  page: number;
  schema: number;
  refreshedAt: number;
  bytes: number;
  data: T;
};

let opening: Promise<IDBDatabase | null> | undefined;

function database(): Promise<IDBDatabase | null> {
  if (opening) return opening;
  opening = new Promise((resolve) => {
    if (typeof indexedDB === "undefined") return resolve(null);
    let settled = false;
    const finish = (db: IDBDatabase | null) => {
      if (settled) { db?.close(); return; }
      settled = true;
      clearTimeout(timer);
      resolve(db);
    };
    const timer = setTimeout(() => finish(null), 1000);
    try {
      const request = indexedDB.open(databaseName, schema);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: "key" });
          store.createIndex("scope", "scope");
        }
      };
      request.onerror = () => finish(null);
      request.onblocked = () => finish(null);
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); opening = undefined; };
        db.onclose = () => { opening = undefined; };
        finish(db);
      };
    } catch { finish(null); }
  });
  return opening;
}

function validEntry<T>(entry: CachedPage<unknown>, validate: (data: unknown) => data is T): entry is CachedPage<T> {
  try {
    return entry?.schema === schema && Number.isInteger(entry.page) && entry.page > 0 &&
      typeof entry.scope === "string" && entry.key === `${entry.scope}:${entry.page}` &&
      Number.isFinite(entry.refreshedAt) && entry.refreshedAt <= Date.now() + 60000 &&
      Date.now() - entry.refreshedAt < pageRetentionMs && validate(entry.data);
  } catch { return false; }
}

export async function readCachedPages<T>(scope: string, validate: (data: unknown) => data is T): Promise<CachedPage<T>[]> {
  const db = await database();
  if (!db) return [];
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve([]), 1500);
    try {
      const transaction = db.transaction(storeName, "readonly");
      const request = transaction.objectStore(storeName).index("scope").getAll(scope);
      request.onsuccess = () => {
        clearTimeout(timer);
        const entries = request.result as CachedPage<unknown>[];
        resolve(entries.filter(entry => validEntry(entry, validate)).sort((a, b) => a.page - b.page));
      };
      request.onerror = () => { clearTimeout(timer); resolve([]); };
      transaction.onabort = () => { clearTimeout(timer); resolve([]); };
    } catch { clearTimeout(timer); resolve([]); }
  });
}

export async function writeCachedPage<T>(scope: string, page: number, data: T, refreshedAt: number): Promise<void> {
  // A read/restore must never reset the successful refresh time.
  if (!Number.isFinite(refreshedAt) || Date.now() - refreshedAt >= pageRetentionMs) return;
  const serialized = JSON.stringify(data);
  const bytes = serialized.length * 2;
  if (bytes > 512 * 1024) return;
  const db = await database();
  if (!db) return;
  await new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, 1500);
    const finish = () => { clearTimeout(timer); resolve(); };
    try {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const key = `${scope}:${page}`;
      const previous = store.get(key);
      previous.onsuccess = () => {
        if (!previous.result || previous.result.refreshedAt <= refreshedAt) {
          store.put({ key, scope, page, schema, bytes, refreshedAt, data } satisfies CachedPage<T>);
        }
      };
      const entries = store.getAll();
      entries.onsuccess = () => {
        const rows = (entries.result as CachedPage<unknown>[]).sort((a, b) => b.refreshedAt - a.refreshedAt);
        let used = bytes, count = 1;
        for (const row of rows) {
          if (row.key === key) continue;
          if (row.schema !== schema || !Number.isFinite(row.refreshedAt) ||
            Date.now() - row.refreshedAt >= pageRetentionMs || !Number.isFinite(row.bytes) ||
            ++count > maxEntries || (used += row.bytes) > maxBytes) store.delete(row.key);
        }
      };
      transaction.oncomplete = finish;
      transaction.onerror = finish; // Quota/security failures never break rendering.
      transaction.onabort = finish;
    } catch { finish(); }
  });
}

export function contiguousPages<T>(entries: { page: number; data: T }[]): Map<number, T> {
  const pages = new Map<number, T>();
  for (const entry of [...entries].sort((a, b) => a.page - b.page)) {
    if (entry.page !== pages.size + 1) break;
    pages.set(entry.page, entry.data);
  }
  return pages;
}
