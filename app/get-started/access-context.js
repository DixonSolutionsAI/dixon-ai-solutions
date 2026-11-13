"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const AccessContext = createContext(null);

export function AccessProvider({ children }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    fetch("/api/pilot-session")
      .then((response) => response.json())
      .then((data) => setUnlocked(Boolean(data.unlocked)))
      .catch(() => setUnlocked(false));
  }, []);

  const unlock = useCallback(async (accessCode) => {
    const response = await fetch("/api/pilot-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessCode }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to unlock the pilot.");
    setUnlocked(true);
  }, []);

  const lock = useCallback(async () => {
    await fetch("/api/pilot-session", { method: "DELETE" });
    setUnlocked(false);
  }, []);

  return <AccessContext.Provider value={{ unlocked, unlock, lock }}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  return useContext(AccessContext);
}
