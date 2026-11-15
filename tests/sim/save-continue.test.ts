import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_LEVEL_RULES } from "../../src/btf-adapters/src/index.ts";
import type { Event, Phase } from "../../src/state/index.ts";
import { createTurn, createWorld, loadSave, replayTicks, saveMatch, snapshot, submit, type SimInput, type SimWorld, type Turn } from "../../src/sim/index.ts";
import { input, move } from "./input.ts";

const meta = { projectId: "p1", savedAt: "2026-11-15T22:00:00Z" }, other = { projectId: "p2", savedAt: "2026-11-15T22:01:00Z" };
const src = (stage: "stage-fixed" | "stage-weighted", levels = false): SimInput => (levels ? { ...input(stage), levels: { rules: { ...BTF_LEVEL_RULES, bar: "unit" }, pools: { knight: ["guard", "ward"], archer: ["volley", "snipe"] } } } : input(stage));
const shot = (w: SimWorld): string => JSON.stringify(snapshot(w));
const load = (s: SimInput, text: string): SimWorld => { const r = loadSave(s, text); if (!r.ok) throw new Error(r.code); return r.world; };
const ev = (type: string, more: Record<string, unknown> = {}): Event => ({ type, ...more }) as Event;
const START = [ev("BATTLE_READY"), ev("DEPLOY_DONE"), ev("ROUND_BEGIN"), ev("SIDE_BEGIN")];
const begin = (w: SimWorld, fuse: number | "off"): { t: Turn; fused: Phase[] } => { const fused: Phase[] = [], t = createTurn(w, { fuse, onFuse: (to) => fused.push(to) }); for (const e of START) t.go(e); return { t, fused }; };
const walk = (t: Turn, w: SimWorld, unit: string, c: number, r: number, id: string, ms: number | null = 200): void => { t.go(ev("SELECT_UNIT", { unitId: unit })); t.go(ev("TAP_MOVE_CELL", { at: { c, r } })); submit(w, move(id, unit, c, r, ms)); };
const atOf = (w: SimWorld, id: string): string => { const u = w.units.get(id); return `${u?.at.c},${u?.at.r}`; };

test("G4 R4 fuse during moving is held and lands at MOVE_DONE (straight to sideEnd); with no fuse MOVE_DONE goes to actMenu", () => {
  const w = createWorld(src("stage-fixed")), { t, fused } = begin(w, 1230); const due = w.clock.now() + 1230;
  walk(t, w, "knight#1", 0, 7, "m1", 2000); replayTicks(w, 122); assert.deepEqual([w.phases.battle, t.pendingFuse, fused], ["moving", false, []]);
  replayTicks(w, 1); assert.equal(w.clock.now(), due); assert.deepEqual([w.phases.battle, t.pendingFuse, t.settled, fused], ["moving", true, false, []]);
  assert.equal(t.go(ev("MOVE_DONE")), "sideEnd"); assert.deepEqual([t.pendingFuse, t.settled, fused, w.turn?.fuseDueMs, t.undo], [false, true, ["sideEnd"], null, null]);
  const calm = createWorld(src("stage-fixed")), b = begin(calm, 60000); walk(b.t, calm, "knight#1", 0, 7, "m1"); replayTicks(calm, 20);
  assert.equal(b.t.go(ev("MOVE_DONE")), "actMenu"); assert.deepEqual([b.fused, b.t.pendingFuse, calm.turn?.fuseDueMs], [[], false, 60000]);
  const mid = createWorld(src("stage-fixed")), m = begin(mid, 300); walk(m.t, mid, "knight#1", 0, 7, "m1", null); m.t.go(ev("MOVE_DONE")); m.t.go(ev("WAIT")); replayTicks(mid, 30);
  assert.deepEqual([mid.phases.battle, m.t.pendingFuse, [...m.fused], m.t.go(ev("UNIT_DONE", { next: "idle" })), m.fused], ["unitDone", true, [], "sideEnd", ["sideEnd"]]);
  const no = createWorld(src("stage-fixed")), n = begin(no, 300); walk(n.t, no, "knight#1", 0, 7, "m1", null); n.t.go(ev("MOVE_DONE"));
  assert.deepEqual([n.t.go(ev("SELECT_UNIT", { unitId: "archer#2" })), no.turn?.sel, n.t.undo?.at, n.t.go(ev("TAP_MOVE_CELL", { at: { c: 5, r: 5 } }))], ["actMenu", "knight#1", { c: 0, r: 8 }, "actMenu"]);
  n.t.go(ev("WAIT")); n.t.go(ev("UNIT_DONE", { next: "sideEnd" })); assert.deepEqual([no.phases.battle, n.t.go(ev("FUSE_EXPIRE")), n.t.pendingFuse, n.t.settled], ["sideEnd", "sideEnd", false, true]);
  const open = createWorld(src("stage-fixed")), c = begin(open, 50); c.t.go(ev("SELECT_UNIT", { unitId: "knight#1" })); replayTicks(open, 5); assert.deepEqual([open.phases.battle, c.fused, c.t.pendingFuse], ["sideEnd", ["sideEnd"], false]);
});

test("G4 R4 fuse during resolving waits through the victory check: UNIT_DONE to idle delivers it, to sideEnd or CHECK_END drops it", () => {
  const run = (tail: readonly Event[]): string => {
    const w = createWorld(src("stage-fixed")), { t, fused } = begin(w, 100); w.phases = { ...w.phases, battle: "resolving" }; replayTicks(w, 10);
    const seen = [t.pendingFuse ? "held" : "free"];
    for (const e of [ev("RESOLVE_DONE"), ...tail]) seen.push(`${t.go(e)}/${t.pendingFuse ? 1 : 0}`); seen.push(fused.join("+"));
    return seen.join(" ");
  };
  assert.equal(run([ev("CHECK_NONE", { next: "unitDone" }), ev("UNIT_DONE", { next: "idle" })]), "held victoryCheck/1 unitDone/1 sideEnd/0 sideEnd");
  assert.equal(run([ev("CHECK_NONE", { next: "unitDone" }), ev("UNIT_DONE", { next: "sideEnd" }), ev("SIDE_END"), ev("CHECK_NONE", { next: "sideStart" }), ev("SIDE_BEGIN"), ev("SELECT_UNIT", { unitId: "knight#1" })]), "held victoryCheck/1 unitDone/1 sideEnd/0 victoryCheck/0 sideStart/0 idle/0 unitSelected/0 ");
  assert.equal(run([ev("CHECK_END", { outcome: "win" })]), "held victoryCheck/1 play.result/0 ");
  const w = createWorld(src("stage-fixed")), { t, fused } = begin(w, 100); t.go(ev("END_TURN")); replayTicks(w, 20); assert.deepEqual([w.phases.battle, fused, w.turn?.fuseDueMs], ["sideEnd", [], null]);
  const off = createWorld(src("stage-fixed")), o = begin(off, "off"); assert.equal(off.turn?.fuseDueMs, null); replayTicks(off, 7000); assert.deepEqual([off.phases.battle, o.fused], ["idle", []]);
  for (const bad of [0, -1, 1.5, "60000", null]) assert.throws(() => createTurn(createWorld(src("stage-fixed")), { fuse: bad as number }), RangeError);
});

test("G4 R6 a save asked during moving or resolving waits for the next settled state; settled saves run at once; asks keep their order", () => {
  const w = createWorld(src("stage-fixed")), { t } = begin(w, 60000), got: string[] = [];
  assert.equal(t.save(meta, (s) => got.push(s)), true); assert.equal(got.length, 1);
  walk(t, w, "knight#1", 0, 7, "m1"); replayTicks(w, 5);
  assert.equal(t.save(meta, (s) => got.push(`a${s}`)), false); assert.equal(t.save(other, (s) => got.push(`b${s}`)), false); replayTicks(w, 15); assert.equal(got.length, 1);
  t.go(ev("MOVE_DONE")); assert.equal(got.length, 3); assert.deepEqual(got.slice(1).map((s) => s[0]), ["a", "b"]);
  const saved = JSON.parse(got[1]?.slice(1) ?? "{}") as { snapshot: { tick: number; phases: unknown }; header: { projectId: string } };
  assert.deepEqual([saved.snapshot.tick, saved.snapshot.phases, saved.header.projectId, (JSON.parse(got[2]?.slice(1) ?? "{}") as { header: { projectId: string } }).header.projectId], [w.clock.tick(), { battle: "actMenu" }, "p1", "p2"]);
  const r = createWorld(src("stage-fixed")), q = begin(r, 100), late: string[] = []; r.phases = { ...r.phases, battle: "resolving" }; replayTicks(r, 10);
  q.t.save(meta, (s) => late.push(JSON.parse(s).snapshot.phases.battle)); q.t.go(ev("RESOLVE_DONE")); q.t.go(ev("CHECK_NONE", { next: "unitDone" })); assert.deepEqual(late, []);
  q.t.go(ev("UNIT_DONE", { next: "idle" })); assert.deepEqual(late, ["sideEnd"]);
  assert.throws(() => t.save({ projectId: 5 } as never, () => {}), RangeError); const d = createWorld(src("stage-fixed")), e = begin(d, "off"), none: string[] = [];
  walk(e.t, d, "knight#1", 0, 7, "m1"); assert.throws(() => e.t.save(meta, 5 as never), RangeError); e.t.save(meta, (s) => none.push(s)); e.t.dispose(); e.t.go(ev("MOVE_DONE")); assert.deepEqual(none, []);
});

test("G4 R5 UNDO_MOVE after load: the undo cell is saved, the move back lands, and UNDO_MOVE goes to unitSelected with the same unit", () => {
  for (const [stage, from, to] of [["stage-fixed", "0,8", [0, 7]], ["stage-weighted", "0,11", [0, 10]]] as const) {
    const s = src(stage, true), w = createWorld(s), { t } = begin(w, 60000); walk(t, w, "knight#1", to[0], to[1], "m1");
    assert.deepEqual(t.undo, { unitId: "knight#1", at: { c: Number(from.split(",")[0]), r: Number(from.split(",")[1]) } }); replayTicks(w, 20); t.go(ev("MOVE_DONE"));
    let text = ""; assert.equal(t.save(meta, (x) => { text = x; }), true); const b = load(s, text), bt = createTurn(b, { fuse: 60000 });
    assert.deepEqual([b.phases.battle, bt.undo, shot(b) === shot(w), atOf(b, "knight#1")], ["actMenu", t.undo, true, `${to[0]},${to[1]}`]);
    const u = bt.undo; if (u === null) throw new Error("undo"); submit(b, move("u1", u.unitId, u.at.c, u.at.r, null)); assert.equal(bt.go(ev("UNDO_MOVE")), "unitSelected");
    assert.deepEqual([atOf(b, "knight#1"), bt.undo, b.turn?.sel], [from, null, "knight#1"]); bt.go(ev("TAP_MOVE_CELL", { at: { c: to[0], r: to[1] } })); assert.equal(bt.undo?.unitId, "knight#1");
  }
  const w = createWorld(src("stage-fixed")), { t } = begin(w, "off"); walk(t, w, "knight#1", 0, 7, "m1", null); t.go(ev("MOVE_DONE")); t.go(ev("WAIT")); assert.deepEqual([t.undo, w.phases.battle], [null, "unitDone"]);
  const c = createWorld(src("stage-fixed")), k = begin(c, "off"); k.t.go(ev("SELECT_UNIT", { unitId: "knight#1" })); k.t.go(ev("CANCEL")); assert.equal(c.turn?.sel, null); k.t.go(ev("SELECT_UNIT", { unitId: "archer#2" })); assert.equal(c.turn?.sel, "archer#2");
  k.t.go(ev("TAP_MOVE_CELL", { at: { c: 1, r: 7 } })); submit(c, move("m9", "archer#2", 1, 7, null)); k.t.go(ev("MOVE_DONE")); k.t.go(ev("CHOOSE_ACTION", { actionId: "rally", next: "targeting" }));
  assert.deepEqual([k.t.go(ev("CANCEL")), c.turn?.sel, k.t.undo], ["actMenu", "archer#2", null]);
});

test("G4 R5 saves carry turn only once a turn exists, and a tampered turn is refused", () => {
  const plain = createWorld(src("stage-fixed")); assert.equal("turn" in snapshot(plain), false);
  const w = createWorld(src("stage-fixed")), { t } = begin(w, 60000); walk(t, w, "knight#1", 0, 7, "m1"); replayTicks(w, 20); t.go(ev("MOVE_DONE"));
  assert.deepEqual(snapshot(w).turn, { sel: "knight#1", undo: { unitId: "knight#1", at: { c: 0, r: 8 } }, fuseDueMs: 60000 });
  const text = saveMatch(w, meta), patch = (fn: (turn: Record<string, unknown>) => void): string => { const o = JSON.parse(text); fn(o.snapshot.turn); return JSON.stringify(o); };
  for (const bad of [patch((x) => { x.sel = 5; }), patch((x) => { (x.undo as { at: { c: unknown } }).at.c = "0"; }), patch((x) => { x.fuseDueMs = 1.5; }), patch((x) => { (x.undo as { unitId: unknown }).unitId = 7; })]) assert.throws(() => loadSave(src("stage-fixed"), bad), /restore: snapshot does not match the log/);
  assert.equal(shot(load(src("stage-fixed"), patch((x) => { x.undo = null; x.sel = null; }))).includes('"turn":{"sel":null,"undo":null,"fuseDueMs":60000}'), true);
});

test("G4 R7 a running fuse fires at the same sim ms after load (fuse 30000 and 1235), saved in actMenu or idle", () => {
  for (const [fuse, walkFirst, waitTicks] of [[30000, true, 1234], [1235, false, 37], [1235, true, 50]] as const) {
    const s = src("stage-weighted"), w = createWorld(s), a = begin(w, fuse), due = w.clock.now() + fuse;
    if (walkFirst) { walk(a.t, w, "knight#1", 0, 10, "m1"); replayTicks(w, 20); a.t.go(ev("MOVE_DONE")); }
    replayTicks(w, waitTicks); let text = ""; a.t.save(meta, (x) => { text = x; });
    const b = load(s, text), fused: Phase[] = [], bt = createTurn(b, { fuse, onFuse: (to) => fused.push(to) }); assert.equal(b.turn?.fuseDueMs, due);
    const fireAt = (x: SimWorld, list: Phase[]): number => { while (list.length === 0 && x.clock.now() < due + 100) replayTicks(x, 1); return x.clock.now(); };
    assert.equal(fireAt(b, fused), fireAt(w, a.fused), `${fuse}`); assert.deepEqual([fused, b.phases.battle, shot(b) === shot(w)], [["sideEnd"], "sideEnd", true]); bt.dispose();
  }
});

test("G4 R2 overlays are host state: an open saveLoad or settings overlay is not saved, and load lands in overlay.none with the clock running", () => {
  const w = createWorld(src("stage-fixed")), { t } = begin(w, 60000);
  w.phases = { ...w.phases, overlay: "overlay.saveLoad", menu: "overlay.settings" }; w.clock.pause();
  let text = ""; t.save(meta, (x) => { text = x; }); assert.deepEqual(JSON.parse(text).snapshot.phases, { battle: "idle" });
  const b = load(src("stage-fixed"), text); assert.deepEqual([b.phases, b.clock.paused], [{ battle: "idle" }, false]);
  const odd = createWorld(src("stage-fixed")); odd.phases = { ...odd.phases, bonus: "idle" }; assert.deepEqual(snapshot(odd).phases, { battle: "play.loading", bonus: "idle" });
  const r = loadSave(src("stage-fixed"), saveMatch(odd, meta)); assert.equal(r.ok ? "ok" : r.code, "saveSnapshotPhasesInvalid");
});

type Step = (w: SimWorld, t: Turn) => void;
const go = (type: string, more: Record<string, unknown> = {}): Step => (_w, t) => { t.go(ev(type, more)); };
const ticks = (n: number): Step[] => Array.from({ length: n }, () => (w: SimWorld) => replayTicks(w, 1));
const back = (id: string): Step => (w, t) => { const u = t.undo; if (u !== null) submit(w, move(id, u.unitId, u.at.c, u.at.r, null)); t.go(ev("UNDO_MOVE")); };
const script = (row: number): Step[] => [
  ...START.map((e) => go(e.type)), go("SELECT_UNIT", { unitId: "knight#1" }), go("TAP_MOVE_CELL", { at: { c: 0, r: row - 1 } }), (w) => submit(w, move("m1", "knight#1", 0, row - 1, 200)), ...ticks(25), go("MOVE_DONE"), go("WAIT"), go("UNIT_DONE", { next: "idle" }),
  go("SELECT_UNIT", { unitId: "archer#2" }), go("TAP_MOVE_CELL", { at: { c: 1, r: row - 2 } }), (w) => submit(w, move("m2", "archer#2", 1, row - 2, 200)), ...ticks(25), go("MOVE_DONE"), back("m3"),
  go("TAP_MOVE_CELL", { at: { c: 1, r: row - 1 } }), (w) => submit(w, move("m4", "archer#2", 1, row - 1, null)), go("MOVE_DONE"), go("WAIT"), go("UNIT_DONE", { next: "sideEnd" }), go("SIDE_END"), go("CHECK_NONE", { next: "sideStart" }), go("SIDE_BEGIN"), ...ticks(40),
];

test("G4 R8 save, load, continue equals unbroken play at every step and tick (phase driver: both stages, levels on and off, fuse 60000 and 1230)", () => {
  for (const [stage, row, levels, fuse] of [["stage-fixed", 8, true, 60000], ["stage-weighted", 11, false, 1230], ["stage-weighted", 11, true, 60000]] as const) {
    const s = src(stage, levels), steps = script(row), a = createWorld(s), at = createTurn(a, { fuse }), want = steps.map((f) => { f(a, at); return shot(a); });
    for (const k of [4, 7, 9, 20, 40, 45, 60, 70]) {
      const b = createWorld(s), bt = createTurn(b, { fuse }); let text = "", from = -1;
      for (let i = 0; i < steps.length && from < 0; i += 1) { steps[i]?.(b, bt); if (i === k) bt.save(meta, (x) => { text = x; }); if (text !== "") from = i; }
      const c = load(s, text), ct = createTurn(c, { fuse }); assert.equal(shot(c), want[from], `${stage} ${k} at ${from}`);
      for (let i = from + 1; i < steps.length; i += 1) { steps[i]?.(c, ct); assert.equal(shot(c), want[i], `${stage} ${k} step ${i}`); }
    }
  }
});

test("G4 R8 save, load, continue equals unbroken play with moves in flight (tick driver: both stages, levels on)", () => {
  for (const [stage, row] of [["stage-fixed", 8], ["stage-weighted", 11]] as const) {
    const s = src(stage, true), plan = (w: SimWorld, i: number): void => { if (i === 0) submit(w, move("t1", "knight#1", 0, row - 1, 250)); if (i === 3) submit(w, move("t2", "archer#2", 1, row - 1, 70)); if (i === 30) submit(w, move("t3", "knight#1", 0, row - 2, 120)); replayTicks(w, 1); };
    const a = createWorld(s), want = Array.from({ length: 60 }, (_, i) => { plan(a, i); return shot(a); });
    for (const k of [1, 5, 24, 31, 40]) {
      const b = createWorld(s); for (let i = 0; i <= k; i += 1) plan(b, i);
      const c = load(s, saveMatch(b, meta)); for (let i = k + 1; i < 60; i += 1) { plan(c, i); assert.equal(shot(c), want[i], `${stage} ${k} tick ${i}`); }
    }
  }
});
