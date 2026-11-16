import assert from "node:assert/strict";
import { test } from "node:test";
import { PARTICLES, buildDrawList, createFxLive, fitView, particleAt, particleRead, snapCamera, type FxPiece, type LiveFx, type LiveGrid, type Pixels, type Sheet, type Standing } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";

const slash: Sheet = { id: "slash", columns: 1, fw: 8, fh: 8 }, hero: Sheet = { id: "hero-sheet", columns: 4, fw: 16, fh: 16 }, fit = fitView(160, 96, 1, 16, 16), cam = snapCamera(0, 0, 1);
const grid: LiveGrid = { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 1 };
const air = (over: Partial<FxPiece> = {}): FxPiece => ({ at: 0, ms: 400, sheet: slash, draw_layer: "air", ...over });
const fx = (over: Partial<LiveFx> = {}): LiveFx => ({ id: "e", castMs: 0, caster: "gone", at: { c: 1, r: 1 }, pieces: [air()], ...over });
const play = (e: LiveFx, g: LiveGrid = grid) => createFxLive().frame([e], () => null, 0, 100, g);
const atk = { name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }], points: { hand: [[12, 6]] } };
const unit = (id: string, c: number) => ({ id, sprite: "hero", at: { c, r: 2 }, offset: null, facing: "E" as const, alive: true, action: "atk" });
const world = (effects: LiveFx[]): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero: { sheet: hero, clips: [atk] } }, layers: [], units: [unit("a", 2), unit("b", 4)], objects: [], overlays: [], effects });
const at = (tMs: number) => ({ tMs, stepMs: 10 });

test("item 10: pixel_scale null, absent and match-sprite play 1 quietly; '1'-'6' are aliases of 1-6; 'x' warns once and plays 1 (G2b)", () => {
  const noted = (s: unknown) => play(fx({ pixel_scale: s })).notes.filter((n) => n.message === "pixel_scale").length, scaleOf = (s: unknown) => play(fx({ pixel_scale: s })).overlays[0]?.scale;
  assert.deepEqual([null, undefined, "match-sprite", "3", "6", 3, "x", "7", "0", " 3", "3.0"].map(noted), [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
  assert.deepEqual([null, undefined, "match-sprite", "x", "1", "3.0"].map(scaleOf), [undefined, undefined, undefined, undefined, undefined, undefined]);
  assert.deepEqual(play(fx({ pixel_scale: "3" })).overlays, play(fx({ pixel_scale: 3 })).overlays); assert.equal(scaleOf("3"), 3);
  const link = createSceneLink(), w = { ...world([fx({ pixel_scale: "x" })]) }; for (const t of [20, 50, 80]) link.scene(w, at(t));
  assert.equal(link.notices.filter((n) => n.message === "pixel_scale").length, 1);
});

test("item 11: blend add reaches unit-layer pieces as Standing.op and the draw list draws them add; no blend keeps no op (G2b)", () => {
  const piece = (blend?: "add"): FxPiece => ({ at: 0, ms: 400, sheet: slash, anchor_point: "hand", draw_layer: "front-unit", ...(blend === undefined ? {} : { blend }) });
  const front = (blend?: "add") => { const sc = createSceneLink().scene(world([{ id: "e", castMs: 1000, caster: "a", pieces: [piece(blend)] }]), at(1100)); return { st: sc.standing.find((s) => s.kind === "fxFront"), cmd: buildDrawList(sc, fit, cam, 1100, 10).cmds.find((c) => c.sheet === "slash") }; };
  const add = front("add"), plain = front();
  assert.deepEqual([add.st?.op, add.cmd?.op, "op" in (plain.st ?? {}), plain.cmd?.op], ["add", "add", false, "normal"]);
  const behind = createSceneLink().scene(world([{ id: "e", castMs: 1000, caster: "a", pieces: [{ at: 0, ms: 400, sheet: slash, anchor_point: "hand", draw_layer: "behind-unit", blend: "add" }] }]), at(1100)).standing.find((s) => s.kind === "fxBehind");
  assert.equal(behind?.op, "add");
  const st: Standing = { kind: "object", sheet: slash, c: 1, r: 1, op: "add" }; assert.equal(buildDrawList({ cols: 4, rows: 4, tileW: 16, tileH: 16, mapSeed: 1, ground: [], above: [], standing: [st], overlays: [] }, fit, cam, 0, 10).cmds[0]?.op, "add");
});

test("item 13: an effect light sits at the drawn centre of a scaled piece (the art grows around its anchor) (G2b)", () => {
  const lit = (k: unknown) => play(fx({ pixel_scale: k, pieces: [air({ light_mode: "steady" })] })).lit.lights[0];
  assert.deepEqual([lit(undefined)?.x, lit(undefined)?.y, lit(2)?.x, lit(2)?.y, lit(3)?.y], [24, 28, 24, 24, 20]);
  const sc = { cols: 4, rows: 4, tileW: 16, tileH: 16, mapSeed: 1, ground: [], above: [], standing: [], overlays: play(fx({ pixel_scale: 2 })).overlays }, cmd = buildDrawList(sc, fit, cam, 50, 10).cmds[0];
  assert.deepEqual([(cmd?.dx ?? 0) + (cmd?.dw ?? 0) / 2, (cmd?.dy ?? 0) + (cmd?.dh ?? 0) / 2], [24, 24]);
});

test("item 14: jitter, start_spread and size_spread vary each particle (seeded, clamped and flagged); absent changes nothing; lite plays half the count (G2b)", () => {
  assert.deepEqual(particleRead({}), { motion: "burst", count: 12, life: 800, pull: 1000, bad: [] });
  const r = particleRead({ jitter: 2, start_spread: 0.5, size_spread: "big" }); assert.deepEqual([r.jitter, r.start_spread, r.size_spread, r.bad], [0.8, 0.5, undefined, ["jitter", "size_spread"]]);
  const base = particleRead({}), jit = particleRead({ jitter: 0.5 }), late = particleRead({ start_spread: 0.75 }), big = particleRead({ size_spread: 0.6 }), ids = Array.from({ length: 12 }, (_, i) => i);
  assert.deepEqual(ids.map((i) => particleAt(base, i, 9, 300, null, false, 16)), ids.map((i) => particleAt(base, i, 9, 300, null, false)));
  const moved = ids.map((i) => [particleAt(jit, i, 9, 300, null, false, 16), particleAt(base, i, 9, 300, null, false)] as const);
  assert.ok(moved.some(([a, b]) => a?.x !== b?.x) && moved.every(([a, b]) => Math.abs((a?.x ?? 0) - (b?.x ?? 0)) <= 8 && Math.abs((a?.y ?? 0) - (b?.y ?? 0)) <= 8));
  assert.ok(ids.some((i) => particleAt(late, i, 9, 100, null, false) === null) && ids.some((i) => particleAt(late, i, 9, 100, null, false) !== null));
  assert.ok(new Set(ids.map((i) => particleAt(big, i, 9, 0, null, false)?.size)).size > 1 && ids.every((i) => (particleAt(big, i, 9, 0, null, false)?.size ?? 0) >= 1));
  const dots = (lite: boolean, n: number) => play(fx({ pieces: [air({ kind: "particles", particle_count: n, particle_life_ms: 800 })] }), { ...grid, lite }).dots.length;
  assert.deepEqual([dots(false, 5), dots(true, 5), dots(false, 48), dots(true, 48)], [5, 3, 48, 24]); assert.deepEqual([PARTICLES.pool, PARTICLES.perEffect], [96, 48]);
  const two = (lite: boolean) => play(fx({ pieces: [air({ kind: "particles", particle_count: 48, particle_life_ms: 800 }), air({ kind: "particles", particle_count: 48, particle_life_ms: 800 })] }), { ...grid, lite }).dots.length;
  assert.deepEqual([two(false), two(true)], [48, 24]);
});

test("item 15a: a squashed unit keeps its hit-white, and the link bakes the squashed, whitened picture (G2b)", () => {
  const src = (id: string, _f: number, fw: number, fh: number): Pixels | undefined => id !== "hero-sheet" ? undefined : ({ w: fw, h: fh, data: new Uint8ClampedArray(fw * fh * 4).fill(40).map((v, i) => (i % 4 === 3 ? 255 : v)) });
  const link = createSceneLink(src), sc = link.scene(world([{ id: "e", castMs: 1000, caster: "a", target: "b", hitOffsetMs: 150, squash: true, hit_white_ms: 60, pieces: [air()] }]), at(1180));
  const id = buildDrawList(sc, fit, cam, 1180, 10).cmds.map((c) => c.sheet).find((s) => s.includes("~sq") && s.includes("~hw:")) ?? "", px = link.pixels(id);
  assert.match(id, /^hero-sheet~sq\d+~16x16~fx\d+~18x14~hw:white$/); assert.deepEqual([px?.w, px?.h, px?.data[0], px?.data[3]], [18, 14, 255, 255]);
  const tint = createSceneLink().scene(world([{ id: "e", castMs: 1000, caster: "a", target: "b", hitOffsetMs: 150, squash: true, hit_white_ms: 60, hit_white_mode: "tint", pieces: [air()] }]), at(1180));
  assert.ok(buildDrawList(tint, fit, cam, 1180, 10).cmds.some((c) => /hero-sheet~sq\d+~16x16~fx\d+~18x14~hw:#ffb048/.test(c.sheet)));
});

test("seam 33: a piece's particles draw in the piece's band: ground in fxGround, overlay in flash, air and unit layers in fxAir (G2b)", () => {
  const band = (layer: string) => play(fx({ pieces: [air({ kind: "particles", particle_count: 2, draw_layer: layer })] })).dots[0]?.band;
  assert.deepEqual(["ground", "overlay", "air", "front-unit"].map(band), ["fxGround", "flash", "fxAir", "fxAir"]);
});
