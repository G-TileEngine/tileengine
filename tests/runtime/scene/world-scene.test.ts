import assert from "node:assert/strict";
import { test } from "node:test";
import { createClock } from "../../../src/core/clock/index.ts";
import { canvas2d } from "../../../src/runtime/canvas/canvas2d.ts";
import { createDriver, type HostEnv } from "../../../src/runtime/host/raf-driver.ts";
import { badMs, buildDrawList, chunkedList, clipMs, fitView, present, snapCamera, type Clip, type RenderScene, type Sheet } from "../../../src/runtime/render/index.ts";
import { createSceneLink, pickClip, type SceneAsset, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { FakeCanvas, type Raster } from "../canvas/fake-canvas.ts";

/** Every frame pixel is unique: colour = sheet salt + frame + position, so a wrong frame, offset or flip shows. */
const art = (salt: number, fw: number, fh: number, n = 16): Raster => {
  const w = fw * 4, h = fh * Math.ceil(n / 4), px = new Uint32Array(w * h);
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) px[y * w + x] = ((0xff << 24) | (salt << 16) | ((Math.floor(y / fh) * 4 + Math.floor(x / fw)) << 10) | ((y % fh) << 5) | (x % fw)) >>> 0;
  return { w, h, px };
};
const sheet = (id: string, fw = 16, fh = 16): Sheet => ({ id, fw, fh, columns: 4 });
const water: Clip = { name: "water", frames: [8, 9], ms: [200, 200] };
const map = (over: Partial<RenderScene>): RenderScene => ({ cols: 20, rows: 20, tileW: 16, tileH: 16, mapSeed: 3, ground: [], above: [], standing: [], overlays: [], ...over });
const blank = (n: number): (number | null)[] => Array.from({ length: n }, () => null);
const put = (cols: number, n: number, at: readonly [number, number, number][]): (number | null)[] => { const t = blank(n); for (const [c, r, v] of at) t[r * cols + c] = v; return t; };
/** One picture: `chunked` goes through the chunk cache like the driver; otherwise every tile is drawn live. */
const picture = (sc: RenderScene, bank: ReadonlyMap<string, Raster>, chunked: boolean, x = 0, y = 0, tMs = 0, w = 160, h = 96): { px: Uint32Array; w: number } => {
  const host = Object.assign(new FakeCanvas(), {}); host.width = w; host.height = h;
  const fit = fitView(w, h, 1, sc.tileW, sc.tileH), cam = snapCamera(x, y, 1), be = canvas2d(host, { images: (id) => bank.get(id), makeCanvas: (cw, ch) => Object.assign(new FakeCanvas(), { width: cw, height: ch }), buildsPerFrame: 100 });
  be.world(sc, 1); present(be, fit, chunked ? chunkedList(sc, fit, cam, tMs, 10) : buildDrawList(sc, fit, cam, tMs, 10), "#000000");
  return { px: host.px, w };
};
const at = (p: { px: Uint32Array; w: number }, x: number, y: number): number => p.px[y * p.w + x] ?? -1;
const tileOf = (v: number): number => (v >> 10) & 63;
const same = (a: { px: Uint32Array }, b: { px: Uint32Array }): void => { let n = a.px.length === b.px.length ? 0 : 1; for (let i = 0; i < a.px.length; i += 1) if (a.px[i] !== b.px[i]) n += 1; assert.equal(n, 0); };

test("K2: animated tiles are never baked into chunks; uncovered water animates and matches the live picture (step 30)", () => {
  const bank = new Map([["g", art(1, 16, 16)], ["a", art(2, 16, 16)]]), n = 400;
  const sc = map({ ground: [{ sheet: sheet("g"), tiles: Array.from({ length: n }, (_, i) => (i % 20 < 3 ? 8 : 1)), anims: { 8: water } }], above: [{ sheet: sheet("a"), tiles: put(20, n, [[0, 0, 2], [1, 1, 2]]) }] });
  const t0 = picture(sc, bank, true, 0, 0, 0), t1 = picture(sc, bank, true, 0, 0, 200);
  same(t0, picture(sc, bank, false, 0, 0, 0)); same(t1, picture(sc, bank, false, 0, 0, 200));
  assert.equal(tileOf(at(t0, 40, 40)), 8); assert.equal(tileOf(at(t1, 40, 40)), 9); assert.equal(tileOf(at(t1, 3, 3)), 2);
});
test("r27: an off-size tile sits bottom-left on its cell at native size, unclipped, overflowing up and right (step 30)", () => {
  const sc = map({ ground: [{ sheet: sheet("big", 24, 32), tiles: put(20, 400, [[1, 2, 5]]) }] });
  const cmd = buildDrawList(sc, fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 0, 10).cmds[0];
  assert.deepEqual(cmd && [cmd.dx, cmd.dy, cmd.dw, cmd.dh, cmd.sw, cmd.sh], [16, 16, 24, 32, 24, 32]);
  const p = picture(sc, new Map([["big", art(3, 24, 32)]]), false); assert.equal(at(p, 39, 16) & 0x3ff, (0 << 5) | 23); assert.equal(at(p, 16, 47) & 0x3ff, (31 << 5) | 0);
});
test("r27: draw order is rows top to bottom then left to right, so a lower row covers an upper row's overflow (step 30)", () => {
  const sc = map({ ground: [{ sheet: sheet("big", 24, 32), tiles: put(20, 400, [[1, 1, 5], [1, 2, 6], [2, 2, 7]]) }] });
  const cmds = buildDrawList(sc, fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 0, 10).cmds;
  assert.deepEqual(cmds.map((c) => [c.dx, c.dy]), [[16, 0], [16, 16], [32, 16]]);
  const p = picture(sc, new Map([["big", art(3, 24, 32)]]), false); assert.equal(tileOf(at(p, 20, 20)), 6); assert.equal(tileOf(at(p, 36, 20)), 7);
});
test("r27: culling widens to rows below and columns to the left, so offscreen tiles still draw their overflow (step 30)", () => {
  const sc = map({ ground: [{ sheet: sheet("big", 40, 40), tiles: put(20, 400, [[0, 8, 5], [3, 1, 6]]) }] });
  const p = picture(sc, new Map([["big", art(3, 40, 40)]]), false, 32, 0, 0, 96, 112);
  assert.equal(tileOf(at(p, 2, 104)), 5); assert.equal(tileOf(at(p, 30, 2)), 6);
  same(p, picture(sc, new Map([["big", art(3, 40, 40)]]), true, 32, 0, 0, 96, 112));
  for (const [fw, fh] of [[40, 8], [8, 40]] as const) { const s2 = map({ ground: [{ sheet: sheet("o", fw, fh), tiles: put(20, 400, [[2, 2, 5], [5, 6, 6]]) }] }), b2 = new Map([["o", art(3, fw, fh)]]), small = picture(s2, b2, false, 64, 16, 0, 40, 64), big = picture(s2, b2, false, 0, 0, 0, 320, 320); let n = 0; for (let y = 0; y < 64; y += 1) for (let x = 0; x < 40; x += 1) if (at(small, x, y) !== at(big, x + 64, y + 16)) n += 1; assert.equal(n, 0); }
});
test("r27: overflow crosses chunk edges because off-size layers are drawn live, never chunked (step 30)", () => {
  const bank = new Map([["big", art(3, 24, 32)], ["g", art(1, 16, 16)]]);
  const sc = map({ ground: [{ sheet: sheet("g"), tiles: Array.from({ length: 400 }, () => 1) }, { sheet: sheet("big", 24, 32), tiles: put(20, 400, [[15, 16, 5]]) }] });
  const live = picture(sc, bank, false, 160, 192, 0, 160, 96), cut = picture(sc, bank, true, 160, 192, 0, 160, 96);
  same(cut, live); assert.equal(tileOf(at(cut, 90, 50)), 5); assert.equal(tileOf(at(cut, 82, 66)), 5);
  for (const [fw, fh] of [[16, 40], [40, 16]] as const) { const b2 = new Map([["o", art(5, fw, fh)], ["g", art(1, 16, 16)]]), s2 = map({ ground: [sc.ground[0] as RenderScene["ground"][number], { sheet: sheet("o", fw, fh), tiles: put(20, 400, [[15, 16, 5]]) }] }); same(picture(s2, b2, true, 160, 192, 0, 160, 96), picture(s2, b2, false, 160, 192, 0, 160, 96)); }
});
test("odd sizes: the r27 bottom-left anchor is exact (no rounding); a sprite centred on an odd tile lands on a half art px that rounds up before scaling (step 30)", () => {
  const sc = map({ tileW: 15, tileH: 15, ground: [{ sheet: sheet("big", 17, 21), tiles: put(20, 400, [[2, 3, 5]]) }], standing: [{ kind: "object", sheet: sheet("s", 15, 15), c: 0, r: 0 }] });
  const cmds = buildDrawList(sc, fitView(150, 90, 2, 15, 15), snapCamera(0, 0, 2), 0, 10).cmds;
  assert.deepEqual(cmds.map((c) => [c.dx, c.dy]), [[60, 78], [2, 0]]);
});
test("r26 clips: short ms[] pads with its last value, long ms[] is cut, empty ms[] means fps; fps may be fractional, a bad fps plays at 8 (step 30)", () => {
  assert.deepEqual(clipMs({ name: "a", frames: [0, 1, 2], ms: [100, 300] }, 10), [100, 300, 300]);
  assert.deepEqual(clipMs({ name: "a", frames: [0, 1], ms: [100, 200, 900] }, 10), [100, 200]);
  assert.deepEqual(clipMs({ name: "a", frames: [0, 1], ms: [], fps: 4 }, 10), [250, 250]);
  assert.deepEqual(clipMs({ name: "a", frames: [0], fps: 2.5 }, 10), [400]); assert.deepEqual(clipMs({ name: "a", frames: [0], fps: 0.5 }, 10), [2000]); assert.deepEqual(clipMs({ name: "a", frames: [0] }, 10), [130]);
  for (const fps of [0, -2, Number.NaN, Infinity, "8" as unknown as number]) assert.deepEqual(clipMs({ name: "a", frames: [0], fps }, 10), [130]);
});
test("r26 clips: a bad fps warns clipFpsInvalid once and never fails the load (ms[] length and ms-over-fps warn too); the stored clip is passed on unchanged (step 30)", () => {
  const bad: Clip = { name: "idle-down", frames: [0, 1], fps: 0 }, odd: Clip = { name: "run", frames: [0, 1], ms: [100] }, ok: Clip = { name: "x", frames: [0], fps: 2.5 }, both: Clip = { name: "walk", frames: [0], fps: 4, ms: [100] }, quiet: Clip[] = [{ name: "e", frames: [0, 1], ms: [], fps: 4 }, { name: "slow", frames: [0], fps: 0.5 }];
  const assets = { hero: { sheet: sheet("h"), clips: [bad, odd, ok, both] }, calm: { sheet: sheet("c"), clips: quiet } }, link = createSceneLink(), w = world({ assets, units: [unit("u1")] });
  const sc = link.scene(w); link.scene({ ...w, units: [unit("u1", 3)] }); link.scene({ ...w, assets: { ...assets, more: hero } });
  assert.deepEqual(link.notices.map((n) => n.code), ["clipFpsInvalid", "clipMsLength", "clipFpsIgnored"]); assert.equal(sc.standing[0]?.clip, bad); assert.equal(bad.fps, 0);
});
test("r29 clips: an ms[] with any entry that is not a whole number >= 1 is ignored whole; clipMsInvalid once per clip, before clipMsLength and clipFpsIgnored (step 30)", () => {
  for (const v of [Number.NaN, 0, -5, 2.5, "9" as unknown as number, Infinity]) { assert.deepEqual(clipMs({ name: "a", frames: [0, 1], ms: [100, v], fps: 4 }, 10), [250, 250]); assert.deepEqual(clipMs({ name: "a", frames: [0], ms: [v] }, 10), [130]); assert.equal(badMs([100, v]), true); }
  const c1: Clip = { name: "a", frames: [0, 1, 2], ms: [100, Number.NaN], fps: 4 }, cs: Clip[] = [c1, ...[0, -5, 2.5, "9" as unknown as number].map((v, i) => ({ name: `b${i}`, frames: [0], ms: [v] }))], link = createSceneLink();
  link.scene(world({ assets: { hero: { sheet: sheet("h"), clips: cs } } })); link.scene(world({ assets: { hero: { sheet: sheet("h"), clips: cs }, twin: { sheet: sheet("t"), clips: [c1] } } }));
  assert.deepEqual(link.notices.map((n) => `${n.code}:${["a", "b0", "b1", "b2", "b3"].find((c) => new RegExp(`\\b${c}\\b`).test(n.message)) ?? ""}`), ["clipMsInvalid:a", "clipMsInvalid:b0", "clipMsInvalid:b1", "clipMsInvalid:b2", "clipMsInvalid:b3"]); assert.equal(Number.isNaN(c1.ms?.[1]), true);
});
const unit = (id: string, c = 2, over: Partial<SceneWorld["units"][number]> = {}): SceneWorld["units"][number] => ({ id, sprite: "hero", at: { c, r: 2 }, offset: null, facing: "S", alive: true, ...over });
const hero: SceneAsset = { sheet: sheet("h"), clips: [{ name: "idle-down", frames: [0, 1, 2, 3], ms: [70, 90, 110, 130] }] };
const world = (over: Partial<SceneWorld>): SceneWorld => ({ cols: 8, rows: 8, tileW: 16, tileH: 16, mapSeed: 9, assets: { hero }, layers: [], units: [], objects: [], overlays: [], ...over });
test("the link maps layers, units, objects and overlays: aboveUnits goes above, hidden or tileset-less layers drop, tileProps.anim becomes anims (step 30)", () => {
  const t = blank(64), assets = { hero, g: { sheet: sheet("g"), clips: [water], tileProps: { 8: { anim: "water" } } }, ga: { sheet: sheet("ga") }, rock: { sheet: sheet("r") } };
  const ov = [{ band: "ui" as const, sheet: sheet("r"), x: 1, y: 2 }];
  const sc = createSceneLink().scene(world({ tileH: 8, assets, overlays: ov, objects: [{ assetId: "rock", at: { c: 4, r: 1 }, z: 2 }], units: [unit("b", 1, { offset: { dx: 0.5, dy: -0.25 } }), unit("a", 5), unit("dead", 3, { alive: false }), unit("dying", 6, { alive: false, action: "die" })],
    layers: [{ tileset: "g", aboveUnits: false, visible: true, tiles: t }, { tileset: "ga", aboveUnits: true, visible: true, tiles: t }, { tileset: "g", aboveUnits: false, visible: false, tiles: t }, { tileset: null, aboveUnits: false, visible: true, tiles: t }] }));
  assert.deepEqual([sc.ground.map((l) => l.sheet.id), sc.above.map((l) => l.sheet.id)], [["g"], ["ga"]]); assert.equal(sc.ground[0]?.anims?.[8], water); assert.equal(sc.overlays, ov);
  assert.deepEqual(sc.standing.map((s) => [s.kind, s.key ?? "", s.c, s.dx ?? 0, s.dy ?? 0, s.z ?? 0]), [["object", "", 4, 0, 0, 2], ["unit", "a", 5, 0, 0, 0], ["unit", "b", 1, 8, -2, 0], ["unit", "dying", 6, 0, 0, 0]]);
});
test("a stable scene: the same world rebuilt each frame returns the same scene object, so a still picture settles to 0 draws a second (step 30)", () => {
  const link = createSceneLink(), layers = [{ tileset: "g", aboveUnits: false, visible: true, tiles: Array.from({ length: 64 }, () => 1) }], assets = { hero: { sheet: sheet("h") }, g: { sheet: sheet("g") } }, objects: SceneWorld["objects"] = [], overlays: SceneWorld["overlays"] = [];
  const frame = (c = 2): SceneWorld => world({ assets, layers, objects, overlays, units: [unit("u", c)] });
  const a = link.scene(frame()); assert.equal(link.scene(frame()), a); const moved = link.scene(frame(3)); assert.notEqual(moved, a); assert.equal(moved.ground, a.ground);
  const bumps = (w: SceneWorld): boolean => { const l = createSceneLink(), b = l.scene(frame(3)); return l.scene(frame(3)) === b && l.scene(w) !== b; }; for (const u of [{ facing: "E" as const }, { action: "move" }, { offset: { dx: 0.5, dy: 0 } }, { sprite: "g" }]) assert.ok(bumps(world({ assets, layers, objects, overlays, units: [unit("u", 3, u)] })));
  for (const w of [{ mapSeed: 1 }, { cols: 9 }, { layers: [...layers] }, { tileW: 8 }, { objects: [{ assetId: "g", at: { c: 0, r: 0 } }] }, { overlays: [{ band: "ui" as const, sheet: sheet("g"), x: 0, y: 0 }] }]) assert.ok(bumps({ ...frame(3), ...w })); const late = createSceneLink(), lt = late.scene(world({ assets: { hero }, layers, objects, overlays })); assert.equal(late.scene(world({ assets: { ...assets }, layers, objects, overlays })).ground.length - lt.ground.length, 1);
  const settled = link.scene(frame(3)); assert.equal(link.scene({ ...frame(3), objects: [], overlays: [] }), settled);
  const ids = createSceneLink(), two = ids.scene(world({ assets, layers, units: [unit("a"), unit("b")] })); assert.equal(ids.scene(world({ assets, layers, units: [unit("b"), unit("a")] })), two); assert.notEqual(ids.scene(world({ assets, layers, units: [unit('a|hero|2,2|0,0|S|idle;b')] })), two);
  const queue: ((ts: number) => void)[] = [], view = Object.assign(new FakeCanvas(), { clientWidth: 128, clientHeight: 128 });
  const env: HostEnv = { requestAnimationFrame: (cb) => queue.push(cb), cancelAnimationFrame: () => {}, devicePixelRatio: 1, document: { visibilityState: "visible", addEventListener: () => {}, removeEventListener: () => {}, createElement: () => new FakeCanvas() } };
  const bank = new Map([["h", art(4, 16, 16)], ["g", art(1, 16, 16)]]), driver = createDriver({ env, canvas: view, clock: createClock(), view: () => ({ scene: link.scene(frame(3)), x: 0, y: 0, s: 1 }), load: (id) => Promise.resolve(bank.get(id) ?? {}) });
  let ts = 0; const run = (n: number): void => { for (let i = 0; i < n; i += 1) { const cb = queue.shift(); ts += 1000 / 60; cb?.(ts); } };
  driver.start(); run(1); return new Promise<void>((done) => { setImmediate(done); }).then(() => { run(30); const d = driver.stats.draws; assert.ok(d >= 2); run(60); assert.equal(driver.stats.draws - d, 0); assert.equal(driver.stats.failed + driver.stats.errors, 0); });
});
test("standing order is stable: objects in document order then units by id; a walking unit keeps its animation phase across cells; dx does not break c ties (step 30)", () => {
  const link = createSceneLink(), fit = fitView(128, 128, 1, 16, 16), cam = snapCamera(0, 0, 1);
  const phase = (c: number, t: number): number => buildDrawList(link.scene(world({ units: [unit("u", c)] })), fit, cam, t, 10).cmds[0]?.sx ?? -1;
  for (const t of [0, 70, 160, 290, 400, 777]) assert.equal(phase(2, t), phase(5, t));
  const sc = map({ cols: 8, rows: 8, standing: [{ kind: "unit", sheet: sheet("h"), c: 1, r: 2, dx: 20, key: "u" }, { kind: "object", sheet: sheet("r"), c: 2, r: 2 }] });
  assert.deepEqual(buildDrawList(sc, fit, cam, 0, 10).cmds.map((c) => c.sheet), ["h", "r"]);
  const order = createSceneLink().scene(world({ assets: { hero, r: { sheet: sheet("r") } }, units: [unit("z"), unit("m"), unit("a")], objects: [{ assetId: "r", at: { c: 1, r: 1 } }, { assetId: "hero", at: { c: 0, r: 0 } }] }));
  assert.deepEqual(order.standing.map((s) => s.key ?? s.sheet.id), ["r", "h", "a", "m", "z"]);
});
test("an overlay is not drawn before its startMs and wakes the frame loop at startMs (step 30)", () => {
  const sc = map({ overlays: [{ band: "fxAir", sheet: sheet("fx"), x: 0, y: 0, startMs: 500, clip: { name: "boom", frames: [0, 1], ms: [100, 100] } }] }), fit = fitView(64, 64, 1, 16, 16), cam = snapCamera(0, 0, 1);
  const early = buildDrawList(sc, fit, cam, 499, 10); assert.equal(early.cmds.length, 0); assert.equal(early.dueMs, 500); assert.equal(buildDrawList(map({ overlays: [{ ...(sc.overlays[0] as RenderScene["overlays"][number]), x: 900 }] }), fit, cam, 499, 10).dueMs, Infinity);
  const on = buildDrawList(sc, fit, cam, 500, 10); assert.equal(on.cmds.length, 1); assert.equal(on.dueMs, 600);
});
test("§7.3 clip fallback: exact, bare facing for move, mirror unless noMirror, down then bare then left/right/up, idle, die→hit→idle, first frame (step 30)", () => {
  const c = (...names: string[]): SceneAsset => ({ sheet: sheet("x"), clips: names.map((name, i) => ({ name, frames: [i * 2 + 1] })) });
  const name = (a: SceneAsset, act: string, f: "N" | "E" | "S" | "W" | null): string => { const p = pickClip(a, act, f); return `${p.clip?.name ?? `#${p.frame}`}${p.flipX ? "~" : ""}`; };
  assert.equal(name(c("idle-down", "idle-left"), "idle", "W"), "idle-left"); assert.equal(name(c("idle-down", "left"), "move", "W"), "left");
  assert.equal(name(c("idle-down", "idle-right"), "idle", "W"), "idle-right~"); assert.equal(name({ ...c("idle-up", "idle-right"), noMirror: true }, "idle", "W"), "idle-right");
  assert.equal(name(c("idle-up", "idle"), "idle", "N"), "idle-up"); assert.equal(name(c("idle-up", "idle"), "idle", "E"), "idle"); assert.equal(name(c("idle-up", "idle-left"), "idle", "S"), "idle-left"); assert.equal(name(c("idle", "idle-down"), "idle", "N"), "idle-down");
  assert.equal(name(c("idle-down", "attack-up"), "attack", "S"), "attack-up"); assert.equal(name(c("idle-down"), "cast", "S"), "idle-down");
  assert.equal(name(c("idle-down", "hit-down"), "die", "S"), "hit-down"); assert.equal(name(c("idle-down"), "die", "S"), "idle-down"); assert.equal(name(c("walk"), "idle", "S"), "#1"); assert.equal(name(c(), "idle", null), "#0");
});
