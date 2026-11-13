const test = require("node:test");
const assert = require("node:assert/strict");
const { getAllowedEvents, getStatus, summarizeDay, formatDuration, validateEmployee } = require("../lib/staff");

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
