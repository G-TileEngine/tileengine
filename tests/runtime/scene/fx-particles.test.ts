import assert from "node:assert/strict";
import { test } from "node:test";
import { canvas2d, type CanvasLike, type Ctx2D } from "../../../src/runtime/canvas/canvas2d.ts";
import { FX_BUDGET, FX_GROUND_ORDER, LOOK, PARTICLES, buildDrawList, capCounts, chunkedList, fitView, hitWhiteMs, lookPixels, lookSize, particleAt, particleRead, present, recolour, snapCamera, toDevice, turnTag, type Clip, type DrawCmd, type FxPiece, type LiveFx, type Pixels, type RenderScene, type Renderer, type Sheet } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneClock, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { FakeRenderer } from "../render/fake-renderer.ts";
import { particleRig } from "../../perf/fx-particles-budget.ts";

const ramps = { bloom: ["#402040", "#a04080", "#ffc0e0"], water: ["#102040", "#2060a0", "#60c0f0", "#e0f8ff"], r: ["#ff0000"], g: ["#00ff00"], b: ["#0000ff"] };
const unitSheet: Sheet = { id: "hero-sheet", columns: 4, fw: 16, fh: 16 }, spark: Sheet = { id: "spark", columns: 1, fw: 8, fh: 8 }, tiny: Sheet = { id: "tiny", columns: 1, fw: 6, fh: 6 };
const atk: Clip = { name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }] }, idle: Clip = { name: "idle-down", frames: [4, 5], ms: [40, 40] };
const hero: SceneAsset = { sheet: unitSheet, clips: [atk, idle] };
const piece: FxPiece = { at: 0, ms: 600, sheet: spark }, dots: FxPiece = { at: 0, ms: 600, sheet: spark, kind: "particles", particle_count: 48, particle_life_ms: 600 }; // the window is 1000-1600; hit = contact = 1300
const fx = (over: Partial<LiveFx> = {}): LiveFx => ({ id: "e1", castMs: 1000, caster: "a", target: "b", pieces: [piece], ...over });
const world = (effects: LiveFx[], over: Partial<SceneWorld> = {}): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero }, layers: [], units: [{ id: "a", sprite: "hero", at: { c: 2, r: 2 }, offset: null, facing: "E", alive: true, action: "atk" }, { id: "b", sprite: "hero", at: { c: 5, r: 2 }, offset: null, facing: "W", alive: true, action: "idle" }], objects: [], overlays: [], effects, style: { ramps }, ...over });
const at = (w: SceneWorld, t: number, over: Partial<SceneClock> = {}, link = createSceneLink()): RenderScene => link.scene(w, { tMs: t, stepMs: 10, ...over });
const fit = fitView(390, 844, 2, 16, 16), cam = snapCamera(0, 0, 2);
const img = (w: number, h: number, colours: readonly number[]): Pixels => { const data = new Uint8ClampedArray(w * h * 4); colours.forEach((c, i) => { if (c === 0) return; data[i * 4] = (c >> 16) & 255; data[i * 4 + 1] = (c >> 8) & 255; data[i * 4 + 2] = c & 255; data[i * 4 + 3] = 255; }); return { w, h, data }; };
const cells = (p: Pixels): number[] => Array.from({ length: p.w * p.h }, (_, i) => ((p.data[i * 4 + 3] ?? 0) === 0 ? 0 : ((p.data[i * 4] ?? 0) << 16) | ((p.data[i * 4 + 1] ?? 0) << 8) | (p.data[i * 4 + 2] ?? 0)));

test("particles format: particle_motion burst/attract/spiral-in/rise (unknown plays as burst, outOfRange), particle_count 0-48 default 12, particle_life_ms 200-3000 default 800 (draft particle_life is an alias; _ms wins), particle_pull 0-2000 default 1000, clamped and flagged; the 48 is a per-effect sum: later steps are cut in step order and the pre-cut sum is reported (step 33b-3, CN-017)", () => {
  assert.deepEqual(particleRead({}), { motion: "burst", count: 12, life: 800, pull: 1000, bad: [] });
  assert.deepEqual(particleRead({ particle_motion: "swirl", particle_count: 60, particle_life: 100, particle_pull: 2500 }), { motion: "burst", count: 48, life: 200, pull: 2000, bad: ["particle_motion", "particle_count", "particle_life_ms", "particle_pull"] });
  assert.deepEqual(["burst", "attract", "spiral-in", "rise"].map((m) => particleRead({ particle_motion: m }).motion), ["burst", "attract", "spiral-in", "rise"]);
  assert.deepEqual([particleRead({ particle_life_ms: 500, particle_life: 900 }).life, particleRead({ particle_life: 900 }).life, particleRead({ particle_count: -2 }).count, particleRead({ particle_life_ms: 4000 }).life, particleRead({ particle_count: Number.NaN }).bad], [500, 900, 0, 3000, ["particle_count"]]);
  assert.deepEqual(capCounts([30, 30, 10]), { counts: [30, 18, 0], over: 70 }); assert.deepEqual(capCounts([12, 36]), { counts: [12, 36], over: null }); assert.deepEqual(capCounts([0, 48, 0]), { counts: [0, 48, 0], over: null });
  assert.deepEqual([PARTICLES.pool, PARTICLES.perEffect, FX_BUDGET.effect, FX_BUDGET.total, FX_BUDGET.frame, LOOK.cacheBytes, LOOK.buckets, LOOK.liteBuckets], [96, 48, 60, 120, 300, 16 * 2 ** 20, 16, 8]); assert.deepEqual(FX_GROUND_ORDER, ["shore", "pieces", "particles"]);
});

test("particle motion: seeded and clock-based (same inputs, same art-px offsets, floored from 1/256), size 3 then 2 then 1 over its life, colour steps down the ramp from its lightest, only the last 2 steps fade (0.5, 0.25); burst grows from the emitter, rise goes up, attract and spiral-in reach the emitter by pull; pull is ignored by burst and rise; reduce motion keeps 2 stills (step 33b-3, CN-017)", () => {
  const burst = particleRead({ particle_life_ms: 900 }), first = particleAt(burst, 3, 77, 400, null, false);
  assert.deepEqual(first, particleAt(burst, 3, 77, 400, null, false)); assert.ok(first !== null && Number.isInteger(first.x) && Number.isInteger(first.y));
  assert.deepEqual([0, 310, 610].map((a) => particleAt(burst, 0, 77, a, null, false)?.size), [3, 2, 1]); assert.deepEqual([particleAt(burst, 0, 77, 900, null, false), particleAt(burst, 0, 77, -1, null, false)], [null, null]);
  const life = particleRead({}), steps = [0, 250, 450, 700].map((a) => particleAt(life, 0, 5, a, ramps.water, false));
  assert.deepEqual(steps.map((d) => [d?.colour, d?.alpha]), [["#e0f8ff", 1], ["#60c0f0", 1], ["#2060a0", 0.5], ["#102040", 0.25]]); assert.deepEqual([0, 700].map((a) => [particleAt(life, 0, 5, a, null, false)?.colour, particleAt(life, 0, 5, a, null, false)?.alpha]), [["#ffb048", 1], ["#ffb048", 1]]);
  const spread = Array.from({ length: 12 }, (_, i) => particleAt(life, i, 9, 600, null, false)), far = (d: { x: number; y: number } | null | undefined): number => (d === null || d === undefined ? -1 : Math.hypot(d.x, d.y));
  assert.deepEqual([particleAt(life, 0, 9, 0, null, false)?.x, particleAt(life, 0, 9, 0, null, false)?.y], [0, 0]); assert.ok(spread.every((d) => far(d) >= 2)); assert.ok(new Set(spread.map((d) => `${d?.x},${d?.y}`)).size >= 10); assert.equal(new Set(spread.map((d) => `${Math.sign(d?.x ?? 0)},${Math.sign(d?.y ?? 0)}`)).size >= 3, true);
  for (const m of ["burst", "rise"]) assert.deepEqual(particleAt(particleRead({ particle_motion: m, particle_pull: 0 }), 2, 9, 500, null, false), particleAt(particleRead({ particle_motion: m, particle_pull: 2000 }), 2, 9, 500, null, false));
  const rise = particleRead({ particle_motion: "rise" }); assert.ok([1, 2, 3].every((i) => (particleAt(rise, i, 9, 600, null, false)?.y ?? 0) < (particleAt(rise, i, 9, 200, null, false)?.y ?? 0) && (particleAt(rise, i, 9, 200, null, false)?.y ?? 1) <= 0));
  for (const m of ["attract", "spiral-in"]) { const strong = particleRead({ particle_motion: m, particle_pull: 2000 }), weak = particleRead({ particle_motion: m, particle_pull: 500 }); assert.ok(far(particleAt(strong, 4, 9, 0, null, false)) >= 4, m); assert.deepEqual([particleAt(strong, 4, 9, 400, null, false)?.x, particleAt(strong, 4, 9, 400, null, false)?.y].map((v) => Math.abs(v ?? 1)), [0, 0], m); assert.ok(far(particleAt(weak, 4, 9, 400, null, false)) > 2, m); }
  assert.notDeepEqual(particleAt(particleRead({ particle_motion: "spiral-in" }), 4, 9, 300, null, false), particleAt(particleRead({ particle_motion: "attract" }), 4, 9, 300, null, false));
  const still = [100, 300, 500, 700].map((a) => particleAt(life, 4, 9, a, ramps.water, true));
  assert.deepEqual(still[0], still[1]); assert.deepEqual(still[2], still[3]); assert.deepEqual([still[0]?.x, still[0]?.y, still[0]?.size, still[3]?.size, still[3]?.colour], [0, 0, 3, 1, "#102040"]); assert.notDeepEqual([still[2]?.x, still[2]?.y], [0, 0]);
});

test("live particles: a particles step draws dots from its emitter in its band, never its picture; one pool of 96 drops the oldest first; fxParticlesOverCap {count, limit: 48} fires once with outOfRange per field; draws are capped at 60 per effect and 120 in total, pieces first, and a particle is one draw (step 33b-3, CN-017)", () => {
  const three = [fx({ id: "e1", castMs: 1000, tint_ramp: "r", pieces: [dots] }), fx({ id: "e2", castMs: 1100, tint_ramp: "g", pieces: [dots] }), fx({ id: "e3", castMs: 1200, tint_ramp: "b", pieces: [dots] })], scene = at(world(three), 1250);
  const tally = (s: RenderScene): Record<string, number> => (s.dots ?? []).reduce<Record<string, number>>((m, d) => ({ ...m, [d.colour]: (m[d.colour] ?? 0) + 1 }), {});
  assert.equal(scene.dots?.length, 96); assert.deepEqual(tally(scene), { "#00ff00": 48, "#0000ff": 48 }); assert.equal(scene.overlays.length, 0); assert.ok(scene.dots?.every((d) => d.band === "fxAir"));
  assert.deepEqual(tally(at(world(three.slice(0, 2)), 1250)), { "#ff0000": 48, "#00ff00": 48 }); assert.ok(at(world([fx({ pieces: [{ ...dots, draw_layer: "ground" }] })]), 1250).dots?.every((d) => d.band === "fxGround"));
  const link = createSceneLink(), over = world([fx({ pieces: [{ ...dots, particle_count: 30 }, { ...dots, particle_count: 60, particle_motion: "swirl" as never }] })]);
  for (const t of [1100, 1200, 1300]) assert.equal(at(over, t, {}, link).dots?.length, 48);
  assert.deepEqual(link.notices.filter((n) => n.code === "fxParticlesOverCap"), [{ code: "fxParticlesOverCap", message: JSON.stringify({ count: 78, limit: 48 }) }]); assert.deepEqual(link.notices.filter((n) => n.code === "outOfRange").map((n) => n.message).sort(), ["particle_count", "particle_motion"]);
  assert.equal(at(world([fx({ pieces: [dots] })]), 1700).dots, undefined);
  const crowd = (id: string, n: number, extra: FxPiece[] = []): LiveFx => fx({ id, pieces: [...Array.from({ length: n }, () => piece), ...extra] });
  assert.equal(at(world([crowd("e1", 70)]), 1250).overlays.length, 60); assert.equal(at(world([crowd("e1", 70), crowd("e2", 70), crowd("e3", 5)]), 1250).overlays.length, 120);
  const mixed = at(world([crowd("e1", 50, [dots])]), 1250); assert.deepEqual([mixed.overlays.length, mixed.dots?.length], [50, 10]);
  const shared = at(world([crowd("e1", 40, [dots]), crowd("e2", 40, [dots])]), 1250); assert.deepEqual([shared.overlays.length, shared.dots?.length], [80, 40]);
});

test("draw list: particles draw after their band's pieces as one batched rect command per colour (rgba when faded), so on fxGround the order is shore, pieces, particles, then the standing pass; fxGround rects take the night, other bands are self-lit (seam 23); the frame stops at 300 draws; present uses one fill per command, else one fillRect per rect; chunked lists draw them once (step 33b-3, seam 3)", () => {
  const base: RenderScene = { cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, ground: [], above: [], standing: [{ kind: "unit", sheet: unitSheet, c: 4, r: 3 }], overlays: [{ band: "fxGround", sheet: { id: "shore", columns: 1, fw: 16, fh: 16 }, x: 0, y: 0 }, { band: "fxGround", sheet: spark, x: 10, y: 10 }, { band: "fxAir", sheet: spark, x: 30, y: 10 }, { band: "ui", sheet: spark, x: 0, y: 0 }], dots: [{ band: "fxGround", x: 5, y: 6, size: 3, colour: "#ff0000", alpha: 1 }, { band: "fxGround", x: 7, y: 6, size: 2, colour: "#00ff00", alpha: 1 }, { band: "fxGround", x: 9, y: 6, size: 1, colour: "#ff0000", alpha: 1 }, { band: "fxAir", x: 40, y: 20, size: 2, colour: "#102040", alpha: 0.5 }] };
  const list = buildDrawList(base, fit, cam, 0, 10), row = (c: DrawCmd): string => (c.rects === undefined ? `${c.band}:${c.sheet}` : `${c.band}:${c.colour}:${c.rects.length / 4}:${c.selfLit === true}`);
  assert.deepEqual(list.cmds.map(row), ["fxGround:shore", "fxGround:spark", "fxGround:#ff0000:2:false", "fxGround:#00ff00:1:false", "base:hero-sheet", "fxAir:spark", "fxAir:rgba(16,32,64,0.5):1:true", "ui:spark"]);
  const p0 = toDevice(5, 6, cam, fit); assert.deepEqual(list.cmds[2]?.rects, [p0.x, p0.y, 3 * fit.s, 3 * fit.s, toDevice(9, 6, cam, fit).x, p0.y, fit.s, fit.s]);
  assert.deepEqual(chunkedList(base, fit, cam, 0, 10).cmds.filter((c) => c.rects !== undefined).length, 3);
  const flood: RenderScene = { ...base, dots: Array.from({ length: 400 }, (_, i) => ({ band: "fxAir" as const, x: i % 100, y: Math.floor(i / 100), size: 1, colour: "#ffffff", alpha: 1 })) }, drawn = buildDrawList(flood, fit, cam, 0, 10).cmds;
  assert.equal(drawn.reduce((n, c) => n + (c.rects === undefined ? 1 : c.rects.length / 4), 0), FX_BUDGET.frame);
  const fake = new FakeRenderer(); present(fake, fit, list, "#000000"); assert.equal(fake.calls.filter((c) => c === "fill").length, 4);
  const batched: string[] = [], fills: Renderer = { beginFrame: () => undefined, drawImage: () => undefined, fillRect: () => { batched.push("fillRect"); }, fillRects: (r, c) => { batched.push(`${c}:${r.length / 4}`); }, endFrame: () => undefined };
  present(fills, fit, list, "#000000"); assert.deepEqual(batched, ["#ff0000:2", "#00ff00:1", "rgba(16,32,64,0.5):1"]);
  const paths: string[] = [], g = { imageSmoothingEnabled: false, globalCompositeOperation: "source-over", fillStyle: "" as unknown, save: () => undefined, restore: () => undefined, beginPath: () => { paths.push("begin"); }, rect: () => { paths.push("rect"); }, clip: () => { paths.push("clip"); }, fill: () => { paths.push(`fill ${String(g.fillStyle)}`); }, fillRect: () => { paths.push("fillRect"); }, translate: () => undefined, scale: () => undefined, drawImage: () => undefined };
  const cv: CanvasLike = { width: 390, height: 844, getContext: () => g }, r2d = canvas2d(cv, { images: () => ({}), makeCanvas: () => cv }); r2d.beginFrame(fit, "#000000"); paths.length = 0; r2d.fillRects?.([0, 0, 2, 2, 4, 4, 2, 2], "#ff0000"); assert.deepEqual(paths, ["begin", "rect", "rect", "fill #ff0000"]);
});

test("outline: auto outlines a piece over 6 px in its ramp's darkest step (else black), on outlines any size, off or absent never; additive pieces never outline and draw with add; particles never outline; the outline is a 1 px 4-neighbour ring baked once (size +2, drawn 1 px up-left) (step 33b-3, CN-015)", () => {
  const look = (p: FxPiece): (string | undefined)[] => at(world([fx({ pieces: [p] })]), 1250).overlays.map((o) => o.look);
  assert.deepEqual([look({ ...piece, outline: "auto", tint_ramp: "bloom" }), look({ ...piece, outline: "auto" }), look({ ...piece, sheet: tiny, outline: "auto" }), look({ ...piece, sheet: tiny, outline: "on" }), look({ ...piece, outline: "off" }), look(piece), look({ ...piece, outline: "on", blend: "add" })], [["ol#402040"], ["ol#000000"], [undefined], ["ol#000000"], [undefined], [undefined], [undefined]]);
  assert.equal(at(world([fx({ pieces: [{ ...piece, blend: "add" }] })]), 1250).overlays[0]?.op, "add"); assert.equal(at(world([fx({ tint_ramp: "bloom", pieces: [{ ...piece, outline: "auto" }] })]), 1250).overlays[0]?.look, "ol#402040");
  const src = (id: string, frame: number, fw: number, fh: number): Pixels | undefined => (id === "s" && frame === 0 && fw === 2 && fh === 2 ? img(2, 2, [0x112233, 0, 0, 0]) : undefined);
  const ring = lookPixels("s~fx0~2x2~ol#ff0000", src, undefined); assert.ok(ring !== undefined); assert.deepEqual([ring.w, ring.h], [4, 4]);
  assert.deepEqual(cells(ring), [0, 0xff0000, 0, 0, 0xff0000, 0x112233, 0xff0000, 0, 0, 0xff0000, 0, 0, 0, 0, 0, 0]); assert.equal(lookPixels("s~fx1~2x2~ol#ff0000", src, undefined), undefined); assert.equal(lookPixels("plain", src, undefined), undefined);
  const o = { band: "fxAir" as const, sheet: spark, x: 20, y: 20, frame: 0, look: "ol#000000" }, cmd = buildDrawList({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, ground: [], above: [], standing: [], overlays: [o] }, fit, cam, 0, 10).cmds[0];
  assert.deepEqual([cmd?.sheet, cmd?.sx, cmd?.sw, cmd?.dx, cmd?.dw], ["spark~fx0~8x8~ol#000000", 0, 10, toDevice(19, 19, cam, fit).x, 10 * fit.s]);
});

test("hit-white: hit_white_ms 0 is off, else 40-200 (clamped, outOfRange), starting at the hit; the target (default), the caster, or every stamp step drawing at the hit is recoloured on its own pixels: white, black, bright (2 steps up its ramp) or tint (impact_colour snapped to tint_ramp); alpha is kept (step 33b-3, seam 19, §2.10.2.7)", () => {
  assert.deepEqual([hitWhiteMs(undefined), hitWhiteMs(0), hitWhiteMs(100), hitWhiteMs(30), hitWhiteMs(500), hitWhiteMs("x")], [{ ms: 0, bad: false }, { ms: 0, bad: false }, { ms: 100, bad: false }, { ms: 40, bad: true }, { ms: 200, bad: true }, { ms: 0, bad: true }]);
  const looks = (e: Partial<LiveFx>, t: number): Record<string, string | undefined> => Object.fromEntries(at(world([fx({ pieces: [], ...e })]), t).standing.filter((s) => s.kind === "unit").map((s) => [s.key ?? "", s.look]));
  assert.deepEqual([looks({ hit_white_ms: 60 }, 1290), looks({ hit_white_ms: 60 }, 1320), looks({ hit_white_ms: 60 }, 1380), looks({}, 1320)], [{ a: undefined, b: undefined }, { a: undefined, b: "hw:white" }, { a: undefined, b: undefined }, { a: undefined, b: undefined }]);
  assert.deepEqual([looks({ hit_white_ms: 60, hit_white_target: "caster", hit_white_mode: "black" }, 1320), looks({ hit_white_ms: 60, hit_white_mode: "bright" }, 1320).b, looks({ hit_white_ms: 60, hit_white_mode: "tint", impact_colour: "#a050a0", tint_ramp: "bloom" }, 1320).b, looks({ hit_white_ms: 60, hit_white_mode: "tint", impact_colour: "#a050a0" }, 1320).b, looks({ hit_white_ms: 60, hit_white_mode: "glow" }, 1320).b], [{ a: "hw:black", b: undefined }, "hw:bright", "hw:#a04080", "hw:#a050a0", "hw:white"]);
  assert.deepEqual([looks({ hit_white_ms: 20 }, 1335).b, looks({ hit_white_ms: 20 }, 1350).b, looks({ hit_white_ms: 900 }, 1490).b, looks({ hit_white_ms: 900 }, 1510).b], ["hw:white", undefined, "hw:white", undefined]);
  const link = createSceneLink(); at(world([fx({ hit_white_ms: 20 })]), 1320, {}, link); assert.deepEqual(link.notices.filter((n) => n.code === "outOfRange").map((n) => n.message), ["hit_white_ms"]);
  const stamp = world([fx({ hit_white_ms: 60, hit_white_target: "stamp", pieces: [{ ...piece, kind: "stamp" }, piece] })]);
  assert.deepEqual(at(stamp, 1320).overlays.map((o) => o.look), ["hw:white", undefined]); assert.deepEqual(at(stamp, 1290).overlays.map((o) => o.look), [undefined, undefined]); assert.ok(at(stamp, 1320).standing.every((s) => s.look === undefined));
  const px = { w: 2, h: 1, data: new Uint8ClampedArray([0x40, 0x20, 0x40, 255, 9, 9, 9, 100]) }, frames = (id: string): Pixels | undefined => (id === "hero-sheet" ? px : undefined), live = createSceneLink(frames); at(world([fx()]), 1320, {}, live);
  assert.deepEqual([...(live.pixels("hero-sheet~fx5~2x1~hw:white")?.data ?? [])], [255, 255, 255, 255, 255, 255, 255, 100]); assert.deepEqual([...(live.pixels("hero-sheet~fx5~2x1~hw:bright")?.data ?? [])], [0xff, 0xc0, 0xe0, 255, 255, 255, 255, 100]);
  assert.deepEqual([...recolour(px, "black", undefined).data, ...recolour(px, "#102030", undefined).data, ...recolour({ w: 1, h: 1, data: new Uint8ClampedArray([7, 8, 9, 0]) }, "white", undefined).data], [0, 0, 0, 255, 0, 0, 0, 100, 0x10, 0x20, 0x30, 255, 0x10, 0x20, 0x30, 100, 7, 8, 9, 0]);
  const cmd = buildDrawList(at(world([fx({ pieces: [], hit_white_ms: 60 })]), 1320), fit, cam, 1320, 10).cmds.find((c) => c.sheet.includes("~hw:")); assert.match(cmd?.sheet ?? "", /^hero-sheet~fx[45]~16x16~hw:white$/); assert.deepEqual([cmd?.sx, cmd?.sw], [0, 16]);
});

test("pixel_scale: an int 1-6 draws every piece and particle k art px per art px around its anchor; match-sprite and absent draw at 1 (no wanted size reaches the player); out of range clamps with outOfRange (step 33b-3, CN-015)", () => {
  const scaled = (ps: unknown, link = createSceneLink()): RenderScene => at(world([fx({ pixel_scale: ps, pieces: [piece, dots] })]), 1020, {}, link);
  assert.deepEqual([scaled(2).overlays[0]?.scale, scaled("match-sprite").overlays[0]?.scale, scaled(undefined).overlays[0]?.scale, scaled(9).overlays[0]?.scale, scaled(2).dots?.[0]?.size, scaled(1).dots?.[0]?.size], [2, undefined, undefined, 6, 6, 3]);
  for (const bad of [9, 0, "big", 2.5]) { const link = createSceneLink(); scaled(bad, link); assert.deepEqual(link.notices.map((n) => n.message), ["pixel_scale"], String(bad)); }
  const link = createSceneLink(); scaled("match-sprite", link); scaled(6, link); assert.equal(link.notices.length, 0);
  const o = { band: "fxAir" as const, sheet: spark, x: 20, y: 20, frame: 0, scale: 3 }, cmd = buildDrawList({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, ground: [], above: [], standing: [{ kind: "unit", sheet: unitSheet, c: 1, r: 1, scale: 2 }], overlays: [o] }, fit, cam, 0, 10).cmds;
  assert.deepEqual([cmd[1]?.dx, cmd[1]?.dy, cmd[1]?.dw, cmd[1]?.sw], [toDevice(20 - 4 * 2, 20 - 8 * 2, cam, fit).x, toDevice(20 - 4 * 2, 20 - 8 * 2, cam, fit).y, 24 * fit.s, 8]);
  assert.deepEqual([cmd[0]?.dx, cmd[0]?.dy, cmd[0]?.dw], [toDevice(16 + 8 - 16, 32 - 32, cam, fit).x, toDevice(0, 0, cam, fit).y, 32 * fit.s]);
});

test("RotSprite: a piece's angle picks one of 16 buckets (lite 8, nearest), bucket 0 draws as-is; each bucket is baked once at art res by a 3x Scale3x upscale, a rotate and a centre sample, into a centred square, so 90 degrees is exact, every colour comes from the source (no blends, no mixels) and lite's nearest turn differs; turn, then hit-white, then outline (step 33b-3)", () => {
  assert.deepEqual([turnTag(0, false), turnTag(22.5, false), turnTag(90, false), turnTag(-90, false), turnTag(360, false), turnTag(30, true), turnTag(100, true), turnTag(undefined, false), turnTag(Number.NaN, true)], [null, "r1", "r4", "r12", null, "n2", "n4", null, null]);
  assert.deepEqual([lookSize(8, 4, "r4"), lookSize(8, 4, "r1|ol#000000"), lookSize(8, 4, "hw:white")], [{ w: 9, h: 9 }, { w: 11, h: 11 }, { w: 8, h: 4 }]);
  const A = 0x101010, B = 0x202020, C = 0x303030, D = 0x404040, sprite = img(3, 3, [A, B, C, D, 0, 0, D, 0, 0]), src = (id: string): Pixels | undefined => (id === "s" ? sprite : undefined);
  const q = lookPixels("s~fx0~3x3~r4", src, undefined); assert.ok(q !== undefined); const got = cells(q), want = Array.from({ length: 25 }, (_, i) => { const x = i % 5, y = Math.floor(i / 5); return x >= 1 && x <= 3 && y >= 1 && y <= 3 ? cells(sprite)[(3 - x) * 3 + (y - 1)] ?? 0 : 0; });
  assert.deepEqual(got, want); assert.deepEqual(cells(lookPixels("s~fx0~3x3~n4", src, undefined) ?? sprite), want);
  const diag = img(6, 6, [A, A, 0, 0, 0, 0, 0, A, A, 0, 0, 0, 0, 0, B, B, 0, 0, 0, 0, 0, B, B, 0, 0, 0, 0, 0, C, C, 0, 0, 0, 0, 0, C]), dsrc = (id: string): Pixels | undefined => (id === "d" ? diag : undefined);
  const smooth = lookPixels("d~fx0~6x6~r2", dsrc, undefined), near = lookPixels("d~fx0~6x6~n2", dsrc, undefined); assert.ok(smooth !== undefined && near !== undefined);
  assert.deepEqual([smooth.w, smooth.h], [9, 9]); assert.notDeepEqual(cells(smooth), cells(near)); for (const c of [...cells(smooth), ...cells(near), ...cells(lookPixels("d~fx0~6x6~r1", dsrc, undefined) ?? diag)]) assert.ok([0, A, B, C].includes(c), c.toString(16));
  const turned = (p: FxPiece, lite = false): (string | undefined)[] => at(world([fx({ tint_ramp: "bloom", pieces: [p] })]), 1250, { lite }).overlays.map((o) => o.look);
  assert.deepEqual([turned({ ...piece, angle: 90 }), turned({ ...piece, angle: 90 }, true), turned({ ...piece, angle: 30 }, true), turned({ ...piece, angle: 90, outline: "auto", kind: "stamp" }), turned({ ...piece, angle: 0 })], [["r4"], ["n4"], ["n2"], ["r4|ol#402040"], [undefined]]);
  const stamped = at(world([fx({ hit_white_ms: 60, hit_white_target: "stamp", pieces: [{ ...piece, angle: 90, outline: "on", kind: "stamp" }] })]), 1320).overlays[0]?.look; assert.equal(stamped, "r4|hw:white|ol#000000");
  const o = { band: "fxAir" as const, sheet: spark, x: 20, y: 20, frame: 0, look: "r2" }, cmd = buildDrawList({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, ground: [], above: [], standing: [], overlays: [o] }, fit, cam, 0, 10).cmds[0];
  assert.deepEqual([cmd?.sheet, cmd?.sw, cmd?.dx], ["spark~fx0~8x8~r2", 12, toDevice(18, 18, cam, fit).x]);
});

test("16 MB cache: generated bakes (looks, turns, squash) share one LRU with the light canvases; at frame end the least recently drawn are dropped until bakes plus lights fit in 16 MB, never one drawn this frame; a cache hit is not rebuilt (step 33b-3)", () => {
  const built: string[] = [], g: Ctx2D = { imageSmoothingEnabled: false, globalCompositeOperation: "source-over", fillStyle: "", save: () => undefined, restore: () => undefined, beginPath: () => undefined, rect: () => undefined, clip: () => undefined, fillRect: () => undefined, translate: () => undefined, scale: () => undefined, drawImage: () => undefined, createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData: () => undefined };
  const cv = (w: number, h: number): CanvasLike => ({ width: w, height: h, getContext: () => g }), r = canvas2d(cv(390, 844), { images: () => undefined, makeCanvas: cv, pixels: (id) => { built.push(id); return { w: 1024, h: 1024, data: new Uint8ClampedArray(4 * 2 ** 20) }; } });
  const draw = (...ids: string[]): void => { r.beginFrame(fit, "#000000"); for (const id of ids) r.drawImage(id, 0, 0, 1, 1, 0, 0, 1, 1, "normal", false); r.endFrame(); };
  draw("g0"); draw("g1"); draw("g2"); draw("g3"); assert.equal(r.stats.bytes, 16 * 2 ** 20); draw("g4"); assert.equal(r.stats.bytes, 16 * 2 ** 20);
  built.length = 0; draw("g1"); draw("g5"); draw("g1", "g3", "g4", "g5"); assert.deepEqual(built, ["g5"]); draw("g2", "g0"); assert.deepEqual(built, ["g5", "g2", "g0"]); assert.equal(r.stats.bytes, 16 * 2 ** 20);
  draw("a", "b", "c", "d", "e"); assert.equal(r.stats.bytes, 20 * 2 ** 20); draw(); assert.equal(r.stats.bytes, 16 * 2 ** 20);
  const lightPlan = { w: 512, h: 512, res: 4, dark: new Uint8Array(512 * 512), level: new Uint8Array(512 * 512) }; r.beginFrame(fit, "#000000"); r.lights(lightPlan as never, fit, cam); r.endFrame(); assert.equal(r.stats.bytes, 14 * 2 ** 20);
});

test("budget counts (in the suite; the 4 ms p95 wall clock runs alone in tests/perf/fx-particles-budget.ts): 12 looping effects with 48 particles and 2 outlined, turned pieces each draw 120 fx draws (24 pieces, 96 particles), at most 300 a frame, and one fill per particle colour (step 33b-3)", () => {
  const rig = particleRig(); for (let t = 0; t <= 600; t += 16) rig.frame(t); rig.frame(600);
  assert.deepEqual(rig.counts(), [132, 36, 97, 2]); assert.ok((rig.counts()[0] ?? Infinity) <= FX_BUDGET.frame); // G1 R7: one edge dot now stays until fully off screen (was 131, 96)
});
