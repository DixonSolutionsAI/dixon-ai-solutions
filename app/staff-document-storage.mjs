const MAX_FILE_BYTES = 10 * 1024 * 1024;
const DATABASE = "officevault-staff-documents";
const STORE = "documents";

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Onboarding document storage is unavailable in this browser."));
      return;
    }
    let request;
    try {
      request = indexedDB.open(DATABASE, 1);
    } catch {
      reject(new Error("Unable to open onboarding document storage."));
      return;
    }
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Unable to open onboarding document storage."));
    request.onblocked = () => reject(new Error("Onboarding document storage is blocked. Close other tabs and try again."));
  });
}

function transact(mode, operation) {
  return openDatabase().then((db) => new Promise((resolve, reject) => {
    let result;
    let transaction;
    try {
      transaction = db.transaction(STORE, mode);
      result = operation(transaction.objectStore(STORE));
      transaction.oncomplete = () => {
        db.close();
        resolve(result);
      };
      transaction.onabort = transaction.onerror = () => {
        db.close();
        reject(new Error("Unable to save or read onboarding documents. Check site storage and available space."));
      };
    } catch (error) {
      db.close();
      reject(error instanceof Error ? error : new Error("Unable to access onboarding document storage."));
    }
  }));
}

export function saveStaffDocuments(employeeId, files) {
  if (!employeeId) throw new Error("Add an Employee ID before uploading documents.");
  if (files.length === 0) return Promise.resolve([]);
  if (files.some((file) => !file.name || file.size === 0)) throw new Error("Choose non-empty onboarding documents.");
  if (files.some((file) => file.size > MAX_FILE_BYTES)) throw new Error("Onboarding documents must be at most 10 MB each.");
  const documents = files.map((file) => ({
    id: `${employeeId}:${crypto.randomUUID()}`,
    employeeId,
    name: file.name,
    size: file.size,
    type: file.type,
    file,
  }));
  return transact("readwrite", (store) => {
    for (const document of documents) store.add(document);
    return documents.map(({ id, name, size, type }) => ({ id, name, size, type }));
  });
}

export function getStaffDocument(id) {
  return transact("readonly", (store) => new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(new Error("Unable to read the onboarding document."));
  }));
}

export function deleteStaffDocuments(employeeId) {
  return transact("readwrite", (store) => {
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      if (cursor.value.employeeId === employeeId) cursor.delete();
      cursor.continue();
    };
    return undefined;
  });
}
