import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDrawList, createLighting, fitView, lightRadius, present, rampOf, snapCamera, type DrawCmd, type FxPiece, type Renderer, type Sheet, type Standing } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";

// QA G1 (step 33b-2 A/B, build B): the day path, the pass marks, the overlap walk, the cap, the shared empty set, plan colours, Rulings 1 and 4.
const spark: Sheet = { id: "spark", columns: 1, fw: 8, fh: 8 }, fit = fitView(160, 128, 1, 16, 16), cam = snapCamera(0, 0, 1), lw = { cols: 10, rows: 8, tileW: 16, tileH: 16, blocks: new Uint8Array(80) };
const hero = { sheet: { id: "hero", columns: 4, fw: 16, fh: 16 }, clips: [{ name: "idle-down", frames: [0, 1], ms: [40, 40] }] };
const world = (pieces: FxPiece[], units = ["a", "b"]): SceneWorld => ({ cols: 10, rows: 8, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero }, layers: [], units: units.map((id, i) => ({ id, sprite: "hero", at: { c: 2 + 3 * i, r: 2 }, offset: null, facing: "S" as const, alive: true, action: "idle" })), objects: [], overlays: [], effects: [{ id: "e1", castMs: 1000, caster: "a", target: "b", pieces }] });
const scene = (standing: Standing[], overlays: { band: "fxAir" | "glow" | "flash"; selfLit?: boolean }[] = []) => ({ cols: 10, rows: 8, tileW: 16, tileH: 16, mapSeed: 1, ground: [], above: [], standing, overlays: overlays.map((o, i) => ({ ...o, sheet: { ...spark, id: `o${i}` }, x: 8 + 16 * i, y: 8 })) });

test("QA 33b-2 A/B: by day present draws every command in order, self-lit ones included; flash and glow overlays take the night pass, a lit: scene fxFront doesn't, and a unit two commands later still keeps a covered piece in its slot", () => {
  const log: string[] = [], rec = { beginFrame: () => undefined, endFrame: () => undefined, drawImage: (sheet: string) => { log.push(sheet); } } as unknown as Renderer, c = (sheet: string, selfLit = false): DrawCmd => ({ band: "base", sheet, sx: 0, sy: 0, sw: 8, sh: 8, dx: 0, dy: 0, dw: 8, dh: 8, op: "normal", flipX: false, ...(selfLit ? { selfLit } : {}) });
  present(rec, fit, { dueMs: Infinity, cmds: [c("ground"), c("air", true), c("unit")] }, "#000000");
  const marks = buildDrawList(scene([{ kind: "fxFront", sheet: spark, c: 6, r: 5, sceneLit: true }], [{ band: "flash", selfLit: true }, { band: "glow", selfLit: true }]), fit, cam, 0, 10).cmds.map((d) => `${d.sheet}${d.selfLit === true ? "*" : ""}`);
  const covered = buildDrawList(scene([{ kind: "fxFront", sheet: spark, c: 1, r: 1 }, { kind: "object", sheet: { ...spark, id: "rock" }, c: 4, r: 1 }, { kind: "unit", sheet: { id: "tall", columns: 1, fw: 16, fh: 32 }, c: 1, r: 2 }]), fit, cam, 0, 10).cmds.map((d) => `${d.sheet}${d.selfLit === true ? "*" : ""}`);
  assert.deepEqual([log, marks, covered], [["ground", "air", "unit"], ["spark", "o1*", "o0*"], ["spark", "rock", "tall"]]);
});

test("QA 33b-2 A/B: a lit step whose anchor is missing still counts toward the 2 per effect; with no effect light (or no clock) every frame shares one empty set, also after a light ends, so the plan is cached", () => {
  const lit = (anchor: "caster" | "target", extra: Partial<FxPiece> = {}): FxPiece => ({ at: 0, ms: 400, sheet: spark, anchor, light_mode: "steady", ...extra }), capped = createSceneLink();
  capped.scene(world([lit("target"), lit("caster"), lit("caster", { anchor_point: "head" })], ["a"]), { tMs: 1020, stepMs: 10 });
  const link = createSceneLink(), L = createLighting(), dark = world([{ at: 0, ms: 400, sheet: spark, anchor: "caster" }]), sets = new Set<object>(), bare = new Set<object>(), torches = [{ x: 40, y: 40, radius: 40 }];
  for (const t of [1020, 1050, 1080, 1250]) { link.scene(dark, { tMs: t, stepMs: 10 }); sets.add(link.lit); L.plan(lw, torches, 0.5, 0, 4, link.lit); }
  for (let i = 0; i < 3; i += 1) { link.scene(dark); bare.add(link.lit); L.plan(lw, torches, 0.5, 0, 4, link.lit); }
  const once = createSceneLink(), ends = world([lit("caster", { ms: 100 })]), seen = [990, 1020, 1250].map((t) => { once.scene(ends, { tMs: t, stepMs: 10 }); return once.lit; }); // empty, lit, empty again
  assert.deepEqual([capped.lit.lights.length, capped.notices.some((n) => n.code === "fxLightsOverCap"), sets.size, bare.size, L.stats.plans, seen[1]?.lights.length, seen[0] === seen[2]], [1, true, 1, 1, 2, 1, true]); // one plan per mode
});

test("QA 33b-2 A/B: each plan cell keeps its brightest light's colour and a repeated colour keeps one index; light_radius outside 0.5–6 is flagged; a key after the winning ramp is never reported; an empty ramp counts as absent and falls to the next key", () => {
  const plan = createLighting().plan(lw, [{ x: 40, y: 40, radius: 48, colour: "#ff0000" }, { x: 40, y: 40, radius: 24, colour: "#00ff00" }, { x: 120, y: 40, radius: 16, colour: "#ff0000" }], 0.5, 0, 4), cell = 10 * plan.w + 13; // 12 px right of both centres: red level 5, green level 3
  assert.deepEqual([plan.colours, plan.colours?.[(plan.tint?.[cell] ?? 0) - 1], [0.3, 6.2, 0.5, 6].map((v) => lightRadius(v).bad), rampOf(["a", "nope"], { a: ["#102030"] }), rampOf(["e", "b"], { e: [], b: ["#405060"] })], [["255,0,0", "0,255,0"], "255,0,0", [true, true, false, false], { ramp: ["#102030"], missing: [] }, { ramp: ["#405060"], missing: ["e"] }]);
});
