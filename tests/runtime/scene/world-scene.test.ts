import assert from "node:assert/strict";
import { test } from "node:test";
import { createClock } from "../../../src/core/clock/index.ts";
import { canvas2d } from "../../../src/runtime/canvas/canvas2d.ts";
import { createDriver, type HostEnv } from "../../../src/runtime/host/raf-driver.ts";
import { badMs, buildDrawList, chunkedList, clipMs, fitView, present, snapCamera, type Clip, type Overlay, type RenderScene, type Sheet } from "../../../src/runtime/render/index.ts";
import { createSceneLink, pickClip, type SceneAsset, type SceneUnit, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { FakeCanvas, type Raster } from "../canvas/fake-canvas.ts";
const sheet = (id: string, fw: number, fh: number, columns = 1): Sheet => ({ id, fw, fh, columns });
const paint = (fw: number, fh: number, frames: number, columns: number, salt: number): Raster => {
  const w = columns * fw, h = Math.ceil(frames / columns) * fh, px = new Uint32Array(w * h);
  for (let f = 0; f < frames; f += 1) for (let y = 0; y < fh; y += 1) for (let x = 0; x < fw; x += 1) px[(Math.floor(f / columns) * fh + y) * w + (f % columns) * fw + x] = (0xff000000 | ((salt & 255) << 16) | ((f & 255) << 8) | ((x & 15) << 4) | (y & 15)) >>> 0;
  return { w, h, px };
};
const bank = new Map<string, Raster>();
const remember = (id: string, fw: number, fh: number, frames = 1, columns = 1, salt = 1): Sheet => { bank.set(id, paint(fw, fh, frames, columns, salt)); return sheet(id, fw, fh, columns); };
const grid = (cols: number, rows: number, at: (c: number, r: number) => number | null): (number | null)[] => Array.from({ length: cols * rows }, (_, i) => at(i % cols, Math.floor(i / cols)));
const picture = (scene: RenderScene, t: number, chunked: boolean, x = 0, y = 0, w = 160, h = 160): FakeCanvas => {
  const fit = fitView(w, h, 1, scene.tileW, scene.tileH), cam = snapCamera(x, y, 1), canvas = new FakeCanvas();
  const r = canvas2d(canvas, { images: (id) => bank.get(id), makeCanvas: (cw, ch) => { const n = new FakeCanvas(); n.width = cw; n.height = ch; return n; }, buildsPerFrame: 99 });
  r.world(scene, 1); present(r, fit, (chunked ? chunkedList : buildDrawList)(scene, fit, cam, t, 10), "#000000"); return canvas;
};
const same = (a: FakeCanvas, b: FakeCanvas): void => { assert.equal(`${a.width}x${a.height}`, `${b.width}x${b.height}`); let bad = -1; for (let i = 0; i < a.px.length; i += 1) if (a.px[i] !== b.px[i]) { bad = i; break; } assert.equal(bad, -1); };
const pix = (c: FakeCanvas, x: number, y: number): number => c.px[y * c.width + x] ?? 0;
const map = (over: Partial<RenderScene> = {}): RenderScene => ({ cols: 20, rows: 20, tileW: 16, tileH: 16, mapSeed: 1, ground: [], above: [], standing: [], overlays: [], ...over });
const clip = (name: string, frames: readonly number[], extra: Partial<Clip> = {}): Clip => ({ name, frames, ...extra });
const unit = (id: string, over: Partial<SceneUnit> = {}): SceneUnit => ({ id, sprite: "hero", at: { c: 1, r: 1 }, offset: null, facing: "S", alive: true, ...over });
const world = (over: Partial<SceneWorld> = {}): SceneWorld => ({ cols: 20, rows: 20, tileW: 16, tileH: 16, mapSeed: 1, assets: {}, layers: [], units: [], objects: [], overlays: [], ...over });
const layer = (tileset: string | null, aboveUnits: boolean, visible: boolean, tiles: readonly (number | null)[]) => ({ tileset, aboveUnits, visible, tiles });
test("K2: animated tiles are never baked into chunks; uncovered water animates and matches the live picture (step 30)", () => {
  const g = remember("g", 16, 16, 16, 4, 1), a = remember("a", 16, 16, 4, 2, 2), water = clip("water", [8, 9], { ms: [200, 200] });
  const scene = map({ ground: [{ sheet: g, tiles: grid(20, 20, (c) => (c < 3 ? 8 : 1)), anims: { 8: water } }], above: [{ sheet: a, tiles: grid(20, 20, (c) => (c < 3 ? null : 1)) }] });
  const z0 = picture(scene, 0, true), z1 = picture(scene, 200, true); same(z0, picture(scene, 0, false)); same(z1, picture(scene, 200, false));
  assert.equal((pix(z0, 1, 1) >> 8) & 255, 8); assert.equal((pix(z1, 1, 1) >> 8) & 255, 9);
});
test("r27: an off-size tile sits bottom-left on its cell at native size, unclipped, overflowing up and right (step 30)", () => {
  const s = remember("big", 24, 32, 1, 1, 3), scene = map({ ground: [{ sheet: s, tiles: grid(20, 20, (c, r) => (c === 1 && r === 2 ? 0 : null)) }] });
  const cmd = buildDrawList(scene, fitView(64, 64, 1, 16, 16), snapCamera(0, 0, 1), 0, 10).cmds[0], pic = picture(scene, 0, false, 0, 0, 64, 64), src = bank.get("big");
  assert.deepEqual([cmd?.dx, cmd?.dy, cmd?.dw, cmd?.dh], [16, 16, 24, 32]); assert.equal(pix(pic, 39, 16), src?.px[23]); assert.equal(pix(pic, 16, 47), src?.px[31 * 24]);
});
test("r27: draw order is rows top to bottom then left to right, so a lower row covers an upper row's overflow (step 30)", () => {
  const A = remember("A", 24, 32, 1, 1, 4), B = remember("B", 24, 32, 1, 1, 5), C = remember("C", 24, 32, 1, 1, 6);
  const one = (sh: Sheet, c0: number, r0: number) => ({ sheet: sh, tiles: grid(20, 20, (c, r) => (c === c0 && r === r0 ? 0 : null)) });
  const scene = map({ ground: [one(A, 1, 1), one(B, 1, 2), one(C, 2, 2)] }), pic = picture(scene, 0, false, 0, 0, 80, 80);
  assert.deepEqual(buildDrawList(scene, fitView(80, 80, 1, 16, 16), snapCamera(0, 0, 1), 0, 10).cmds.map((c) => c.sheet), ["A", "B", "C"]);
  assert.equal(pix(pic, 20, 20), bank.get("B")?.px[4 * 24 + 4]); assert.equal(pix(pic, 36, 20), bank.get("C")?.px[4 * 24 + 4]);
});
test("r27: culling widens to rows below and columns to the left, so offscreen tiles still draw their overflow (step 30)", () => {
  const big = remember("cull", 40, 40, 1, 1, 7), scene = map({ ground: [{ sheet: big, tiles: grid(20, 20, (c, r) => (c === 0 && r === 8 ? 0 : null)) }] });
  const view = picture(scene, 0, false, 32, 0, 96, 112); assert.notEqual(pix(view, 0, 104) & 0xffffff, 0); same(picture(scene, 0, true, 32, 0, 96, 112), view);
  const wide = remember("w40", 40, 8, 1, 1, 8), tall = remember("h40", 8, 40, 1, 1, 9);
  const both = map({ ground: [{ sheet: wide, tiles: grid(20, 20, (c, r) => (c === 2 && r === 1 ? 0 : null)) }, { sheet: tall, tiles: grid(20, 20, (c, r) => (c === 5 && r === 6 ? 0 : null)) }] });
  const small = picture(both, 0, false, 64, 16, 40, 64), full = picture(both, 0, false, 0, 0, 320, 320);
  for (let y = 0; y < 64; y += 1) for (let x = 0; x < 40; x += 1) assert.equal(pix(small, x, y), pix(full, 64 + x, 16 + y));
});
test("r27: overflow crosses chunk edges because off-size layers are drawn live, never chunked (step 30)", () => {
  const g = remember("ground", 16, 16, 1, 1, 10), over = remember("over", 24, 32, 1, 1, 11);
  const scene = map({ ground: [{ sheet: g, tiles: grid(20, 20, () => 0) }, { sheet: over, tiles: grid(20, 20, (c, r) => (c === 15 && r === 16 ? 0 : null)) }] });
  const chunked = picture(scene, 0, true, 160, 192, 128, 128); same(chunked, picture(scene, 0, false, 160, 192, 128, 128));
  assert.equal(pix(chunked, 80, 50), bank.get("over")?.px[2 * 24]); assert.equal(pix(chunked, 80, 66), bank.get("over")?.px[18 * 24]);
  for (const sh of [remember("tall", 16, 40, 1, 1, 12), remember("wide", 40, 16, 1, 1, 13)]) { const one = map({ ground: [{ sheet: sh, tiles: grid(20, 20, (c, r) => (c === 15 && r === 16 ? 0 : null)) }] }); same(picture(one, 0, true, 160, 192, 160, 160), picture(one, 0, false, 160, 192, 160, 160)); }
});
test("odd sizes: the r27 bottom-left anchor is exact (no rounding); a sprite centred on an odd tile lands on a half art px that rounds up before scaling (step 30)", () => {
  const odd = map({ cols: 8, rows: 8, tileW: 15, tileH: 15, ground: [{ sheet: remember("odd", 17, 21, 1, 1, 14), tiles: grid(8, 8, (c, r) => (c === 2 && r === 3 ? 0 : null)) }] });
  const cmd = buildDrawList(odd, fitView(200, 200, 2, 15, 15), snapCamera(0, 0, 2), 0, 10).cmds[0]; assert.equal(cmd?.dx, 60); assert.equal(cmd?.dy, 78);
  const hero = map({ cols: 4, rows: 4, tileW: 15, tileH: 15, standing: [{ kind: "unit", sheet: remember("spr", 15, 15, 1, 1, 15), c: 0, r: 0, frame: 0 }] });
  assert.equal(buildDrawList(hero, fitView(80, 80, 2, 15, 15), snapCamera(0, 0, 2), 0, 10).cmds[0]?.dx, 2);
});
test("r26 clips: short ms[] pads with its last value, long ms[] is cut, empty ms[] means fps; fps may be fractional, a bad fps plays at 8 (step 30)", () => {
  const ms = (c: Clip): number[] => clipMs(c, 10);
  assert.deepEqual(ms(clip("a", [0, 1, 2], { ms: [100, 300] })), [100, 300, 300]); assert.deepEqual(ms(clip("a", [0, 1], { ms: [100, 200, 900] })), [100, 200]);
  assert.deepEqual(ms(clip("a", [0, 1], { ms: [], fps: 4 })), [250, 250]); assert.deepEqual(ms(clip("a", [0], { fps: 2.5 })), [400]); assert.deepEqual(ms(clip("a", [0], { fps: 0.5 })), [2000]); assert.deepEqual(ms(clip("a", [0])), [130]);
  for (const fps of [0, -2, Number.NaN, Number.POSITIVE_INFINITY, "8" as unknown as number]) assert.deepEqual(ms(clip("a", [0], { fps })), [130]);
});
test("r26 clips: a bad fps warns clipFpsInvalid once and never fails the load (ms[] length and ms-over-fps warn too); the stored clip is passed on unchanged (step 30)", () => {
  const badFps = clip("bad", [0], { fps: 0 }), short = clip("short", [0, 1, 2], { ms: [100, 200] }), both = clip("both", [0, 1], { ms: [100, 100], fps: 8 });
  const asset: SceneAsset = { sheet: remember("u", 16, 16), clips: [badFps, short, both, clip("empty", [0], { ms: [], fps: 4 }), clip("half", [0], { fps: 0.5 })] };
  const link = createSceneLink(), layers: SceneWorld["layers"] = [], w = world({ assets: { u: asset }, layers, units: [unit("h", { sprite: "u", action: "bad" })] });
  link.scene(w); link.scene(w); link.scene(world({ assets: { u: asset }, layers, units: [unit("h", { sprite: "u", action: "bad" })] }));
  assert.deepEqual(link.notices.map((n) => n.code), ["clipFpsInvalid", "clipMsLength", "clipFpsIgnored"]); assert.equal(link.scene(w).standing[0]?.clip, badFps); assert.equal(badFps.fps, 0);
});
test("r29 clips: an ms[] with any entry that is not a whole number >= 1 is ignored whole; clipMsInvalid once per clip, before clipMsLength and clipFpsIgnored (step 30)", () => {
  for (const bad of [Number.NaN, 0, -5, 2.5, "9" as unknown as number, Number.POSITIVE_INFINITY]) { assert.equal(badMs([bad]), true); assert.deepEqual(clipMs(clip("x", [0, 1], { ms: [bad, 1], fps: 4 }), 10), [250, 250]); assert.deepEqual(clipMs(clip("y", [0], { ms: [bad] }), 10), [130]); }
  const nan = clip("n", [0, 1], { ms: [Number.NaN, 10], fps: 4 }), zero = clip("z", [0], { ms: [0] }), neg = clip("m", [0], { ms: [-5] }), frac = clip("f", [0, 1], { ms: [2.5], fps: 8 }), inf = clip("i", [0], { ms: [Number.POSITIVE_INFINITY] });
  const a: SceneAsset = { sheet: remember("ra", 16, 16), clips: [nan, zero, neg] }, b: SceneAsset = { sheet: remember("rb", 16, 16), clips: [frac, inf] }, share: SceneAsset = { sheet: remember("rc", 16, 16), clips: [nan] };
  const link = createSceneLink(), layers: SceneWorld["layers"] = []; link.scene(world({ assets: { a, b }, layers })); link.scene(world({ assets: { a, b, share }, layers }));
  assert.deepEqual(link.notices.map((n) => n.code), ["clipMsInvalid", "clipMsInvalid", "clipMsInvalid", "clipMsInvalid", "clipMsInvalid"]); assert.ok(Number.isNaN(nan.ms?.[0]));
});
test("the link maps layers, units, objects and overlays: aboveUnits goes above, hidden or tileset-less layers drop, tileProps.anim becomes anims (step 30)", () => {
  const g = remember("g", 16, 16), ga = remember("ga", 16, 16), tree = remember("tree", 16, 16), hero = remember("lhero", 16, 16), water = clip("water", [8, 9], { ms: [200, 200] }), tiles = grid(20, 20, () => 8);
  const assets: SceneWorld["assets"] = { g: { sheet: g, clips: [water], tileProps: { 8: { anim: "water" } } }, ga: { sheet: ga }, tree: { sheet: tree }, hero: { sheet: hero, clips: [clip("idle", [1])] } };
  const overlays: Overlay[] = [{ band: "ui", sheet: g, x: 1, y: 2, frame: 0 }];
  const scene = createSceneLink().scene(world({ assets, overlays, layers: [layer("g", false, true, tiles), layer("nope", false, true, tiles), layer(null, true, true, tiles), layer("ga", true, false, tiles), layer("ga", true, true, tiles)], units: [unit("h", { at: { c: 2, r: 3 }, offset: { dx: 0.5, dy: -0.25 }, facing: "E" }), unit("dead", { alive: false }), unit("dying", { alive: false, action: "die" }), unit("gone", { sprite: "missing" })], objects: [{ assetId: "tree", at: { c: 4, r: 5 }, z: 2 }, { assetId: "missing", at: { c: 0, r: 0 } }] }));
  assert.deepEqual([scene.ground.map((l) => l.sheet.id), scene.above.map((l) => l.sheet.id)], [["g"], ["ga"]]); assert.equal(scene.ground[0]?.anims?.[8], water); assert.equal(scene.overlays, overlays);
  assert.deepEqual(scene.standing.map((s) => `${s.kind}:${s.key ?? ""}:${s.sheet.id}`), ["object::tree", "unit:dying:lhero", "unit:h:lhero"]); assert.equal(scene.standing[0]?.z, 2); assert.equal(scene.standing[2]?.c, 2); assert.equal(scene.standing[2]?.dx, 8); assert.equal(scene.standing[2]?.dy, -4);
});
test("a stable scene: the same world rebuilt each frame returns the same scene object, so a still picture settles to 0 draws a second (step 30)", async () => {
  const g = remember("sg", 16, 16), hero = remember("sh", 16, 16), idle = clip("idle", [0]), move = clip("move", [1]);
  const assets: SceneWorld["assets"] = { sg: { sheet: g }, hero: { sheet: hero, clips: [idle, move] } }, layers = [layer("sg", false, true, grid(20, 20, () => 0))], late = [layer("later", false, true, grid(20, 20, () => 0))];
  const h = unit("h"), link = createSceneLink(), base = world({ assets, layers, units: [h] }), first = link.scene(base);
  assert.equal(link.scene({ ...base, units: [{ ...h }] }), first); const moved = link.scene({ ...base, units: [{ ...h, at: { c: 3, r: 1 } }] }); assert.notEqual(moved, first); assert.equal(moved.ground, first.ground);
  const again = createSceneLink(), settled = again.scene(base);
  for (const next of [world({ assets, layers, units: [{ ...h, facing: "N" }] }), world({ assets, layers, units: [{ ...h, action: "move" }] }), world({ assets, layers, units: [{ ...h, offset: { dx: 1, dy: 0 } }] }), world({ assets, layers, units: [{ ...h, sprite: "sg" }] }), world({ assets, layers, units: [h], mapSeed: 2 }), world({ assets, layers, units: [h], cols: 19 }), world({ assets, layers, units: [h], tileW: 8 }), world({ assets, layers, units: [h], objects: [{ assetId: "sg", at: { c: 0, r: 0 } }] }), world({ assets, layers, units: [h], overlays: [{ band: "ui", sheet: g, x: 0, y: 0, frame: 0 }] })]) assert.notEqual(again.scene(next), settled);
  const hold = createSceneLink(), kept = hold.scene(base); assert.equal(hold.scene({ ...base, objects: [], overlays: [] }), kept);
  const a = unit("a", { sprite: "hero", at: { c: 2, r: 2 }, offset: { dx: 0, dy: 0 }, facing: "S", action: "idle" }), b = unit("b", { at: { c: 0, r: 0 }, facing: null });
  assert.equal(hold.scene({ ...base, units: [b, a] }), hold.scene({ ...base, units: [a, b] })); assert.notEqual(hold.scene({ ...base, units: [a, b] }), hold.scene({ ...base, units: [unit("a|hero|2,2|0,0|S|idle;b", { at: { c: 0, r: 0 }, offset: { dx: 0, dy: 0 }, facing: null })] }));
  const appear = createSceneLink(); assert.equal(appear.scene(world({ assets, layers: late })).ground.length, 0); assert.equal(appear.scene(world({ assets: { ...assets, later: { sheet: g } }, layers: late })).ground.length, 1);
  const q = new Map<number, (t: number) => void>(); let seq = 1, ts = 0; const env = { requestAnimationFrame: (cb: (t: number) => void) => { const id = seq++; q.set(id, cb); return id; }, cancelAnimationFrame: (id: number) => { q.delete(id); }, devicePixelRatio: 1, document: { visibilityState: "visible", addEventListener() {}, removeEventListener() {}, createElement: () => new FakeCanvas() } } as HostEnv;
  const live = createSceneLink(), driver = createDriver({ env, canvas: Object.assign(new FakeCanvas(), { clientWidth: 64, clientHeight: 64 }), clock: createClock(), view: () => ({ scene: live.scene({ ...base, units: [{ ...h }] }), x: 0, y: 0, s: 1 }), load: (id) => Promise.resolve(bank.get(id) ?? {}) });
  driver.start(); const step = (): void => { const id = q.keys().next().value; if (id === undefined) return; const cb = q.get(id); q.delete(id); cb?.(ts); ts += 1000 / 60; };
  for (let i = 0; i < 8; i += 1) step(); await new Promise((done) => { setImmediate(done); }); for (let i = 0; i < 90; i += 1) step(); const draws = driver.stats.draws; for (let i = 0; i < 60; i += 1) step(); assert.equal(driver.stats.draws, draws);
});
test("standing order is stable: objects in document order then units by id; a walking unit keeps its animation phase across cells; dx does not break c ties (step 30)", () => {
  const walk = clip("move", [0, 1, 2, 3], { ms: [100, 100, 100, 100] }), body = remember("body", 16, 16, 4, 4, 20);
  const assets: SceneWorld["assets"] = { r: { sheet: remember("r", 16, 16) }, h: { sheet: remember("h", 16, 16) }, a: { sheet: remember("a", 16, 16, 4, 4, 21), clips: [walk] }, m: { sheet: remember("m", 16, 16, 4, 4, 22), clips: [walk] }, z: { sheet: remember("z", 16, 16, 4, 4, 23), clips: [walk] }, body: { sheet: body, clips: [walk] } };
  const link = createSceneLink(), units = ["z", "a", "m"].map((id) => unit(id, { sprite: id, action: "move" }));
  const scene = link.scene(world({ assets, objects: [{ assetId: "r", at: { c: 0, r: 0 } }, { assetId: "h", at: { c: 1, r: 0 } }], units }));
  assert.deepEqual(scene.standing.map((s) => s.sheet.id), ["r", "h", "a", "m", "z"]);
  const at = (c: number, t: number): number => buildDrawList(link.scene(world({ assets, units: [unit("w", { sprite: "body", at: { c, r: 0 }, action: "move" })] })), fitView(160, 64, 1, 16, 16), snapCamera(0, 0, 1), t, 10).cmds.find((cmd) => cmd.sheet === "body")?.sx ?? -1;
  for (const t of [0, 50, 100, 150, 250, 350]) assert.equal(at(2, t), at(5, t));
  const order = buildDrawList(map({ standing: [{ kind: "unit", sheet: body, c: 1, r: 0, dx: 20, frame: 0, key: "w" }, { kind: "object", sheet: remember("obj", 16, 16), c: 2, r: 0, frame: 0 }] }), fitView(96, 32, 1, 16, 16), snapCamera(0, 0, 1), 0, 10);
  assert.deepEqual(order.cmds.map((c) => c.sheet), ["body", "obj"]);
});
test("an overlay is not drawn before its startMs and wakes the frame loop at startMs (step 30)", () => {
  const sh = remember("ov", 16, 16, 2, 2, 21), ov: Overlay = { band: "fxAir", sheet: sh, x: 0, y: 0, clip: clip("blink", [0, 1], { ms: [100, 100] }), startMs: 500 };
  const at = (t: number, x = 0) => buildDrawList(map({ overlays: [{ ...ov, x }] }), fitView(64, 64, 1, 16, 16), snapCamera(0, 0, 1), t, 10);
  const early = at(499), on = at(500); assert.equal(early.cmds.length, 0); assert.equal(early.dueMs, 500); assert.equal(on.cmds.length, 1); assert.equal(on.dueMs, 600); assert.equal(at(499, 900).dueMs, Infinity);
});
test("§7.3 clip fallback: exact, bare facing for move, mirror unless noMirror, down then bare then left/right/up, idle, die→hit→idle, first frame (step 30)", () => {
  const names = (...xs: string[]): SceneAsset => ({ sheet: sheet("p", 16, 16), clips: xs.map((name, i) => clip(name, [i + 1])) });
  const got = (asset: SceneAsset, action: string, facing: SceneUnit["facing"]): string => { const p = pickClip(asset, action, facing); return `${p.clip?.name ?? "-"}:${p.frame ?? "-"}:${p.flipX}`; };
  assert.deepEqual([
    got(names("move-right"), "move", "E"), got(names("right"), "move", "E"), got(names("move-left"), "move", "E"), got({ ...names("move-left"), noMirror: true }, "move", "E"),
    got(names("idle-down", "idle"), "idle", "N"), got(names("attack"), "attack", "S"), got(names("attack-left"), "attack", "S"), got(names("attack-right"), "attack", "S"),
    got(names("attack-up"), "attack", "S"), got(names("idle-down"), "dance", "S"), got(names("hit-down", "idle"), "die", "S"), got(names("idle"), "die", "W"),
    got(names("zzz"), "dance", "N"), got(names(), "dance", null),
  ], ["move-right:-:false", "right:-:false", "move-left:-:true", "move-left:-:false", "idle-down:-:false", "attack:-:false", "attack-left:-:false", "attack-right:-:false", "attack-up:-:false", "idle-down:-:false", "hit-down:-:false", "idle:-:false", "-:1:false", "-:0:false"]);
});
