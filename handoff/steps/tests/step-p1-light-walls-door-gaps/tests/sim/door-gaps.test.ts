import assert from "node:assert/strict";
import { test } from "node:test";
import { createClock } from "../../src/core/clock/index.ts";
import { parseLog, readAction } from "../../src/core/log/index.ts";
import { createWorld, disposeWorld, loadSave, restore, saveMatch, snapshot, submit, type SimWorld } from "../../src/sim/index.ts";
import { input } from "./input.ts";

// P1 (G4b): post-34 QA rows 6, 7, 10, 11, 13 and 14. Each hostile input gets a named refusal: no throw, no hang, no log entry.
const mv = (over: object = {}): Record<string, unknown> => ({ id: "m", kind: "move", actor: "knight#1", target: { pipe: "tile", at: { c: 0, r: 7 } }, durationMs: null, turns: null, effects: [], ...over });
const msg = (fn: () => unknown): string => { try { fn(); return "ok"; } catch (e) { return e instanceof Error ? e.message : String(e); } };
const meta = { projectId: "p1", savedAt: "2026-11-15T17:00:00Z" };

test("row 6: an action with more effects than the text limit is refused as actionRefused and never logged (P1 G4b)", () => {
  const world = createWorld(input("stage-fixed"));
  submit(world, mv({ effects: Array.from({ length: 129 }, () => "e") }) as never);
  assert.equal(world.log.lastSeq(), 0); assert.equal(world.notices.at(-1)?.code, "actionRefused");
  assert.equal(readAction(mv({ effects: Array.from({ length: 128 }, () => "e") })) === null, false);
  assert.equal(readAction(mv({ effects: Array.from({ length: 129 }, () => "e") })), null);
  const text = world.log.toJSON().replace('"entries":[]', `"entries":[{"seq":1,"tick":0,"action":${JSON.stringify(mv({ effects: Array.from({ length: 300 }, () => "e") }))}}]`);
  assert.equal(parseLog(text).ok, false);
});

test("row 7: a getter that disposes the world mid-submit leaves no log entry (P1 G4b)", () => {
  const world = createWorld(input("stage-fixed")), action = mv();
  Object.defineProperty(action, "id", { enumerable: true, get() { disposeWorld(world); return "m"; } });
  assert.equal(msg(() => submit(world, action as never)), "ok");
  assert.equal(world.log.lastSeq(), 0);
});

test("row 10: after() with ms over 2147483647 is reported like other bad values and never armed (P1 G4b)", () => {
  const k = createClock(), errs: unknown[] = []; k.onError((e) => errs.push(e));
  for (const ms of [2147483648, 2 ** 53 + 2, 1e300]) { const t = k.after(ms, () => {}); assert.equal(t.id, 0); assert.equal(t.dueMs, -1); }
  assert.equal(errs.length, 3); assert.ok(errs.every((e) => e instanceof RangeError));
  assert.ok(k.after(2147483647, () => {}).id > 0, "INT_MAX itself is allowed");
});

test("row 11: step, advance and skip called inside a tick are reported and ignored (P1 G4b)", () => {
  const k = createClock(), errs: unknown[] = []; k.onError((e) => errs.push(e));
  let calls = 0; const off = k.onTick(() => { calls += 1; if (calls === 1) { k.step(); k.advance(1000); k.skip(5); } });
  k.step(); assert.equal(k.tick(), 1); assert.equal(calls, 1); assert.equal(errs.length, 3);
  assert.ok(errs.every((e) => e instanceof RangeError && /inside a tick/.test(e.message)));
  off(); const fired: number[] = []; k.after(0, () => { fired.push(k.tick()); k.step(); });
  k.step(); assert.deepEqual(fired, [2]); assert.equal(k.tick(), 2); assert.equal(errs.length, 4);
  k.step(); assert.equal(k.tick(), 3, "the guard clears after the tick");
});

test("row 13: restore and loadSave refuse phases whose keys or values are not this world's (P1 G4b)", () => {
  const src = input("stage-fixed"), world = createWorld(src); submit(world, mv() as never);
  const shot = snapshot(world), keep = { ...shot.phases };
  for (const phases of [{ ...keep, bogus: "play.loading" }, {}, { ...keep, battle: "zzz" }, { ...keep, battle: 5 }]) {
    assert.equal(msg(() => restore(src, world.log, { ...shot, phases } as never)), "restore: snapshot phases are not this world's");
    const text = saveMatch(world, meta).replace(JSON.stringify({ phases: keep }).slice(1, -1), JSON.stringify({ phases }).slice(1, -1));
    const r = loadSave(src, text); assert.equal(r.ok ? "ok" : r.code, "saveSnapshotPhasesInvalid");
  }
  assert.equal(msg(() => restore(src, world.log, shot)), "ok");
  const r = loadSave(src, saveMatch(world, meta)); assert.equal(r.ok, true);
});

test("row 14: restore reads the log's entries once, bounded, and refuses a lying or throwing log by name (P1 G4b)", () => {
  const src = input("stage-fixed"), world: SimWorld = createWorld(src); submit(world, mv() as never);
  const shot = snapshot(world), real = world.log;
  let reads = 0; const counted = { ...real, header: real.header, lastSeq: () => real.lastSeq(), entries: () => { reads += 1; return real.entries(); } };
  assert.equal(msg(() => restore(src, counted as never, shot)), "ok"); assert.equal(reads, 1);
  const liar = { ...counted, entries: () => new Proxy([], { get: (t, k) => (k === "length" ? 1e9 : Reflect.get(t, k)) }) };
  const t0 = Date.now(); assert.equal(msg(() => restore(src, liar as never, shot)), "restore: the log is not plain data"); assert.ok(Date.now() - t0 < 1000);
  for (const entries of [() => { throw new Error("log boom"); }, () => [undefined], () => [{ tick: Number.NaN, action: {} }]]) assert.equal(msg(() => restore(src, { ...counted, entries } as never, shot)), "restore: the log is not plain data");
});
