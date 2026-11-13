const EVENT_LABELS = {
  clock_in: "Clock in",
  clock_out: "Clock out",
  lunch_start: "Start lunch",
  lunch_end: "End lunch",
  break_start: "Start break",
  break_end: "End break",
  break_30_start: "Clock in 30 minute break",
  break_30_end: "Clock out 30 minute break",
  break_60_start: "Clock in hour break",
  break_60_end: "Clock out hour break",
  cue_start: "Clock into Cue Time",
  cue_end: "Clock out of Cue Time",
  meeting_start: "Clock into Meeting",
  meeting_end: "Clock out of Meeting Time",
};

const STATUS_BY_EVENT = {
  clock_in: "working",
  lunch_end: "working",
  break_end: "working",
  break_30_end: "working",
  break_60_end: "working",
  cue_end: "working",
  meeting_end: "working",
  lunch_start: "lunch",
  break_start: "break",
  break_30_start: "break30",
  break_60_start: "break60",
  cue_start: "cue",
  meeting_start: "meeting",
  clock_out: "out",
};

const ALLOWED_EVENTS = {
  out: ["clock_in"],
  working: ["clock_out", "lunch_start", "break_30_start", "break_60_start", "cue_start", "meeting_start"],
  lunch: ["lunch_end"],
  break: ["break_end"],
  break30: ["break_30_end"],
  break60: ["break_60_end"],
  cue: ["cue_end"],
  meeting: ["meeting_end"],
};

const SESSION_KINDS = { working: "work", lunch: "lunch", break: "break", break30: "break30", break60: "break60", cue: "cue", meeting: "meeting" };
const KIND_LABELS = { work: "Work", lunch: "Lunch", break: "Break", break30: "30 minute break", break60: "Hour break", cue: "Cue Time", meeting: "Meeting" };

function dateKey(value) {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function sortEvents(events) {
  return [...events].sort((a, b) => new Date(a.at) - new Date(b.at));
}

function getStatus(events) {
  const last = sortEvents(events).at(-1);
  return last ? STATUS_BY_EVENT[last.type] : "out";
}

function getAllowedEvents(events) {
  return ALLOWED_EVENTS[getStatus(events)];
}

function buildSessions(events, now = new Date()) {
  const sessions = [];
  let open = null;
  for (const event of sortEvents(events)) {
    const status = STATUS_BY_EVENT[event.type];
    if (open) {
      sessions.push({ ...open, end: event.at });
      open = null;
    }
    if (status !== "out") open = { kind: SESSION_KINDS[status], start: event.at, startType: event.type };
  }
  if (open) sessions.push({ ...open, end: null, endsAt: new Date(now).toISOString() });
  return sessions.map((session) => {
    const end = session.end || session.endsAt;
    return {
      kind: session.kind,
      start: session.start,
      startType: session.startType,
      end: session.end,
      durationMs: Math.max(0, new Date(end) - new Date(session.start)),
    };
  });
}

function summarizeDay(events, now = new Date(), day = null) {
  const allSessions = buildSessions(events, now);
  let sessions = allSessions;
  if (day !== null && !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    sessions = [];
  } else if (day) {
    const [year, month, date] = day.split("-").map(Number);
    const start = new Date(year, month - 1, date);
    const end = new Date(year, month - 1, date + 1);
    sessions = allSessions.flatMap((session) => {
      const sessionStart = new Date(session.start);
      const sessionEnd = new Date(session.end || now);
      const clippedStart = Math.max(start, sessionStart);
      const clippedEnd = Math.min(end, sessionEnd);
      if (clippedEnd <= clippedStart) return [];
      return [{ ...session, start: new Date(clippedStart).toISOString(), end: session.end || sessionEnd >= end ? new Date(clippedEnd).toISOString() : null, durationMs: clippedEnd - clippedStart }];
    });
  }
  const total = (kinds) => sessions.filter((session) => kinds.includes(session.kind)).reduce((sum, session) => sum + session.durationMs, 0);
  const sorted = sortEvents(day !== null ? events.filter((event) => dateKey(event.at) === day) : events);
  const clockOuts = sorted.filter((event) => event.type === "clock_out");
  return {
    workedMs: total(["work", "cue", "meeting"]),
    lunchMs: total(["lunch"]),
    breakMs: total(["break", "break30", "break60"]),
    firstClockIn: sorted.find((event) => event.type === "clock_in")?.at || null,
    lastClockOut: clockOuts.at(-1)?.at || null,
    sessions,
  };
}

function needsApproval(session) {
  return session.durationMs > (session.kind === "break30" ? 30 : 60) * 60000;
}

function sessionKey(employeeId, session) {
  return JSON.stringify([employeeId, session.start, session.startType]);
}

function formatDuration(ms) {
  const totalMinutes = Math.floor(Math.max(0, ms) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  return `${hours}h ${String(totalMinutes % 60).padStart(2, "0")}m`;
}

function validateEmployee(candidate, employees) {
  const name = String(candidate.name || "").trim();
  const employeeId = String(candidate.employeeId || "").trim();
  const username = String(candidate.username || "").trim();
  const hours = Number(candidate.hours);
  if (!name) throw new Error("Enter the employee's name.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate.hireDate || "")) throw new Error("Enter the hire date.");
  if (!/^[A-Za-z0-9-]{2,32}$/.test(employeeId)) throw new Error("Employee ID must be 2-32 letters, numbers, or hyphens.");
  if (!/^[A-Za-z0-9._-]{2,32}$/.test(username)) throw new Error("Username must be 2-32 letters, numbers, dots, underscores, or hyphens.");
  if (!Number.isFinite(hours) || hours <= 0 || hours > 168) throw new Error("Enter weekly hours between 1 and 168.");
  if (employees.some((employee) => employee.employeeId.toLowerCase() === employeeId.toLowerCase())) throw new Error("That Employee ID already exists.");
  if (employees.some((employee) => employee.username.toLowerCase() === username.toLowerCase())) throw new Error("That username already exists.");
  return {
    name,
    hireDate: candidate.hireDate,
    employeeId,
    username,
    hours,
    contact: { email: String(candidate.contact?.email || "").trim(), phone: String(candidate.contact?.phone || "").trim() },
    documents: (candidate.documents || []).map(({ name: fileName, size }) => ({ name: String(fileName), size: Number(size) || 0 })),
  };
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomSalt() {
  return toHex(globalThis.crypto.getRandomValues(new Uint8Array(16)));
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await globalThis.crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 210000, hash: "SHA-256" }, key, 256);
  return toHex(bits);
}

module.exports = {
  EVENT_LABELS,
  KIND_LABELS,
  buildSessions,
  dateKey,
  formatDuration,
  getAllowedEvents,
  getStatus,
  hashPassword,
  randomSalt,
  needsApproval,
  sessionKey,
  summarizeDay,
  validateEmployee,
};
