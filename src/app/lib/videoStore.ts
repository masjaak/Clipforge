interface VideoRecord {
  id: string;
  name: string;
  date: string;
  size: number;
  blob: Blob;
  url: string;
}

const store = new Map<string, VideoRecord>();
let loaded = false;

const DB = "clipforge";
const STORE = "videos";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function init(): Promise<void> {
  if (loaded) return;
  loaded = true;
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      for (const entry of req.result) {
        const blob = entry.blob;
        const url = URL.createObjectURL(blob);
        store.set(entry.id, { ...entry, blob, url });
      }
    };
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error("Failed to load videos from IndexedDB", e);
  }
}

export async function add(id: string, name: string, file: Blob): Promise<string> {
  const url = URL.createObjectURL(file);
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  store.set(id, { id, name, date, size: file.size, blob: file, url });

  try {
    const db = await openDB();
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ id, name, date, size: file.size, blob: file });
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error("Failed to save video to IndexedDB", e);
  }

  return url;
}

export function get(id: string): VideoRecord | undefined {
  return store.get(id);
}

export function list(): VideoRecord[] {
  return Array.from(store.values());
}
