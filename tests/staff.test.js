const test = require("node:test");
const assert = require("node:assert/strict");
const { buildSessions, getAllowedEvents, getStatus, needsApproval, summarizeDay, formatDuration, validateEmployee } = require("../lib/staff");

const at = (time) => `2026-01-05T${time}:00.000Z`;
const ev = (type, time) => ({ type, at: at(time) });

test("summarizes work, lunch and break durations", () => {
  const events = [ev("clock_in", "09:00"), ev("break_start", "10:00"), ev("break_end", "10:15"), ev("lunch_start", "12:00"), ev("lunch_end", "12:45"), ev("clock_out", "17:00")];
  const summary = summarizeDay(events);
  assert.equal(formatDuration(summary.breakMs), "0h 15m");
  assert.equal(formatDuration(summary.lunchMs), "0h 45m");
  assert.equal(formatDuration(summary.workedMs), "7h 00m");
});

test("only allows valid clock transitions", () => {
  assert.deepEqual(getAllowedEvents([]), ["clock_in"]);
  const onLunch = [ev("clock_in", "09:00"), ev("lunch_start", "12:00")];
  assert.equal(getStatus(onLunch), "lunch");
  assert.deepEqual(getAllowedEvents(onLunch), ["lunch_end"]);
});

test("rejects duplicate employee IDs and usernames", () => {
  const base = { name: "Ann", hireDate: "2026-01-05", employeeId: "A1", username: "ann", hours: 40 };
  const existing = [validateEmployee(base, [])];
  assert.throws(() => validateEmployee({ ...base, username: "bob" }, existing), /Employee ID/);
  assert.throws(() => validateEmployee({ ...base, employeeId: "B2" }, existing), /username/);
});

test("supports separate break, cue and meeting transitions and counts work categories", () => {
  const events = [ev("clock_in", "09:00"), ev("break_30_start", "09:10")];
  assert.deepEqual(getAllowedEvents(events), ["break_30_end"]);
  events.push(ev("break_30_end", "09:40"), ev("break_60_start", "09:50"));
  assert.deepEqual(getAllowedEvents(events), ["break_60_end"]);
  events.push(ev("break_60_end", "10:50"), ev("cue_start", "11:00"));
  assert.deepEqual(getAllowedEvents(events), ["cue_end"]);
  events.push(ev("cue_end", "11:30"), ev("meeting_start", "11:40"));
  assert.deepEqual(getAllowedEvents(events), ["meeting_end"]);
  events.push(ev("meeting_end", "12:00"), ev("clock_out", "12:10"));
  const summary = summarizeDay(events);
  assert.equal(formatDuration(summary.workedMs), "1h 40m");
  assert.equal(formatDuration(summary.breakMs), "1h 30m");
});

test("flags only durations exceeding the applicable limit", () => {
  for (const [kind, minutes] of [["break30", 30], ["break60", 60], ["work", 60], ["lunch", 60], ["cue", 60], ["meeting", 60], ["break", 60]]) {
    assert.equal(needsApproval({ kind, durationMs: minutes * 60000 }), false);
    assert.equal(needsApproval({ kind, durationMs: minutes * 60000 + 1 }), true);
  }
});

test("splits sessions at local midnight without losing prior-day state", () => {
  const start = new Date(2026, 0, 5, 23, 30);
  const end = new Date(2026, 0, 6, 0, 30);
  const events = [{ type: "clock_in", at: start.toISOString() }, { type: "clock_out", at: end.toISOString() }];
  assert.equal(summarizeDay(events, end, "2026-01-05").workedMs, 30 * 60000);
  assert.equal(summarizeDay(events, end, "2026-01-06").workedMs, 30 * 60000);
  assert.equal(buildSessions(events)[0].durationMs, 60 * 60000);
  assert.equal(summarizeDay(events, end, "").workedMs, 0);
});
