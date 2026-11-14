import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDrawList, fitView, hitWhiteArg, snapCamera, type FxPiece, type LiveFx, type RenderScene, type SceneDot, type Sheet } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";

// QA G1 (step 33b-3 r1 review): plants Q8, Q11, Q19, Q20 and Q21 were missed by the shipped tests.
const unitSheet: Sheet = { id: "hero-sheet", columns: 4, fw: 16, fh: 16 }, spark: Sheet = { id: "spark", columns: 1, fw: 8, fh: 8 }, fit = fitView(390, 844, 2, 16, 16), cam = snapCamera(0, 0, 2);
const hero = { sheet: unitSheet, clips: [{ name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }] }, { name: "idle-down", frames: [4, 5], ms: [40, 40] }] };
const dots: FxPiece = { at: 0, ms: 600, sheet: spark, kind: "particles", particle_count: 48, particle_life_ms: 600 };
const fx = (over: Partial<LiveFx> = {}): LiveFx => ({ id: "e1", castMs: 1000, caster: "a", target: "b", pieces: [], ...over });
const world = (effects: LiveFx[]): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero }, layers: [], units: [{ id: "a", sprite: "hero", at: { c: 2, r: 2 }, offset: null, facing: "E", alive: true, action: "atk" }, { id: "b", sprite: "hero", at: { c: 5, r: 2 }, offset: null, facing: "W", alive: true, action: "idle" }], objects: [], overlays: [], effects, style: { ramps: { r: ["#ff0000"], g: ["#00ff00"], b: ["#0000ff"] } } });
const at = (w: SceneWorld, t: number): RenderScene => createSceneLink().scene(w, { tMs: t, stepMs: 10 });
const tally = (s: RenderScene): Record<string, number> => (s.dots ?? []).reduce<Record<string, number>>((m, d) => ({ ...m, [d.colour]: (m[d.colour] ?? 0) + 1 }), {});

test("QA 33b-3: a tint hit-white with no or a bad impact_colour paints #ffb048; a squashed unit keeps its squash and drops the recolour (Ruling 10)", () => {
  assert.deepEqual([hitWhiteArg({ hit_white_ms: 60, hit_white_mode: "tint" }, 1300, 1320, undefined), hitWhiteArg({ hit_white_ms: 60, hit_white_mode: "tint", impact_colour: "red" }, 1300, 1320, undefined)], ["#ffb048", "#ffb048"]);
  const sheets = buildDrawList(at(world([fx({ squash: true, hit_white_ms: 60 })]), 1320), fit, cam, 1320, 10).cmds.map((c) => c.sheet);
  assert.deepEqual([sheets.some((s) => s.startsWith("hero-sheet~sq")), sheets.some((s) => s.includes("~hw:"))], [true, false]);
});

test("QA 33b-3: pool ties drop the earlier effect; unit-layer particles draw in fxAir; the 300 cut takes the newest rects first (Rulings 6 and 7)", () => {
  const same = at(world([fx({ id: "e1", tint_ramp: "r", pieces: [dots] }), fx({ id: "e2", tint_ramp: "g", pieces: [dots] }), fx({ id: "e3", tint_ramp: "b", pieces: [dots] })]), 1250);
  const unitLayer = at(world([fx({ pieces: [{ ...dots, draw_layer: "front-unit", anchor: "caster", anchor_point: "centre" }] })]), 1250).dots ?? [];
  const flood = (band: SceneDot["band"], colour: string, row: number): SceneDot[] => Array.from({ length: 200 }, (_, i) => ({ band, x: i % 100, y: row + Math.floor(i / 100), size: 1, colour, alpha: 1 }));
  const cut = buildDrawList({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, ground: [], above: [], standing: [], overlays: [], dots: [...flood("fxAir", "#ff0000", 0), ...flood("flash", "#0000ff", 4)] }, fit, cam, 0, 10).cmds;
  assert.deepEqual([tally(same), unitLayer.length, unitLayer.every((d) => d.band === "fxAir"), cut.map((c) => `${c.colour ?? ""}:${(c.rects?.length ?? 0) / 4}`), cut[1]?.rects?.slice(0, 2)], [{ "#00ff00": 48, "#0000ff": 48 }, 48, true, ["#ff0000:200", "#0000ff:100"], [0, 8]]);
});
