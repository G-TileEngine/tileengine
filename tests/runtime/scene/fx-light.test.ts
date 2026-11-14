import assert from "node:assert/strict";
import { test } from "node:test";
import { canvas2d } from "../../../src/runtime/canvas/canvas2d.ts";
import * as render from "../../../src/runtime/render/index.ts";
import { FX_LIGHT, brightPixels, createFxLive, createLighting, cuesSuppressed, fitView, hitWhiteMode, lightColour, lightMode, lightOps, lightRadius, litTiles, buildDrawList, popFlashStarts, popIsFlash, present, rampOf, snapCamera, snapToRamp, type Clip, type DrawCmd, type FxLit, type FxPiece, type LiveFx, type Sheet } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneClock, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { FakeCanvas, type Raster } from "../canvas/fake-canvas.ts";
import { PERF, budgetRig, judge } from "../../perf/fx-light-budget.ts";

const ramps = { bloom: ["#402040", "#a04080", "#ffc0e0"], water: ["#102040", "#2060a0", "#60c0f0", "#e0f8ff"] };
const unitSheet: Sheet = { id: "hero-sheet", columns: 4, fw: 16, fh: 16 }, spark: Sheet = { id: "spark", columns: 1, fw: 8, fh: 8 };
const atk: Clip = { name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }] }, idle: Clip = { name: "idle-down", frames: [4, 5], ms: [40, 40] };
const hero: SceneAsset = { sheet: unitSheet, clips: [atk, idle] };
const pop: FxPiece = { at: 0, ms: 300, sheet: spark, anchor: "target", light_mode: "pop", light_radius: 3, light_ramp: "bloom" }; // the pop window is 1000-1300 (start = cast)
const fx = (over: Partial<LiveFx> = {}): LiveFx => ({ id: "e1", castMs: 1000, caster: "a", target: "b", pieces: [pop], ...over }); // hit = contact = 1300
const world = (effects: LiveFx[], over: Partial<SceneWorld> = {}): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero }, layers: [], units: [{ id: "a", sprite: "hero", at: { c: 2, r: 2 }, offset: null, facing: "E", alive: true, action: "atk" }, { id: "b", sprite: "hero", at: { c: 5, r: 2 }, offset: null, facing: "W", alive: true, action: "idle" }], objects: [], overlays: [], effects, style: { ramps }, ...over });
const lit = (w: SceneWorld, t: number, over: Partial<SceneClock> = {}, link = createSceneLink()): FxLit => { link.scene(w, { tMs: t, stepMs: 10, ...over }); return link.lit; };
const radii = (l: FxLit): number[] => l.lights.map((x) => x.radius);
const grid = { cols: 8, rows: 8, tileW: 16, tileH: 16, blocks: new Uint8Array(64) }, torch = { x: 40, y: 40, radius: 32 }, torch3 = [torch], own = { x: 88, y: 88, radius: 48, colour: "#ffc0e0", keepInDim: true };

test("ramp colour: the step's ramp beats the effect's, a missing key is reported (fxRampMissing) and plays as absent, the light is the ramp's lightest step else #ffb048; tint_snap ramp snaps to the nearest step (every ramp with no tint_ramp), rgb or absent keeps the colour; bright moves 2 steps up its own ramp, off-ramp pixels go white; no render export is a tint mode (step 33b-2)", () => {
  assert.deepEqual(rampOf(["water", "bloom"], ramps), { ramp: ramps.water, missing: [] }); assert.deepEqual(rampOf(["nope", "bloom"], ramps), { ramp: ramps.bloom, missing: ["nope"] }); assert.deepEqual(rampOf([undefined, "x"], undefined), { ramp: null, missing: ["x"] });
  assert.deepEqual([lightColour({ at: 0, light_ramp: "water", tint_ramp: "bloom" }, "bloom", ramps).colour, lightColour({ at: 0, tint_ramp: "bloom" }, "water", ramps).colour, lightColour({ at: 0 }, "water", ramps).colour, lightColour({ at: 0, light_ramp: "nope" }, undefined, ramps)], ["#e0f8ff", "#ffc0e0", "#e0f8ff", { colour: "#ffb048", missing: ["nope"] }]);
  assert.deepEqual([snapToRamp("#a050a0", { at: 0, tint_snap: "ramp", tint_ramp: "bloom" }, undefined, ramps), snapToRamp("#a050a0", { at: 0, tint_snap: "ramp" }, "water", ramps), snapToRamp("#1a2a3a", { at: 0, tint_snap: "ramp" }, undefined, ramps), snapToRamp("#a050a0", { at: 0, tint_snap: "rgb", tint_ramp: "bloom" }, undefined, ramps), snapToRamp("#a050a0", { at: 0, tint_ramp: "bloom" }, undefined, ramps)], ["#a04080", "#2060a0", "#102040", "#a050a0", "#a050a0"]);
  const img = { w: 4, h: 1, data: new Uint8ClampedArray([0x10, 0x20, 0x40, 255, 0x60, 0xc0, 0xf0, 128, 0x40, 0x20, 0x40, 255, 1, 2, 3, 0]) }, out = brightPixels(img, ramps);
  assert.deepEqual([...out.data], [0x60, 0xc0, 0xf0, 255, 0xe0, 0xf8, 0xff, 128, 0xff, 0xc0, 0xe0, 255, 1, 2, 3, 0]); assert.deepEqual([...img.data].slice(0, 4), [0x10, 0x20, 0x40, 255]); // the source is never changed
  assert.deepEqual([...brightPixels({ w: 1, h: 1, data: new Uint8ClampedArray([9, 9, 9, 255]) }, ramps).data], [255, 255, 255, 255]);
  assert.deepEqual([hitWhiteMode("bright"), hitWhiteMode("tint"), hitWhiteMode("glow"), hitWhiteMode(undefined), cuesSuppressed(40), cuesSuppressed(0), cuesSuppressed("40")], ["bright", "tint", "white", "white", true, false, false]);
  assert.equal(Object.keys(render).some((name) => /tint/i.test(name)), false);
});

test("light rules: light_mode off/steady/pop (the draft light is an alias, light_mode wins), light_radius 0.5-6 tiles on half steps (absent 2, clamped and flagged); a pop steps R, ceil(2R/3), ceil(R/3) in half tiles over thirds of its step, then 0; steady holds R (step 33b-2)", () => {
  assert.deepEqual([lightMode({ at: 0 }), lightMode({ at: 0, light: "pop" }), lightMode({ at: 0, light: "pop", light_mode: "steady" }), lightMode({ at: 0, light_mode: "glow" })], ["off", "pop", "steady", "off"]);
  assert.deepEqual([undefined, 2.5, 2.3, 0.2, 9, -1, "3", Number.NaN].map(lightRadius), [{ tiles: 2, bad: false }, { tiles: 2.5, bad: false }, { tiles: 2.5, bad: false }, { tiles: 0.5, bad: true }, { tiles: 6, bad: true }, { tiles: 0.5, bad: true }, { tiles: 2, bad: true }, { tiles: 2, bad: true }]);
  assert.deepEqual([999, 1000, 1099, 1100, 1200, 1299, 1300].map((t) => litTiles("pop", 3, t, 1000, 300)), [0, 3, 3, 2, 1, 1, 0]);
  assert.deepEqual([[2, 1000], [2, 1100], [2, 1200], [0.5, 1200], [3, 1100]].map(([r, t]) => litTiles(r === 3 ? "steady" : "pop", r ?? 0, t ?? 0, 1000, 300)), [2, 1.5, 1, 0.5, 3]);
  assert.equal(litTiles("off", 3, 1000, 1000, 300), 0);
});

test("live effect lights: a lit step lights its piece's centre (tiles x tileW, the lightest ramp step, keepInDim), the pop freezes in hit-stop, self-lit pieces are marked for the pass above the darkness and lit scene pieces aren't; 2 lit steps per effect (fxLightsOverCap), 4 on screen, lite gives one steady light; a missing ramp warns once (step 33b-2)", () => {
  assert.deepEqual(lit(world([fx()]), 1020), { lights: [{ x: 88, y: 44, radius: 48, colour: "#ffc0e0", keepInDim: true }] });
  assert.deepEqual([1140, 1260, 1320, 990].map((t) => radii(lit(world([fx()]), t))), [[32], [16], [], []]);
  const late: FxPiece = { ...pop, at: 300, ms: 120 }; // 1300-1420, thirds of 40 ms
  assert.deepEqual([radii(lit(world([fx({ pieces: [late], hit_stop_ms: 100 })]), 1380)), radii(lit(world([fx({ pieces: [late] })]), 1380))], [[48], [16]]); // held at its hitAt pose
  const head: FxPiece = { ...pop, draw_layer: "front-unit", anchor_point: "head" }, marks = (pieces: FxPiece[]): (boolean | undefined)[] => { const sc = createSceneLink().scene(world([fx({ pieces })]), { tMs: 1020, stepMs: 10 }); return [...sc.overlays, ...sc.standing].filter((o) => o.sheet.id === "spark").map((o) => ("kind" in o ? o.sceneLit !== true : o.selfLit === true)); };
  assert.deepEqual([marks([{ ...pop, lit: "scene" }, { ...head, lit: "scene" }]), marks([head]), marks([pop]), lit(world([fx({ pieces: [head] })]), 1020).lights.map((l) => [l.x, l.y])], [[false, false], [true], [true], [[88, 28]]]); // a unit-layer piece's light sits where the draw list draws it
  assert.deepEqual(lit(world([fx({ pieces: [{ ...pop, light_mode: "off" }] })]), 1020), { lights: [] });
  const link = createSceneLink(), three = fx({ pieces: [pop, { ...pop, light_radius: 2 }, { ...pop, light_radius: 1 }] });
  assert.deepEqual(radii(lit(world([three]), 1020, {}, link)), [48, 32]); link.scene(world([three])); assert.deepEqual(link.lit, { lights: [] }); // no clock, no light
  assert.deepEqual(link.notices.filter((n) => n.code === "fxLightsOverCap"), [{ code: "fxLightsOverCap", message: "e1" }]);
  const two = (id: string): LiveFx => fx({ id, pieces: [pop, { ...pop, light_radius: 2 }] });
  assert.deepEqual(radii(lit(world([two("e1"), two("e2"), two("e3")]), 1020)), [48, 32, 48, 32]);
  assert.deepEqual(radii(lit(world([two("e1")]), 1260, { lite: true })), [48]); // lite: one light per effect, steady
  const miss = createSceneLink(); for (const t of [1020, 1140]) lit(world([fx({ pieces: [{ ...pop, light_ramp: "nope", light_radius: 9 }], tint_ramp: "water" })]), t, {}, miss);
  assert.deepEqual(miss.lit.lights.map((l) => l.colour), ["#e0f8ff"]); assert.deepEqual(miss.notices.filter((n) => n.code === "fxRampMissing" || n.message === "light_radius").map((n) => [n.code, n.message]), [["outOfRange", "light_radius"], ["fxRampMissing", "e1"]]);
});

test("re-plans: the light set is re-planned at most every 100 ms (10 Hz) and a pop re-plans at most 5 times over its life (0, R, 2R/3, R/3, 0); no effect leaves one shared empty set (step 33b-2)", () => {
  const link = createSceneLink(), w = world([fx()]), seen: FxLit[] = [];
  for (const t of [1020, 1080, 1110, 1140]) { link.scene(w, { tMs: t, stepMs: 10 }); seen.push(link.lit); }
  assert.deepEqual(seen.map(radii), [[48], [48], [48], [32]]); assert.equal(seen[2], seen[0]); // the 1110 change waits for 1120
  const L = createLighting(), again = createSceneLink(), sets: FxLit[] = [];
  for (let t = 900; t <= 1500; t += 10) { again.scene(w, { tMs: t, stepMs: 10 }); if (sets[sets.length - 1] !== again.lit) sets.push(again.lit); L.plan(grid, torch3, 0.5, 0, 4, again.lit); }
  assert.deepEqual([L.stats.plans, sets.map(radii)], [5, [[], [48], [32], [16], []]]);
  const edge = createSceneLink(); assert.deepEqual([1020, 1120].map((t) => radii(lit(w, t, {}, edge))), [[48], [32]]); assert.equal(lit(world([]), 1020), lit(world([]), 2020)); // the gate opens at exactly 100 ms
  const live = createFxLive(), g = { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 3 }, one: LiveFx[] = [{ id: "e1", castMs: 1000, caster: "x", at: { c: 5, r: 2 }, pieces: [pop] }];
  assert.deepEqual([live.frame(one, () => null, 1010, 1020, g).dueMs, live.frame(one, () => null, 1020, 1110, g).dueMs], [1050, 1120]); // a held change is due when the gate opens
});

test("light plan: effect lights keep their radius in the stage dim while torches halve, the ability's fully-dark option puts out torches only, each cell glows in its brightest light's colour in stepped bands (never a blur), and with no effect light the plan is unchanged (step 33b-2)", () => {
  const L = createLighting(), fxl: FxLit = { lights: [own] }, dimmed = L.plan(grid, torch3, 0, 0.55, 4, fxl), half = createLighting().plan(grid, [{ ...torch, radius: 16 }], 0, 0, 4, fxl);
  assert.deepEqual(dimmed.level, half.level); assert.deepEqual(createLighting().plan(grid, [torch], 0, 0.55, 4, fxl, true).level, createLighting().plan(grid, [], 0, 0, 4, fxl).level);
  assert.deepEqual(createLighting().plan(grid, [torch], 0, 0, 4, fxl, true).level, createLighting().plan(grid, [torch], 0, 0, 4, fxl).level); // fully dark only acts in the dim
  assert.equal(L.plan(grid, torch3, 0, 0.55, 4, fxl), dimmed); assert.notEqual(L.plan(grid, torch3, 0, 0.55, 4, { lights: [own] }), dimmed); assert.notEqual(L.plan(grid, torch3, 0, 0.55, 4, fxl, true), L.plan(grid, torch3, 0, 0.55, 4, fxl)); // a new effect set or dark option re-plans
  const both = createLighting().plan(grid, [torch], 0.5, 0, 4, fxl), at = (x: number, y: number): number => both.tint?.[Math.floor(y / 4) * both.w + Math.floor(x / 4)] ?? -1;
  assert.deepEqual([both.colours, at(88, 88), at(40, 40)], [["255,192,224"], 1, 0]);
  const fit = fitView(128, 128, 1, 16, 16), glows = lightOps(both, fit, snapCamera(0, 0, 1)).filter((op) => op.op === "add");
  assert.ok(glows.some((op) => op.colour.startsWith("rgba(255,192,224,")) && glows.some((op) => op.colour.startsWith("rgba(255,176,72,")));
  assert.deepEqual([...new Set(glows.map((op) => op.colour.split(",").pop()))].sort(), ["0.0625)", "0.125)", "0.1875)"]);
  assert.deepEqual(Object.keys(createLighting().plan(grid, [torch], 0.5, 0, 4)), ["res", "w", "h", "dark", "level"]);
  const fills = new Set<string>(), r = canvas2d(new FakeCanvas(), { images: () => undefined, makeCanvas: (w, h) => { const c = new FakeCanvas(); c.width = w; c.height = h; const g = c.getContext("2d"); if (g !== null) { const f = g.fillRect.bind(g); g.fillRect = (...a: [number, number, number, number]) => { fills.add(String(g.fillStyle)); f(...a); }; } return c; } });
  r.beginFrame(fit, "#000000"); r.lights(both, fit, snapCamera(0, 0, 1)); r.endFrame(); assert.ok([...fills].some((c) => c.startsWith("rgba(255,192,224,")) && [...fills].some((c) => c.startsWith("rgba(255,176,72,")));
});

test("te-flash@3 pop rule: a pop step is one flash start at its pop when pi(R*T)^2/(390*844) >= 25% (3 tiles at 64 px, not 2.5); steady lights never count; under reduce flashes a pop that counts plays as steady (step 33b-2)", () => {
  assert.deepEqual([popIsFlash(2.5, 64), popIsFlash(3, 64), popIsFlash(6, 32), popIsFlash(5, 32)], [false, true, true, false]);
  assert.deepEqual(popFlashStarts([{ at: 0, light_mode: "pop", light_radius: 3 }, { at: 100, light_mode: "steady", light_radius: 6 }, { at: 200, light: "pop", light_radius: 6 }, { at: 300, light_mode: "pop" }], 64, 1000), [1000, 1200]);
  assert.equal(FX_LIGHT.flashShare, 0.25); const small: FxPiece = { ...pop, light_radius: 2.5 };
  assert.deepEqual([1140, 1260].flatMap((t) => [radii(lit(world([fx()]), t, { reduceFlashes: true })), radii(lit(world([fx()]), t)), radii(lit(world([fx({ pieces: [small] })]), t, { reduceFlashes: true }))]), [[48], [32], [32], [48], [16], [16]]); // 3 tiles counts at 64 px and plays steady; 2.5 still pops
});

test("budget: on a 128x128 map at res 4 with 16 torches and 40 effects whose self-lit pieces move every frame, moving pieces never re-plan or rebuild the light canvases and the lights stay capped at 4; the 4 ms p95 is judged on every lap, run alone (tests/perf/fx-light-budget.ts, never in npm test) (step 33b-2)", () => {
  const rig = budgetRig(), lap = (slow: number, v = 5): number[] => Array.from({ length: 100 }, (_, i) => (i >= 100 - slow ? v : 1));
  for (let n = 0, t = 0; t <= 3000; n += 1, t += 16) rig.frame(n, t);
  assert.deepEqual(rig.counts(), [1, 1, 0, 4]); // 1 plan, 1 light-canvas build, 0 light fills after the first frame, 4 lights
  assert.deepEqual([PERF, judge([lap(4), lap(0)]).ok, judge([lap(0), lap(5)]).ok, judge([lap(5)]).p95, judge([lap(100, 4)]).ok, judge([]).ok], [{ limitMs: 4, laps: 3, lapMs: 3000, frameMs: 16 }, true, false, [5], true, false]);
});

test("self-lit pass: a moving self-lit piece draws at full colour above the night darkness where it's drawn on every frame, the spot it left is dark, the light set keeps its 10 Hz gate, and moving pieces never re-plan or rebuild the light canvases (step 33b-2)", () => {
  const lamp: FxPiece = { ...pop, light_mode: "steady", anchor: "caster" }, mover: FxPiece = { ...pop, attach: "follow", light_mode: "off" }, link = createSceneLink(), L = createLighting(), view = new FakeCanvas();
  const at = (c: number): SceneWorld => { const w = world([fx({ pieces: [lamp, mover] })]); return { ...w, units: w.units.map((u) => (u.id === "b" ? { ...u, at: { c, r: 2 } } : u)) }; };
  const r = canvas2d(view, { images: (id) => (id === "spark" ? { w: 8, h: 8, px: new Uint32Array(64).fill(0xffffc0e0) } : undefined), makeCanvas: (w, h) => { const c = new FakeCanvas(); c.width = w; c.height = h; return c; } }), fit = fitView(160, 96, 1, 16, 16), cam = snapCamera(0, 0, 1);
  let last: { dx: number; dy: number } | undefined; const pixel = (p?: { dx: number; dy: number }): number | undefined => (p === undefined ? 0xff000000 : view.px[(p.dy + 2) * 160 + p.dx + 2]);
  for (const [t, c] of [[1020, 4], [1040, 5], [1060, 6], [1130, 7]] as const) {
    const list = buildDrawList(link.scene(at(c), { tMs: t, stepMs: 10 }), fit, cam, t, 10), plan = L.plan(grid, torch3, 0.5, 0, 4, link.lit), piece = list.cmds.find((d) => d.sheet === "spark" && d.dx > 60);
    const n = view.log.length; present(r, fit, list, "#204060", () => { r.lights(plan, fit, cam); });
    assert.deepEqual([view.log.length - n, list.cmds.filter((d) => d.selfLit === true).map((d) => d.sheet), pixel(piece), pixel(last), link.lit.lights.map((l) => l.x), L.stats.plans, r.stats.lightBuilds], [4, ["spark", "spark"], 0xffffc0e0, 0xff000000, [40], 1, 1]); last = piece; // only the 2 effect pieces are self-lit (not units); 4 draws: each piece once, darkness, glow; the old spot is dark again
  }
});

test("the HUD never darkens: the night darkness is drawn under the ui band, so a ui pixel is the same at night as by day and the world under it is dark; by day nothing moves (step 33b-2)", () => {
  const bank = new Map<string, Raster>([["g", { w: 16, h: 16, px: new Uint32Array(256).fill(0xff2080c0) }], ["hud", { w: 8, h: 8, px: new Uint32Array(64).fill(0xff0000f0) }]]), view = new FakeCanvas();
  const r = canvas2d(view, { images: (id) => bank.get(id), makeCanvas: (w, h) => { const c = new FakeCanvas(); c.width = w; c.height = h; return c; } }), fit = fitView(64, 64, 1, 16, 16), cam = snapCamera(0, 0, 1);
  const cmd = (band: DrawCmd["band"], sheet: string, size: number, d: number): DrawCmd => ({ band, sheet, sx: 0, sy: 0, sw: size, sh: size, dx: d, dy: d, dw: size, dh: size, op: "normal", flipX: false }), list = { dueMs: Infinity, cmds: [cmd("base", "g", 16, 0), cmd("ui", "hud", 8, 4)] };
  const night = { res: 4, w: 16, h: 16, dark: new Uint8Array(256).fill(20), level: new Uint8Array(256) }, ui = 6 * 64 + 6, ground = 14 * 64 + 14;
  present(r, fit, list, "#000000"); const day = [view.px[ui], view.px[ground]]; present(r, fit, list, "#000000", () => { r.lights(night, fit, cam); });
  assert.deepEqual([view.px[ui], day[0], view.px[ground] !== day[1]], [0xff0000f0, 0xff0000f0, true]);
  present(r, fit, { dueMs: Infinity, cmds: list.cmds.slice(0, 1) }, "#000000", () => { r.lights(night, fit, cam); }); assert.notEqual(view.px[ground], day[1]); // no ui band: the darkness still draws last
  const own = { ...cmd("fxAir", "hud", 8, 40), selfLit: true }; present(r, fit, { dueMs: Infinity, cmds: [own, cmd("flash", "g", 16, 36)] }, "#000000"); assert.equal(view.px[42 * 64 + 42], 0xff2080c0); // by day a self-lit piece keeps its place in the list
});

test("self-lit depth at night: a self-lit fxBehind, fxGround or face-swapped fxFront piece under a unit keeps its depth slot and never draws over the unit's pixels, while self-lit fxFront pieces, even overlapping each other, still draw at full colour above the darkness (step 33b-2, seam 23)", () => {
  const away = (w: SceneWorld): SceneWorld => ({ ...w, units: w.units.map((u) => (u.id === "b" ? { ...u, facing: "N" as const } : u)) }), off: FxPiece = { ...pop, light_mode: "off", anchor_point: "foot" }, sc = createSceneLink().scene(away(world([fx({ pieces: [{ ...off, draw_layer: "behind-unit" }, { ...off, draw_layer: "ground" }, { ...off, draw_layer: "front-unit" }, { ...off, draw_layer: "front-unit", anchor: "caster", anchor_point: "head" }, { ...off, draw_layer: "front-unit", anchor: "caster", anchor_point: "head", ms: 299 }] })])), { tMs: 1020, stepMs: 10 }), view = new FakeCanvas(), L = createLighting();
  const r = canvas2d(view, { images: (id) => (id === "spark" ? { w: 8, h: 8, px: new Uint32Array(64).fill(0xffffc0e0) } : id === "hero-sheet" ? { w: 64, h: 32, px: new Uint32Array(2048).fill(0xff3060a0) } : undefined), makeCanvas: (w, h) => { const c = new FakeCanvas(); c.width = w; c.height = h; return c; } }), fit = fitView(160, 96, 1, 16, 16), cam = snapCamera(0, 0, 1);
  const list = buildDrawList(sc, fit, cam, 1020, 10), sparks = list.cmds.filter((d) => d.sheet === "spark"), at = (d?: DrawCmd): number | undefined => (d === undefined ? undefined : view.px[(d.dy + 4) * 160 + d.dx + 4]), under = sparks.filter((d) => d.dx > 60), front = sparks.find((d) => d.dx < 60);
  const night = (cmds: readonly DrawCmd[]): number | undefined => { present(r, fit, { dueMs: Infinity, cmds }, "#204060", () => { r.lights(L.plan(grid, torch3, 0.5, 0, 4), fit, cam); }); return at(under[0]); };
  const bare = night(list.cmds.filter((d) => !under.includes(d))), full = night(list.cmds);
  assert.deepEqual([sc.standing.filter((s) => s.sheet.id === "spark").map((s) => [s.kind, s.sceneLit, s.faceSwap]), under.length, sparks.filter((d) => d.selfLit === true).length, full === bare, full !== 0xffffc0e0, at(front)], [[["fxBehind", undefined, undefined], ["fxFront", undefined, true], ["fxFront", undefined, undefined], ["fxFront", undefined, undefined]], 3, 2, true, true, 0xffffc0e0]); // all still marked self-lit by fx-live; only the 2 front ones over a unit take the pass (one self-lit piece covering another keeps both in it)
});
