import { test } from "node:test";
import assert from "node:assert/strict";
import { ENGINE_VERSION } from "../../src/index.ts";
import { createClock } from "../../src/core/clock/index.ts";
import { createBus, logEvents } from "../../src/core/events/index.ts";
import { LOG_FORMAT_VERSION, createLog, parseLog, type Action, type LogHeader } from "../../src/core/log/index.ts";
import { aimTile, aimUnit } from "../../src/core/targeting/index.ts";

const head: LogHeader = { seed: 7, formatVersion: LOG_FORMAT_VERSION, engineVersion: ENGINE_VERSION, projectHash: "ph" };
const act = (id: string, kind: Action["kind"], target: Action["target"], over: Partial<Action> = {}): Action =>
  ({ id, kind, actor: "a#1", target, durationMs: 0, turns: null, effects: [], ...over });
test("header carries seed, formatVersion 1, engineVersion and projectHash", () => {
  assert.deepEqual(createLog(head).header, head);
  assert.equal(head.engineVersion, ENGINE_VERSION);
});
test("an action is data with a duration (M4)", () => {
  const action = act("m", "move", aimTile({ c: 2, r: 3 }), { durationMs: 200 });
  const log = createLog(head);
  log.append(0, action);
  assert.deepEqual(log.entries()[0]?.action, action);
});
test("round trip is byte-identical", () => {
  const log = createLog(head);
  log.append(0, act("1", "move", aimUnit("a#1", { c: 1, r: 1 }), { durationMs: 100 }));
  log.append(0, act("2", "ability", aimTile({ c: 2, r: 2 }, "S"), { turns: 1, effects: ["hit"] }));
  log.append(1, act("3", "wait", null, { durationMs: null, via: { presentation: "menu", ref: "w" } }));
  const text = log.toJSON();
  const parsed = parseLog(text);
  assert.equal(parsed.ok && parsed.log.toJSON(), text);
});
test("parseLog never throws on bad input", () => {
  const log = createLog(head);
  log.append(5, act("1", "wait", null, { durationMs: null }));
  const raw = JSON.parse(log.toJSON()) as { entries: [{ seq: number; tick: number; action: Action }] };
  const one = raw.entries[0].action;
  const dump = (header: unknown, entries: unknown) => JSON.stringify({ header, entries });
  const bad = (json: string, error: string) => assert.deepEqual(parseLog(json), { ok: false, error });
  bad("{", "not JSON");
  bad(JSON.stringify({ entries: [] }), "missing header or entries");
  bad(JSON.stringify({ header: head }), "missing header or entries");
  bad(dump({ ...head, formatVersion: 2 }, []), "unsupported log formatVersion 2");
  bad(dump({ ...head, seed: "x" }, []), "bad header");
  bad(dump(head, [{ seq: 1, tick: 0, action: { ...one, id: 4 } }]), "bad entry");
  bad(dump(head, [{ seq: 1, tick: 0, action: { ...one, target: { pipe: "tile", at: { c: 0, r: 0 }, edge: "Q" } } }]), "bad entry");
  bad(dump(head, [{ seq: 1, tick: 0, action: { ...one, durationMs: 1.5 } }]), "bad entry");
  bad(dump(head, [{ seq: 4, tick: 0, action: one }]), "bad entry");
  bad(dump(head, [{ seq: 1, tick: 3, action: one }, { seq: 2, tick: 2, action: one }]), "bad entry");
});
test("seq is the 1-based append order; 0 = none", () => {
  const log = createLog(head);
  assert.equal(log.lastSeq(), 0);
  log.append(0, act("1", "wait", null));
  log.append(0, act("2", "ability", null));
  log.append(2, act("3", "move", aimTile({ c: 0, r: 0 })));
  assert.deepEqual(log.entries().map((e) => e.seq), [1, 2, 3]);
  assert.equal(log.lastSeq(), 3);
  const raw = JSON.parse(log.toJSON()) as { entries: [{ seq: number }, { seq: number }] };
  raw.entries[1].seq = 9;
  assert.equal(parseLog(JSON.stringify(raw)).ok, false);
});
test("actionLogged carries seq, kind, durationMs", () => {
  const bus = createBus(createClock());
  const log = createLog(head, logEvents(bus));
  log.append(0, act("w", "wait", null, { durationMs: null }));
  assert.deepEqual(bus.history()[0]?.event, { type: "actionLogged", seq: 1, kind: "wait", durationMs: null });
});
test("append-only, ticks never go backwards", () => {
  const log = createLog(head);
  assert.equal("remove" in log || "edit" in log || "undo" in log, false);
  log.append(5, act("1", "wait", null));
  assert.throws(() => log.append(4, act("2", "wait", null)), RangeError);
  log.append(5, act("3", "wait", null));
  assert.throws(() => log.append(1.5, act("4", "wait", null)), RangeError);
  assert.throws(() => log.append(-1, act("5", "wait", null)), RangeError);
  assert.equal(log.lastSeq(), 2);
});
test("via is logged and never read by core (M9)", () => {
  const bus = createBus(createClock());
  const log = createLog(head, logEvents(bus));
  const via = { presentation: "menu", ref: "ok" };
  log.append(0, act("1", "ability", null, { via }));
  assert.deepEqual(log.entries()[0]?.action.via, via);
  const ev = bus.history()[0]?.event;
  assert.equal(ev !== undefined && "via" in ev, false);
  assert.deepEqual(ev, { type: "actionLogged", seq: 1, kind: "ability", durationMs: 0 });
});
