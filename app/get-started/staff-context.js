"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { buildSessions, getAllowedEvents, getStatus, hashPassword, needsApproval, randomSalt, sessionKey, validateEmployee } from "../../lib/staff";

const StaffContext = createContext(null);
const EMPLOYEES_KEY = "staff.employees";
const LOGS_KEY = "staff.timelogs";
const SESSION_KEY = "staff.session";
const APPROVALS_KEY = "staff.timeApprovals";

function read(storage, key, fallback) {
  try {
    const parsed = JSON.parse(storage.getItem(key));
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function StaffProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [events, setEvents] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEmployees(read(localStorage, EMPLOYEES_KEY, []));
    setEvents(read(localStorage, LOGS_KEY, []));
    setApprovals(read(localStorage, APPROVALS_KEY, []));
    setEmployeeId(sessionStorage.getItem(SESSION_KEY) || "");
    setReady(true);
    function sync(event) {
      if (event.key === EMPLOYEES_KEY) setEmployees(read(localStorage, EMPLOYEES_KEY, []));
      if (event.key === LOGS_KEY) setEvents(read(localStorage, LOGS_KEY, []));
      if (event.key === APPROVALS_KEY) setApprovals(read(localStorage, APPROVALS_KEY, []));
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const saveEmployees = useCallback((next) => {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(next));
    setEmployees(next);
  }, []);

  const hire = useCallback((candidate) => {
    const employee = validateEmployee(candidate, employees);
    saveEmployees([...employees, { ...employee, salt: "", passwordHash: "" }]);
  }, [employees, saveEmployees]);

  const removeEmployee = useCallback((id) => {
    saveEmployees(employees.filter((employee) => employee.employeeId !== id));
  }, [employees, saveEmployees]);

  const findByUsername = (username, id) => employees.find(
    (employee) => employee.username.toLowerCase() === username.trim().toLowerCase() && employee.employeeId.toLowerCase() === id.trim().toLowerCase()
  );

  const setPassword = useCallback(async (username, id, password) => {
    const employee = findByUsername(username, id);
    if (!employee || employee.passwordHash) throw new Error("Those details do not match an employee waiting for a password.");
    if (password.length < 8) throw new Error("Choose a password of at least 8 characters.");
    const salt = randomSalt();
    const passwordHash = await hashPassword(password, salt);
    saveEmployees(employees.map((item) => (item.employeeId === employee.employeeId ? { ...item, salt, passwordHash } : item)));
  }, [employees, saveEmployees]);

  const signIn = useCallback(async (username, id, password) => {
    const employee = findByUsername(username, id);
    if (!employee || !employee.passwordHash) throw new Error("Sign-in failed. Check your username, Company ID and password.");
    const attempt = await hashPassword(password, employee.salt);
    if (attempt !== employee.passwordHash) throw new Error("Sign-in failed. Check your username, Company ID and password.");
    sessionStorage.setItem(SESSION_KEY, employee.employeeId);
    setEmployeeId(employee.employeeId);
  }, [employees]);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setEmployeeId("");
  }, []);

  const record = useCallback((type) => {
    const mine = events.filter((event) => event.employeeId === employeeId);
    if (!getAllowedEvents(mine).includes(type)) throw new Error("That action is not available right now.");
    const next = [...events, { employeeId, type, at: new Date().toISOString() }];
    localStorage.setItem(LOGS_KEY, JSON.stringify(next));
    setEvents(next);
  }, [events, employeeId]);

  const approveSession = useCallback((id, key) => {
    const session = buildSessions(events.filter((event) => event.employeeId === id))
      .find((item) => sessionKey(id, item) === key);
    if (!session || !session.end || !needsApproval(session)) throw new Error("This session is not ready for approval.");
    if (approvals.some((item) => item.key === key)) throw new Error("This session has already been approved.");
    const next = [...approvals, { key, at: new Date().toISOString() }];
    localStorage.setItem(APPROVALS_KEY, JSON.stringify(next));
    setApprovals(next);
  }, [events, approvals]);

  const employee = employees.find((item) => item.employeeId === employeeId) || null;
  const myEvents = useMemo(() => events.filter((event) => event.employeeId === employeeId), [events, employeeId]);
  const status = employee ? getStatus(myEvents) : "out";

  return (
    <StaffContext.Provider value={{ ready, employees, employee, events, myEvents, approvals, status, hire, removeEmployee, setPassword, signIn, signOut, record, approveSession }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  return useContext(StaffContext);
}
