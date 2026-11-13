const MAX_FILE_BYTES = 10 * 1024 * 1024;
const STORE = "templates";

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Template storage is unavailable in this browser."));
      return;
    }
    let blocked = false;
    let request;
    try {
      request = indexedDB.open("officevault-project-templates", 1);
    } catch {
      reject(new Error("Unable to open template storage in this browser."));
      return;
    }
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    request.onsuccess = () => {
      if (blocked) request.result.close();
      else resolve(request.result);
    };
    request.onerror = () => reject(new Error("Unable to open template storage in this browser."));
    request.onblocked = () => {
      blocked = true;
      reject(new Error("Template storage is blocked. Close other tabs and try again."));
    };
  });
}

async function transact(mode, operation) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    let result;
    let transaction;
    try {
      transaction = db.transaction(STORE, mode);
      const request = operation(transaction.objectStore(STORE));
      request.onsuccess = () => { result = request.result; };
      transaction.oncomplete = () => { db.close(); resolve(result); };
      transaction.onabort = transaction.onerror = () => {
        db.close();
        reject(new Error("Unable to access template storage. Check site storage and available space."));
      };
    } catch {
      db.close();
      reject(new Error("Unable to access template storage. Check site storage and available space."));
    }
  });
}

export function listProjectTemplates() {
  return transact("readonly", (store) => store.getAll());
}

export function saveProjectTemplate(file) {
  if (!file || !file.name || file.size === 0) {
    throw new Error("Choose a non-empty file to upload.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Template files must be at most 10 MB.");
  }
  return transact("readwrite", (store) => store.add({ name: file.name, file }));
}

export function deleteProjectTemplate(id) {
  return transact("readwrite", (store) => store.delete(id));
}
