import assert from "node:assert/strict";
import { test } from "node:test";
import { PATH, isTravel, pathAt, pathDots, readPath, type FxPath } from "../../../src/runtime/render/fx-path.ts";
const a = { x: 8, y: 16 }, b = { x: 56, y: 16 }, T = 16;
const go = (o: Record<string, unknown>, ms = 600): FxPath => { const r = readPath({ kind: "straight", ...o }, 0, ms); assert.ok(r.path !== null); return r.path; };
const xy = (p: FxPath, t: number, to = b): [number, number] => { const s = pathAt(p, t, a, to, T, T); return [s.x, s.y]; };
test("E2 readPath: only straight/swerve/bounce/orbit travel; defaults bend 0.8, linear, orbit 1.05 × 1 turn; at and ms are the step's start and len", () => {
  assert.deepEqual(PATH.kinds, ["straight", "swerve", "bounce", "orbit"]); for (const k of ["trace", "row", "cone", "reel", "scratch", "stamp", "particles", "dim", "flash", undefined]) { assert.equal(isTravel(k), false); assert.deepEqual(readPath({ kind: k, bend: 9 }, 0, 300), { path: null, bad: [] }); }
  assert.deepEqual(readPath({ kind: "straight" }, 120, 480), { path: { kind: "straight", at: 120, ms: 480, bend: 0.8, ease: "linear" }, bad: [] });
  assert.deepEqual(readPath({ kind: "orbit" }, 0, 300).path, { kind: "orbit", at: 0, ms: 300, bend: 0.8, ease: "linear", radius: 1.05, turns: 1 });
  assert.deepEqual(readPath({ kind: "bounce" }, 0, 300).path, { kind: "bounce", at: 0, ms: 300, bend: 0.8, ease: "linear" });
});
test("E2 readPath: out-of-range values clamp with outOfRange, a bad type plays the default; bounce_points keep 8 (overCap once) and skip bad entries (invalidValue)", () => {
  const r = readPath({ kind: "orbit", bend: 3, look_ease: "fast-out", orbit_radius: 0.1, orbit_turns: "2" }, 0, 300);
  assert.deepEqual([r.path?.bend, r.path?.ease, r.path?.radius, r.path?.turns], [2.5, "linear", 0.45, 1]); assert.deepEqual(r.bad.map((x) => `${x.code}:${x.field}`), ["outOfRange:bend", "outOfRange:look_ease", "outOfRange:orbit_radius", "outOfRange:orbit_turns"]);
  assert.deepEqual(readPath({ kind: "swerve", bend: -2.6 }, 0, 300).path?.bend, -2.5); assert.deepEqual(readPath({ kind: "swerve", bend: Number.NaN }, 0, 300).bad, [{ code: "outOfRange", field: "bend" }]);
  const hops = Array.from({ length: 10 }, (_, i) => ({ dc: i, dr: 0 })), many = readPath({ kind: "bounce", bounce_points: [...hops.slice(0, 3), { dc: 1.5, dr: 0 }, null, ...hops.slice(3)] }, 0, 300);
  assert.deepEqual(many.path?.hops, hops.slice(0, 8)); assert.deepEqual(many.bad.map((x) => x.code), ["invalidValue", "invalidValue", "overCap"]);
  assert.deepEqual(readPath({ kind: "bounce", bounce_points: { dc: 1 } }, 0, 300), { path: { kind: "bounce", at: 0, ms: 300, bend: 0.8, ease: "linear", hops: [] }, bad: [{ code: "invalidValue", field: "bounce_points" }] });
});
test("E2 pathAt: every kind starts on the caster and lands on the target; before its start it waits, after len it holds on the target", () => {
  for (const kind of PATH.kinds) { const p = readPath({ kind, bounce_points: [{ dc: 1, dr: -2 }] }, 100, 500).path as FxPath; assert.deepEqual(xy(p, 0), [8, 16], kind); assert.deepEqual(xy(p, 100), [8, 16], kind); assert.deepEqual(xy(p, 600), [56, 16], kind); assert.deepEqual(xy(p, 5000), [56, 16], kind); }
  assert.deepEqual(xy(go({ bend: 0 }, 0), 0), [56, 16], "a zero-length path is already there");
});
test("E2 pathAt shapes: straight arcs by bend tiles at the middle (+ is up for a rightward throw), swerve is one S, eases out and in-out, bounce hops per leg by length, orbit corkscrews", () => {
  assert.deepEqual([xy(go({ bend: 1 }), 300), xy(go({ bend: -1 }), 300), xy(go({ bend: 0 }), 300)], [[32, 0], [32, 32], [32, 16]]);
  assert.deepEqual([xy(go({ kind: "swerve", bend: 1 }), 150), xy(go({ kind: "swerve", bend: 1 }), 300), xy(go({ kind: "swerve", bend: 1 }), 450)], [[20, 0], [32, 16], [44, 32]]);
  assert.deepEqual([xy(go({ bend: 0, look_ease: "out" }), 300), xy(go({ bend: 0, look_ease: "in-out" }), 150), xy(go({ bend: 0, look_ease: "in-out" }), 450)], [[44, 16], [14, 16], [50, 16]]);
  const hop = go({ kind: "bounce", bend: 1, bounce_points: [{ dc: 1, dr: 0 }] }); assert.deepEqual([xy(hop, 100), xy(hop, 200), xy(hop, 400)], [[16, 8], [24, 16], [40, 8]], "legs of 16 and 32 px take 1/3 and 2/3; each hops |bend|/2 tiles up");
  assert.deepEqual(xy(go({ kind: "bounce", bend: -1 }), 300), [32, 8], "a bounce always hops up");
  assert.deepEqual([xy(go({ kind: "orbit", orbit_radius: 1 }), 300), xy(go({ kind: "orbit", orbit_radius: 1, orbit_turns: 0.25 }), 300)], [[16, 16], [43, 27]]);
});
test("E2 pathAt heading: degrees along the path (0 = east, 90 = south, screen y down); null when it does not move; the same input gives the same output", () => {
  const flat = go({ bend: 0 }); assert.equal(pathAt(flat, 300, a, b, T, T).deg, 0); assert.equal(pathAt(flat, 300, a, { x: 8, y: 64 }, T, T).deg, 90); assert.equal(pathAt(flat, 9000, a, b, T, T).deg, 0, "holding keeps the last heading");
  assert.ok((pathAt(go({ bend: 1 }), 0, a, b, T, T).deg ?? 0) < -45, "an up-arc leaves climbing"); assert.ok((pathAt(go({ bend: 1 }), 600, a, b, T, T).deg ?? 0) > 45, "and lands falling");
  assert.equal(pathAt(go({ bend: 0 }), 300, a, a, T, T).deg, null); assert.deepEqual(pathAt(go({ kind: "orbit" }), 210, a, b, T, T), pathAt(go({ kind: "orbit" }), 210, a, b, T, T));
});
test("E2 pathDots (the designer's still path): n evenly timed points from caster to target, clamped to 2…32, NaN gives 2", () => {
  assert.deepEqual(pathDots(go({ bend: 0 }), 4, a, b, T, T), [{ x: 8, y: 16 }, { x: 24, y: 16 }, { x: 40, y: 16 }, { x: 56, y: 16 }]); assert.deepEqual(pathDots(go({ bend: 1 }), 3, a, b, T, T)[1], { x: 32, y: 0 });
  assert.deepEqual([pathDots(go({}), 1, a, b, T, T).length, pathDots(go({}), 100, a, b, T, T).length, pathDots(go({}), Number.NaN, a, b, T, T).length], [2, PATH.dots, 2]);
});
