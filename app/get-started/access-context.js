"use client";

import { createContext, useContext, useState } from "react";

const AccessContext = createContext(null);

export function AccessProvider({ children }) {
  const [accessCode, setAccessCode] = useState("");

  return (
    <AccessContext.Provider value={{ accessCode, setAccessCode }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  return useContext(AccessContext);
}
