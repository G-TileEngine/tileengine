import assert from "node:assert/strict";
import { test } from "node:test";
import { BAKE_BUDGET, CHUNK, bakeMotion, buildDrawList, createMoonlit, createWorldMotion, fitView, isStatic, motionAt, present, shoreDistance, shoreFrames, shoreSettings, snapCamera, waveOffsetMs, type Clip, type Fit, type FxPiece, type LiveFx, type Pixels, type RenderScene, type Renderer, type Sheet } from "../../../src/runtime/render/index.ts";
import { canvas2d, type CanvasLike, type Ctx2D } from "../../../src/runtime/canvas/canvas2d.ts";
import { createClock } from "../../../src/core/clock/index.ts";
import { createDriver, type HostEnv } from "../../../src/runtime/host/raf-driver.ts";
import { hash32 } from "../../../src/runtime/render/frames.ts";
import { FakeCanvas } from "../canvas/fake-canvas.ts";
import { createSceneLink, type SceneAsset, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";

const tiles: Sheet = { id: "tiles", columns: 4, fw: 16, fh: 16 }, tree: Sheet = { id: "tree", columns: 1, fw: 16, fh: 32 };
const blank = (w: number, h: number): Pixels => ({ w, h, data: new Uint8ClampedArray(w * h * 4).fill(200) });
const source = (_id: string, _f: number, fw: number, fh: number): Pixels => ({ w: fw, h: fh, data: new Uint8ClampedArray(fw * fh * 4).map((_, i) => (i >> 2) % fw * 9) });
const river: SceneAsset = { sheet: tiles, tileProps: { "1": { motion: { scroll: { step: 1 } } } } }, leafy: SceneAsset = { sheet: tree, motion: { sway: { trunkFrom: 24 } } };
const style = { ramps: { water: ["#102040", "#204080", "#4080c0", "#80c0ff"] } };
const map = (cols: number, rows: number, wet: (c: number, r: number) => boolean): (number | null)[] => Array.from({ length: cols * rows }, (_, i) => (wet(i % cols, Math.floor(i / cols)) ? 1 : 0));
const world = (over: Partial<SceneWorld> = {}): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { river, leafy }, layers: [{ tileset: "river", aboveUnits: false, visible: true, tiles: map(10, 6, (c) => c >= 5) }], units: [], objects: [], overlays: [], ...over });
const at = (tMs: number, reduce = false) => ({ tMs, stepMs: 10, reduce });
const fit = fitView(160, 96, 1, 16, 16), cam = snapCamera(0, 0, 1);
const cmds = (sc: RenderScene, t: number) => buildDrawList(sc, fit, cam, t, 10);

test("river scroll: a scroll tile draws its motion atlas 1 px per 0.2 s, every tile on the same pose, never baked into a chunk, and moonlit swaps carry it to the night sheet (step 33i)", () => {
  const link = createSceneLink(source), sc = link.scene(world(), at(0)), layer = sc.ground[0];
  assert.equal(layer !== undefined && isStatic(layer, 1), false); assert.equal(layer !== undefined && isStatic(layer, 0), true);
  const xs = (t: number) => [...new Set(cmds(sc, t).cmds.filter((c) => c.sheet.startsWith("tiles~m1~")).map((c) => c.sx))];
  assert.deepEqual([xs(0), xs(199), xs(200), xs(1000)], [[0], [0], [16], [80]]); assert.equal(cmds(sc, 0).dueMs, 200);
  const id = cmds(sc, 0).cmds.find((c) => c.sheet.startsWith("tiles~m1~"))?.sheet ?? "", px = link.pixels(id);
  const want = bakeMotion(source("", 0, 16, 16), { scroll: { step: 1 } }, { animated: false }).frames;
  assert.deepEqual([px?.w, px?.h, [3, 7].map((f) => px?.data[(2 * 256 + f * 16 + 5) * 4])], [16 * 16, 16, [3, 7].map((f) => want[f]?.data[(2 * 16 + 5) * 4])]);
  const asked: string[] = [], night = createSceneLink((sid, f, fw, fh) => { asked.push(`${sid}#${f}`); return blank(fw, fh); }), lit = createMoonlit()(night.scene(world(), at(0)), new Map([["tiles", "tiles-night"]])), nid = cmds(lit, 0).cmds.find((c) => c.sheet.includes("~m1~"))?.sheet ?? "";
  assert.deepEqual([nid.startsWith("tiles-night~m1~"), night.pixels(nid)?.w, asked], [true, 256, ["tiles-night#1"]]); // moonlit: the colour swap carries motion
});

test("sway: a leafy plant loops 4 poses in 1.6 s and a plant 45 px further downwind lags one second (gusts about 45 px/s); objects[].motion overrides or clears it (step 33i)", () => {
  const objects = [{ assetId: "leafy", at: { c: 1, r: 3 } }, { assetId: "leafy", at: { c: 4, r: 3 }, motion: null }], sc = createSceneLink(source).scene(world({ layers: [], objects }), at(0));
  const parts = sc.standing.find((s) => s.motion !== undefined)?.motion?.parts ?? [];
  assert.deepEqual([sc.standing.filter((s) => s.motion !== undefined).length, parts.map((p) => `${p.kind}:${p.n}x${p.ms}`)], [1, ["sway:4x400"]]);
  assert.equal(waveOffsetMs(16, 1600, 45) - waveOffsetMs(61, 1600, 45), 1000); assert.equal(motionAt(parts, 1600 + 7, 16, 0).frame, motionAt(parts, 7, 16, 0).frame);
  for (const t of [0, 300, 900, 1400]) assert.equal(motionAt(parts, t, 61, 0).frame, motionAt(parts, t - 1000, 16, 0).frame);
  const two = createSceneLink(source).scene(world({ layers: [], objects: [{ assetId: "leafy", at: { c: 1, r: 3 } }, { assetId: "leafy", at: { c: 4, r: 3 } }] }), at(0)), sx = (t: number) => cmds(two, t).cmds.filter((c) => c.sheet.startsWith("tree~m")).map((c) => c.sx);
  for (const t of [300, 700]) assert.deepEqual(sx(t), [16, 64].map((x) => motionAt(parts, t, x, 0).frame * 16));
});

test("shore: water edges get animated foam on fxGround by default; shore: false or liquidEdge none turns it off; reduce shows frame 0 and no motion (step 33i)", () => {
  const link = createSceneLink(source), on = link.scene(world({ style, waterTiles: { river: [1] }, objects: [{ assetId: "leafy", at: { c: 1, r: 3 } }] }), at(0));
  const shore = on.overlays.filter((o) => o.sheet.id.startsWith("shore~"));
  assert.deepEqual(shore.map((o) => [o.band, o.sheet.columns, o.clip?.frames.length, o.x]), [["fxGround", 4, 4, 0]]);
  for (const off of [{ ...style, shore: false }, { ...style, liquidEdge: "none" }]) assert.equal(createSceneLink(source).scene(world({ style: off, waterTiles: { river: [1] } }), at(0)).overlays.length, 0);
  const still = createSceneLink(source).scene(world({ style, waterTiles: { river: [1] }, objects: [{ assetId: "leafy", at: { c: 1, r: 3 } }] }), at(0, true));
  assert.deepEqual([still.overlays.map((o) => o.frame), still.ground[0]?.motion, still.standing.some((s) => s.motion !== undefined)], [[0], undefined, false]);
  const w = world({ cols: 20, style, waterTiles: { river: [1] }, layers: [{ tileset: "river", aboveUnits: false, visible: true, tiles: map(20, 6, (c) => c < 5) }] });
  assert.deepEqual([link.scene(w, at(0)).overlays.length, link.scene(w, at(10, true)).ground[0]?.motion, link.scene(w, at(20)).ground[0]?.motion !== undefined], [1, undefined, true]);
});

test("shore bake: chunks match one whole-map bake with the same foamPx (no seams), and a stale, off-map or malformed window bakes nothing (step 33i)", () => {
  const cols = CHUNK + 4, rows = 4, wet = (c: number, r: number) => (c + r) % 7 < 3, link = createSceneLink(source), s = { ...style, shore: { foamPx: 4 } };
  const sc = link.scene(world({ cols, rows, style: s, waterTiles: { river: [1] }, layers: [{ tileset: "river", aboveUnits: false, visible: true, tiles: map(cols, rows, wet) }] }), at(0));
  const set = shoreSettings(s).on, W = cols * 16, H = rows * 16, land = new Uint8Array(W * H).map((_, i) => (wet(Math.floor((i % W) / 16), Math.floor(i / W / 16)) ? 0 : 1));
  const whole = set === null ? [] : shoreFrames(shoreDistance(land, W, H, 3, 32, 4), W, H, set.colours, set.opts), ids = sc.overlays.map((o) => o.sheet.id);
  assert.equal(ids.length, 2);
  for (const [k, id] of ids.entries()) { const px = link.pixels(id), w = (k === 0 ? CHUNK : 4) * 16, n = 4; assert.equal(px?.w, w * n);
    for (let f = 0; f < n; f += 1) for (let y = 0; y < H; y += 5) for (let x = 0; x < w; x += 3) assert.equal(px?.data[(y * w * n + f * w + x) * 4], whole[f]?.data[(y * W + k * CHUNK * 16 + x) * 4]); }
  const rev = ids[0]?.split("~")[1] ?? "";
  for (const bad of [`shore~${rev}~9,0`, `shore~${rev}~0,9`, `shore~${Number(rev) + 1}~0,0`, `shore~${rev}~-1,0`, `shore~${rev}~0.5,0`]) assert.equal(link.pixels(bad) === undefined, true, bad);
});

test("warnings and clocks: a bad or clip-covered motion warns once per asset across tiles and rebuilds; a non-finite clock draws pose 0 with no due time (step 33i)", () => {
  const bad: SceneAsset = { sheet: { ...tiles, id: "bad" }, motion: { scroll: { step: 5 } }, clips: [{ name: "lap", frames: [0, 1] }], tileProps: { "2": { anim: "lap" } } };
  const link = createSceneLink(source), layers = [{ tileset: "bad", aboveUnits: false, visible: true, tiles: [1, 1, 2, 2, 3, ...Array.from({ length: 55 }, () => 1)] }];
  for (const n of [1, 2]) link.scene(world({ assets: { bad }, layers, mapSeed: n }), at(n));
  assert.deepEqual(link.notices.map((n) => n.code + (n.message.includes("anim: null") ? ":hint" : "")), ["motionInvalid", "motionInvalid:hint"]);
  const sc = createSceneLink(source).scene(world(), at(0));
  for (const t of [Number.NaN, Number.POSITIVE_INFINITY]) { const list = cmds(sc, t); assert.deepEqual([[...new Set(list.cmds.filter((c) => c.sheet.startsWith("tiles~m")).map((c) => c.sx))], list.dueMs], [[0], Infinity]); }
});

test("bounds and host: baked pixels stay under BAKE_BUDGET; the canvas turns pixels into images and decodes frames; the night layer draws inside the open frame; a strip warns once per clip per asset id (step 33i)", () => {
  const wm = createWorldMotion((_id, _f, fw, fh) => blank(fw, fh)), m = { cycle: { ramp: ["#000000", "#111111", "#222222", "#333333", "#444444", "#555555", "#666666", "#777777"] }, sway: { trunkFrom: 200 } };
  const plan = wm.plan(m, undefined, false, 256, 256, "big");
  for (let i = 0; i < 6; i += 1) assert.equal(wm.pixels(`big${i}~m0~${plan?.key ?? ""}`)?.w, 256 * 32);
  assert.equal(wm.bytes() <= BAKE_BUDGET && wm.bytes() > 0, true);
  const log: string[] = [], ctx = (c: { w: number; h: number }): Ctx2D => ({ imageSmoothingEnabled: false, globalCompositeOperation: "", fillStyle: "", save() {}, restore() {}, beginPath() {}, rect() {}, clip() {}, fillRect() {}, translate() {}, scale() {}, drawImage: (img, sx, sy) => log.push(`draw:${(img as { tag?: string }).tag ?? "?"}@${sx},${sy}`), createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData: () => log.push(`put:${c.w}`), getImageData: (_x, _y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4).fill(9) }) });
  const mk = (w: number, h: number): CanvasLike & { tag: string } => { const c = { width: w, height: h, tag: `gen${w}`, getContext: () => ctx({ w, h }) }; return c; };
  const be = canvas2d(mk(160, 96), { images: (id) => (id === "sheet" ? { width: 64, tag: "sheet" } : undefined), makeCanvas: mk, pixels: (id) => (id === "gen" ? blank(8, 4) : undefined) });
  const f: Fit = fit; be.beginFrame(f, "#000"); be.drawImage("gen", 0, 0, 8, 4, 0, 0, 8, 4, "normal", false); be.endFrame();
  assert.deepEqual([log, be.frame("sheet", 5, 16, 16)?.data[0], be.frame("missing", 0, 16, 16), be.stats.bytes], [["put:8", "draw:gen8@0,0", "draw:sheet@16,16"], 9, undefined, 128]);
  const order: string[] = [], r: Renderer = { beginFrame: () => order.push("begin"), drawImage: () => order.push("draw"), fillRect: () => undefined, endFrame: () => order.push("end") };
  present(r, f, { cmds: [], dueMs: Infinity }, "#000", () => order.push("lights")); assert.deepEqual(order, ["begin", "lights", "end"]);
  const big: Clip = { name: "big", frames: Array.from({ length: 65 }, () => 0) }, piece = (id: string): FxPiece => ({ at: 0, ms: 400, sheet: { id, columns: 1, fw: 8, fh: 8 }, clip: big, draw_layer: "air" });
  const link = createSceneLink(), fx: LiveFx = { id: "e", castMs: 0, caster: "gone", at: { c: 1, r: 1 }, pieces: [piece("a"), piece("b"), piece("a")] };
  for (const t of [50, 60]) link.scene(world({ layers: [], effects: [fx] }), at(t)); assert.equal(link.notices.filter((n) => n.code === "fxTooManyFrames").length, 2);
});

test("QA qfix: anchors, object offsets and the pickMotion order; shore chunks on every row, shore.ms, waterTiles per tileset, ramps in the key, digs and warnings; image and plan bounds; the driver passes lights and pixels (step 33i)", () => {
  const cyc = { cycle: { ramp: ["#000000", "#111111", "#222222", "#333333"] } }, fount: SceneAsset = { sheet: { id: "fount", columns: 1, fw: 16, fh: 16 }, motion: cyc }, aTree: SceneAsset = { ...leafy, sheet: { ...tree, anchor: { x: 3, y: 30, units: "px" } } };
  const objs = (o: SceneWorld["objects"], assets: SceneWorld["assets"] = { leafy: aTree, fount }) => createSceneLink(source).scene(world({ layers: [], assets, objects: o }), at(0));
  const pair = cmds(objs([{ assetId: "leafy", at: { c: 2, r: 3 } }, { assetId: "leafy", at: { c: 2, r: 3 }, motion: null }]), 0).cmds.map((c) => [c.dx, c.dy, c.sw, c.sh]);
  assert.deepEqual(pair[0], pair[1]); // r1/r3: the atlas keeps the sheet's anchor and cell size
  const fo = objs([{ assetId: "fount", at: { c: 1, r: 1 } }, { assetId: "fount", at: { c: 6, r: 4 } }]), fp = fo.standing.find((s) => s.motion)?.motion?.parts ?? [];
  for (const t of [0, 130, 410]) assert.deepEqual(cmds(fo, t).cmds.map((c) => c.sx), [[1, 1], [6, 4]].map(([c, r]) => motionAt(fp, t, (c ?? 0) * 16, hash32(3, "fount", c ?? 0, r ?? 0)).frame * 16)); // EA 2: objects keep the per-instance offset
  assert.deepEqual(objs([{ assetId: "leafy", at: { c: 1, r: 3 }, motion: cyc }]).standing[0]?.motion?.parts.map((p) => p.kind), ["cycle"]); // r3: a placement overrides
  const both = createSceneLink(source).scene(world({ assets: { river: { ...river, motion: { sway: { trunkFrom: 8 } } } } }), at(0)).ground[0]?.motion?.[1]?.parts.map((p) => p.kind);
  assert.deepEqual(both, ["scroll"]); // r3: tile motion beats asset motion
  const tall = CHUNK + 2, s = { ...style, shore: { ms: 120 } }, sw = world({ rows: tall, style: s, waterTiles: { lake: [7], river: [1] }, layers: [{ tileset: "river", aboveUnits: false, visible: true, tiles: map(10, tall, (c) => c >= 5) }] });
  assert.deepEqual(createSceneLink(source).scene(sw, at(0)).overlays.map((o) => [o.y, o.clip?.ms]), [[0, [120, 120, 120, 120]], [CHUNK * 16, [120, 120, 120, 120]]]); // r4: every chunk row, shore.ms, this tileset's water
  const kid = (st: typeof style, styled: boolean) => cmds(createSceneLink(source).scene(world({ style: st, assets: { river: { ...river, styled } } }), at(0)), 0).cmds.find((c) => c.sheet.includes("~m1~"))?.sheet;
  const night = { ramps: { water: ["#000000", "#010101", "#020202", "#030303"] } };
  assert.deepEqual([kid(style, true) === kid(night, true), kid(style, false) === kid(night, false)], [false, true]); // r6: styled ramps are in the recipe key
  const ts = { id: "flat", columns: 4, fw: 16, fh: 8 }, rows = CHUNK + 4, wet = (c: number, r: number) => (r >= CHUNK - 3 ? !(c === 3 && r === rows - 1) : (c * 3 + r) % 5 < 2), link = createSceneLink(source), fs = { ...style, shore: { foamPx: 4 } };
  const vw = world({ cols: 4, rows, tileH: 8, style: fs, waterTiles: { flat: [1] }, assets: { flat: { sheet: ts } }, layers: [{ tileset: "flat", aboveUnits: false, visible: true, tiles: map(4, rows, wet) }] }), vs = link.scene(vw, at(0));
  const set = shoreSettings(fs).on, W = 64, H = rows * 8, land = new Uint8Array(W * H).map((_, i) => (wet(Math.floor((i % W) / 16), Math.floor(i / W / 8)) ? 0 : 1)), whole = set === null ? [] : shoreFrames(shoreDistance(land, W, H, 3, 32, 4), W, H, set.colours, set.opts);
  for (const o of vs.overlays) { const px = link.pixels(o.sheet.id), h = o.sheet.fh; for (let f = 0; f < 4; f += 1) for (let y = 0; y < h; y += 1) for (let x = 0; x < W; x += 5) assert.equal(px?.data[(y * W * 4 + f * W + x) * 4], whole[f]?.data[((o.y + y) * W + x) * 4]); } // r7/EA 5: no seam between chunk rows, non-square tiles
  const dug = link.scene({ ...vw, layers: [{ tileset: "flat", aboveUnits: false, visible: true, tiles: map(4, rows, (c, r) => wet(c, r) || r === 0) }] }, at(1)), old = vs.overlays[0]?.sheet.id ?? "";
  assert.notEqual(dug.overlays[0]?.sheet.id, old); // r8: a dig bumps rev
  const bad = { ...style, shore: { foamPx: 999 } }, wl = createSceneLink(source); for (const n of [1, 2]) wl.scene(world({ style: bad, waterTiles: { river: [1] }, layers: [{ tileset: "river", aboveUnits: false, visible: true, tiles: map(10, 6, (c) => c >= n) }] }), at(n));
  assert.equal(wl.notices.filter((n) => n.code.startsWith("shoreInvalid")).length, 1); // r9: shoreInvalid warns once per field
  const puts: number[] = [], g = (): Ctx2D => ({ imageSmoothingEnabled: false, globalCompositeOperation: "", fillStyle: "", save() {}, restore() {}, beginPath() {}, rect() {}, clip() {}, fillRect() {}, translate() {}, scale() {}, drawImage() {}, createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData: () => puts.push(1) });
  const mk = (w: number, h: number): CanvasLike => ({ width: w, height: h, getContext: g }), gen = blank(8, 4), be = canvas2d(mk(160, 96), { images: () => undefined, makeCanvas: mk, pixels: (id) => (id === "gen" ? gen : undefined) });
  const draw = (n: number) => { for (let i = 0; i < n; i += 1) { be.beginFrame(fit, "#000"); if (i === 0) be.drawImage("gen", 0, 0, 8, 4, 0, 0, 8, 4, "normal", false); be.endFrame(); } };
  draw(1); draw(1); const kept = [puts.length, be.stats.bytes]; draw(125); assert.deepEqual([kept, be.stats.bytes], [[1, 128], 0]); // r11/r12: one image per id, dropped after 120 idle frames
  const wm = createWorldMotion(source), first = wm.plan({ scroll: { step: 1 } }, undefined, false, 16, 16, "a");
  const many = Array.from({ length: 1100 }, (_, i) => ({ scroll: { step: 1 + (i >= 550 ? 1 : 0), ms: 101 + (i % 550) } })), last = many.map((m) => wm.plan(m, undefined, false, 16, 16, "a")).at(-1);
  assert.deepEqual([last !== null, wm.pixels(`x~m0~${first?.key ?? ""}`), wm.pixels(`x~m0~${last?.key ?? ""}`) !== undefined], [true, undefined, true]); // r11: plans stay within PLANS_MAX
  const big = createWorldMotion((_i, _f, fw, fh) => blank(fw, fh)), bm = { cycle: { ramp: ["#000000", "#111111", "#222222", "#333333", "#444444", "#555555", "#666666", "#777777"] }, sway: { trunkFrom: 200 } }, bk = big.plan(bm, undefined, false, 256, 256, "big")?.key ?? "";
  const hot = big.pixels(`b0~m0~${bk}`); for (const i of [1, 2, 3]) big.pixels(`b${i}~m0~${bk}`); big.pixels(`b0~m0~${bk}`); big.pixels(`b4~m0~${bk}`);
  assert.equal(big.pixels(`b0~m0~${bk}`) === hot, true); // r11: one LRU (a touched bake stays)
  const q: ((ts: number) => void)[] = [], asked: string[] = [], scene = createSceneLink(source).scene(world({ layers: [], overlays: [{ band: "fxAir", sheet: { id: "gen", columns: 1, fw: 8, fh: 4 }, x: 0, y: 0 }] }), at(0));
  const env: HostEnv = { requestAnimationFrame: (cb) => q.push(cb), cancelAnimationFrame: () => undefined, devicePixelRatio: 1, document: { visibilityState: "visible", addEventListener: () => undefined, removeEventListener: () => undefined, createElement: () => new FakeCanvas() }, ResizeObserver: class { observe(): void {} disconnect(): void {} } };
  let lights = { res: 4, w: 8, h: 4, dark: new Uint8Array(32).fill(9), level: new Uint8Array(32) };
  const drv = createDriver({ env, canvas: Object.assign(new FakeCanvas(), { clientWidth: 160, clientHeight: 96 }), clock: createClock(), view: () => ({ scene, x: 0, y: 0, s: 1, lights }), load: () => Promise.reject(new Error("none")), pixels: (id) => { asked.push(id); return undefined; } });
  drv.start(); let ts0 = 1000; const tick = () => { const cb = q.shift(); ts0 += 16; cb?.(ts0); }; tick(); tick(); const one = drv.backend.stats.lightBuilds; lights = { ...lights, dark: new Uint8Array(32).fill(3) }; tick(); tick();
  assert.deepEqual([one, drv.backend.stats.lightBuilds, asked.includes("gen")], [1, 2, true]); drv.dispose(); // r6/r12: the driver draws View.lights, a new plan redraws, pixels reach the canvas
});

test("M-1, M-2 and M-3: one motion on two frame sizes bakes each at its own size; one strip clip under 65 asset ids warns 65 times once, then never; shoreInvalid is the plain code once per field, naming the field; the warned set stops at 1024 (step 33i r2)", () => {
  const sway = { sway: { trunkFrom: 8 } }, bush: SceneAsset = { sheet: { id: "bush", columns: 1, fw: 16, fh: 16 }, motion: sway }, big: SceneAsset = { sheet: { id: "big", columns: 1, fw: 32, fh: 48 }, motion: { sway: { trunkFrom: 8 } } };
  const link = createSceneLink(source), sc = link.scene(world({ layers: [], assets: { bush, big }, objects: [{ assetId: "bush", at: { c: 1, r: 2 } }, { assetId: "big", at: { c: 5, r: 4 } }] }), at(0));
  assert.deepEqual(cmds(sc, 0).cmds.filter((c) => c.sheet.includes("~m")).map((c) => { const px = link.pixels(c.sheet); return `${c.sheet.split("~")[0]}:${px?.w}x${px?.h}`; }), ["bush:64x16", "big:128x48"]);
  for (const ids of [65, 70]) { // ≤ 64 ids per live clip, then one overflow warning and silence
    const clip: Clip = { name: "wide", frames: Array.from({ length: 65 }, () => 0) }, fx: LiveFx = { id: "e", castMs: 0, caster: "gone", at: { c: 1, r: 1 }, pieces: Array.from({ length: ids }, (_, i): FxPiece => ({ at: 0, ms: 1e9, sheet: { id: `s${i}`, columns: 1, fw: 8, fh: 8 }, clip, draw_layer: "air" })) };
    const strips = createSceneLink(), per = [1, 31, 61, 91].map((t) => { const n0 = strips.notices.length; strips.scene(world({ layers: [], effects: [fx] }), at(t)); return strips.notices.length - n0; });
    assert.deepEqual(per, [65, 0, 0, 0], `${ids} ids`); }
  const shore = createSceneLink(source), bad = { ...style, shore: { foamPx: 999, ms: 7 } };
  for (const n of [1, 2]) shore.scene(world({ style: bad, waterTiles: { river: [1] }, layers: [{ tileset: "river", aboveUnits: false, visible: true, tiles: map(10, 6, (c) => c >= n) }] }), at(n));
  const got = shore.notices.filter((n) => n.code.startsWith("shore"));
  assert.deepEqual([got.map((n) => n.code), ["foamPx", "ms"].every((f) => got.some((n) => n.message.includes(f)))], [["shoreInvalid", "shoreInvalid"], true]);
  const wm = createWorldMotion(source); for (let i = 0; i < 1100; i += 1) wm.plan({ scroll: { step: 5, ms: 50 + i } }, undefined, false, 1, 1, `o${i}`); assert.equal(wm.notes.length, 1024); // law 13: the warned set stops at PLANS_MAX keys, never clears
});

test("M-4: link notices dedupe by code and message across frames and stop at 1024: a bad clip or a bad-ms asset rebuilt every frame warns once; more distinct notices than the cap stop at exactly 1024 (step 33i r3)", () => {
  const per = (make: (f: number) => SceneWorld) => { const link = createSceneLink(); return [0, 1, 2, 3, 4].map((f) => { const n0 = link.notices.length; link.scene(make(f), at(1 + f * 16)); return link.notices.length - n0; }); };
  const strip = () => world({ layers: [], effects: [{ id: "e", castMs: 0, caster: "gone", at: { c: 1, r: 1 }, pieces: [{ at: 0, ms: 1e9, sheet: { id: "s", columns: 1, fw: 8, fh: 8 }, clip: { name: "big", frames: Array.from({ length: 65 }, () => 0) }, draw_layer: "air" }] }] });
  const badMs = () => world({ layers: [], assets: { a: { sheet: { ...tiles, id: "h" }, clips: [{ name: "x", frames: [0, 1], ms: [-1, 5] }] } } });
  assert.deepEqual([per(strip), per(badMs)], [[1, 0, 0, 0, 0], [1, 0, 0, 0, 0]]);
  const batch = (from: number): Record<string, SceneAsset> => { const out: Record<string, SceneAsset> = {}; for (let i = from; i < from + 600; i += 1) out[`a${i}`] = { sheet: { ...tiles, id: `h${i}` }, clips: [{ name: `x${i}`, frames: [0, 1], ms: [-1, 5] }] }; return out; };
  const link = createSceneLink(); link.scene(world({ layers: [], assets: batch(0) }), at(1)); link.scene(world({ layers: [], assets: batch(600) }), at(2)); link.scene(world({ layers: [], assets: batch(1200) }), at(3));
  const wm = createWorldMotion(source); for (const n of [1, 2]) wm.shore({ cols: 2, rows: 1, tileW: 16, tileH: 16, mapSeed: n, water: new Uint8Array([1, 0]) }, { ...style, shore: { foamPx: 999 } }, false);
  assert.deepEqual([link.notices.length, wm.notes.length], [1024, 1]); // the world-motion shore warning is once per field on its own too
});
test("QA r3 qfix: repeats inside one scene() call count toward the 1024 cap: 2 equal strip copies warn twice, then never; 1100 copies stop at exactly 1024, then never (step 33i r3)", () => {
  const copies = (n: number): SceneWorld => world({ layers: [], effects: [{ id: "e", castMs: 0, caster: "gone", at: { c: 1, r: 1 }, pieces: Array.from({ length: n }, (): FxPiece => ({ at: 0, ms: 1e9, sheet: { id: "s", columns: 1, fw: 8, fh: 8 }, clip: { name: "big", frames: Array.from({ length: 65 }, () => 0) }, draw_layer: "air" })) }] });
  const run = (ns: number[]): number[] => { const link = createSceneLink(); return ns.map((n, f) => { const n0 = link.notices.length; link.scene(copies(n), at(1 + f * 16)); return link.notices.length - n0; }); }; assert.deepEqual([run([2, 2, 2]), run([1100, 1100, 1100])], [[2, 0, 0], [1024, 0, 0]]);
});
