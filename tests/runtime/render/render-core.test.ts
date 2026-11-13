import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { backingSize, buildDrawList, clampCamera, clipMs, easeCamera, fitView, frameAt, hash32, instanceOffset, needsDraw, present, px, scaleRange, snapCamera, snapScale, type Clip, type FrameStamp, type RenderScene, type Sheet, type Standing } from "../../../src/runtime/render/index.ts";
import { FakeRenderer } from "./fake-renderer.ts";

const water: Clip = { name: "water", frames: [8, 9, 10, 11, 12, 13, 14, 15], ms: [200, 200, 200, 200, 200, 200, 200, 200] };
const sh = (id: string, fw = 16, fh = 16, columns = 4, anchor?: Sheet["anchor"]): Sheet => ({ id, fw, fh, columns, ...(anchor === undefined ? {} : { anchor }) });
const world = (over: Partial<RenderScene>): RenderScene => ({ cols: 8, rows: 8, tileW: 16, tileH: 16, mapSeed: 7, ground: [], above: [], standing: [], overlays: [], ...over });
const stamp = (p: Partial<FrameStamp> = {}): FrameStamp => ({ rev: 1, tMs: 0, s: 1, devW: 64, devH: 64, camDevX: 0, camDevY: 0, ...p });
const fit1 = fitView(256, 256, 1, 16, 16), cam0 = snapCamera(0, 0, 1);
const stand = (id: string, kind: Standing["kind"], c: number, r: number, extra: Partial<Standing> = {}): Standing => ({ kind, sheet: sh(id), c, r, ...extra });

test("the backing store is device pixels and art pixels are s wide at DPR 1, 2, 2.625, 2.75 and 3 (step 27)", () => {
  assert.deepEqual(backingSize(390, 844, 2.625), { w: 1024, h: 2216 });
  assert.deepEqual(backingSize(390, 844, 2.625, { w: 10, h: 12 }), { w: 10, h: 12 });
  for (const dpr of [1, 2, 2.625, 2.75, 3]) for (const [cssW, cssH] of [[390, 844], [411, 731], [731, 411]] as const) for (const s of [1, 2, 3, 4]) {
    const dev = backingSize(cssW, cssH, dpr), fit = fitView(dev.w, dev.h, s, 1, 1);
    const right = dev.w - fit.padX - fit.artW * fit.s, bottom = dev.h - fit.padY - fit.artH * fit.s;
    assert.ok((right - fit.padX === 0 || right - fit.padX === 1) && (bottom - fit.padY === 0 || bottom - fit.padY === 1));
    const cam = snapCamera(0.37, 0.37, s), cols = 480, fake = new FakeRenderer();
    present(fake, fit, buildDrawList(world({ cols, rows: 1, tileW: 1, tileH: 1, ground: [{ sheet: sh("chk", 1, 1, 2), tiles: Array.from({ length: cols }, (_, c) => c % 2) }] }), fit, cam, 0, 10), "#000");
    const edge = Math.min(fit.padX + fit.artW * s, cols * s - cam.devX + fit.padX), runs = fake.runs(fit.padY, fit.padX, edge);
    assert.ok(edge > fit.padX && runs.includes(0) === false && runs.slice(1, -1).every((n) => n === s));
  }
});

test("bigger phones see more tiles at the same whole scale; zoom snaps to steps (step 27)", () => {
  const a = fitView(1170, 2532, 3, 64, 64), b = fitView(1290, 2796, 3, 64, 64), range = { sMin: 4, sMax: 6 };
  assert.deepEqual([a.artW, a.artH, a.tilesW, a.tilesH, a.padX, a.padY, b.tilesW, b.tilesH, b.s], [390, 844, 6, 13, 0, 0, 6, 14, 3]);
  assert.deepEqual([fitView(1171, 9, 3, 1, 1).padX, fitView(1172, 9, 3, 1, 1).padX, fitView(9, 1171, 3, 1, 1).padY, fitView(9, 1172, 3, 1, 1).padY, fitView(100, 100, 2.7, 10, 10).s], [0, 1, 0, 1, 2]);
  assert.deepEqual(scaleRange(1170, 2532, 384, 576), { sMin: 4, sMax: 6 });
  assert.deepEqual([snapScale(2.6, range), snapScale(5.4, range), snapScale(9, range)], [4, 5, 6]);
});

test("the camera snaps to device pixels and nothing is drawn at half a pixel (step 27)", () => {
  const snapped = snapCamera(0.5, 0.5, 1);
  assert.equal(snapped.devX, 1); assert.equal(snapped.devY, 1); assert.equal(Object.is(snapped.devX, -0), false); assert.equal(px(-0.5), 0); assert.equal(Object.is(px(-0.5), -0), false);
  assert.equal(snapCamera(10.37, 0, 3).devX, 31); assert.equal(easeCamera(0, 100, 30, 120), 15.625); assert.equal(easeCamera(5, 9, 10, 0), 9); assert.equal(easeCamera(5, 9, 200, 120), 9);
  let prev = snapCamera(easeCamera(0, 10, 0, 120), 0, 1).devX;
  for (let ms = 2; ms <= 120; ms += 2) { const dev = snapCamera(easeCamera(0, 10, ms, 120), 0, 1).devX; assert.ok(Math.abs(dev - prev) <= 1); prev = dev; }
  const fit = fitView(128, 128, 3, 16, 16), cam = snapCamera(1.2, 0.4, 3);
  const list = buildDrawList(world({ cols: 2, rows: 2, ground: [{ sheet: sh("tile", 16, 16, 1), tiles: [1, null, null, null] }], standing: [{ kind: "unit", sheet: sh("hero", 16, 16, 1), c: 0, r: 0, dx: 10.5, dy: 0.4, frame: 0 }] }), fit, cam, 0, 10);
  const tile = list.cmds.find((c) => c.sheet === "tile"), hero = list.cmds.find((c) => c.sheet === "hero");
  assert.ok(tile !== undefined && hero !== undefined && (hero.dx - tile.dx) % fit.s === 0 && (hero.dy - tile.dy) % fit.s === 0);
  assert.ok(list.cmds.every((cmd) => Number.isInteger(cmd.dx) && Number.isInteger(cmd.dy) && Number.isInteger(cmd.dw) && Number.isInteger(cmd.dh) && cmd.dw === cmd.sw * fit.s && cmd.dh === cmd.sh * fit.s));
  const box = fitView(100, 80, 1, 10, 10);
  assert.deepEqual([clampCamera(-5, -8, box, 300, 200), clampCamera(250, 150, box, 300, 200), clampCamera(3, 4, box, 40, 20)], [{ x: 0, y: 0 }, { x: 200, y: 120 }, { x: -30, y: -30 }]);
});

test("frames follow clockMs with per-frame ms, fps and loop (step 27)", () => {
  const at = (t: number) => frameAt(water, t, 10), once: Clip = { ...water, loop: false }, mixed: Clip = { name: "m", frames: [1, 2, 3], ms: [200], fps: 8 };
  assert.deepEqual([0, 199, 200, 1599, 1600, 3405].map((t) => at(t).frame), [8, 8, 9, 15, 8, 9]);
  assert.deepEqual([0, 199, 200, 250, 1599, 1600, 3405].map((t) => at(t).nextMs), [200, 200, 400, 400, 1600, 1800, 3600]);
  assert.equal(frameAt(water, -1, 10).frame, 15);
  assert.deepEqual(frameAt(once, 1599, 10), { frame: 15, nextMs: 1600 }); assert.deepEqual(frameAt(once, 1600, 10), { frame: 15, nextMs: Infinity });
  assert.deepEqual(clipMs(mixed, 10), [200, 200, 200]); assert.equal(frameAt(mixed, 200, 10).frame, 2);
  assert.deepEqual(clipMs({ name: "a", frames: [0, 1], fps: 8 }, 10), [130, 130]); assert.deepEqual(clipMs({ name: "a", frames: [0], fps: 6 }, 10), [170]); assert.deepEqual(clipMs({ name: "a", frames: [0], fps: 6 }, 16), [160]);
  assert.deepEqual(frameAt(undefined, 10, 10), { frame: 0, nextMs: Infinity }); assert.deepEqual(frameAt({ name: "e", frames: [] }, 10, 10), { frame: 0, nextMs: Infinity }); assert.deepEqual(frameAt({ name: "one", frames: [3], ms: [50] }, 80, 10), { frame: 3, nextMs: Infinity });
});

test("shared tiles stay in step and each prop gets a stable derived offset (step 27)", () => {
  const ground = [{ sheet: sh("w"), tiles: [1, 1, 1, 1, 1, 1], anims: { 1: water } }];
  for (const t of [0, 450, 1234]) { const cmds = buildDrawList(world({ cols: 6, rows: 1, ground }), fit1, cam0, t, 10).cmds; assert.equal(cmds.length, 6); assert.ok(cmds.every((c) => c.sx === cmds[0]?.sx && c.sy === cmds[0]?.sy)); }
  assert.equal(hash32(7, "tree", 3, 4), 1909584459); assert.equal(hash32(7, "tree", 3, 4), hash32(7, "tree", 3, 4));
  assert.notEqual(hash32(7, "tree", 3, 4), hash32(7, "tree", 4, 4)); assert.notEqual(hash32(7, "tree", 3, 4), hash32(8, "tree", 3, 4)); assert.notEqual(hash32(7, "tree", 3, 4), hash32(7, "leaf", 3, 4));
  const offs = Array.from({ length: 12 }, (_, i) => instanceOffset(water, 10, 7, "tree", i, 2));
  assert.ok(new Set(offs).size >= 8 && Math.max(...offs) - Math.min(...offs) > 800);
  const trees = Array.from({ length: 6 }, (_, c): Standing => ({ kind: "object", sheet: sh("tree"), c, r: 0, clip: water }));
  assert.ok(new Set(buildDrawList(world({ cols: 6, rows: 2, standing: trees }), fit1, cam0, 300, 10).cmds.map((c) => c.sx)).size > 1);
});

test("the draw list keeps the band order and y-sorts by feet with stable ties (step 27)", () => {
  const tiles = Array.from({ length: 64 }, () => null as number | null); tiles[0] = 0; tiles[1] = 1;
  const above = Array.from({ length: 64 }, () => null as number | null); above[0] = 2;
  const standing: Standing[] = [
    stand("u-z", "unit", 2, 3, { frame: 1, z: -1 }), stand("o-r0c1", "object", 1, 0), stand("o-same", "object", 2, 3), stand("o-r0c0", "object", 0, 0),
    stand("walk", "unit", 0, 0, { dy: 20, frame: 2 }), stand("o-r1", "object", 0, 1), stand("u-z2", "unit", 4, 4, { z: 2, frame: 3 }), stand("u-z0", "unit", 4, 4, { z: 0, frame: 4 }),
    stand("o-c3", "object", 3, 3), stand("tie-a", "object", 5, 2), stand("tie-b", "object", 5, 2, { flipX: true }),
  ];
  const list = buildDrawList(world({ ground: [{ sheet: sh("ground", 16, 16, 1), tiles }], above: [{ sheet: sh("roof", 16, 16, 1), tiles: above }], standing, overlays: [
    { band: "ui", sheet: sh("ui"), x: 0, y: 0, frame: 0 }, { band: "glow", sheet: sh("glow"), x: 1, y: 1, frame: 0, op: "normal" },
    { band: "wash", sheet: sh("wash"), x: 2, y: 2, frame: 0 }, { band: "fxAir", sheet: sh("air"), x: 3, y: 3, frame: 0 },
  ] }), fit1, cam0, 0, 10);
  assert.deepEqual(list.cmds.map((c) => c.sheet), ["ground", "ground", "o-r0c0", "o-r0c1", "o-r1", "walk", "tie-a", "tie-b", "o-same", "u-z", "o-c3", "u-z0", "u-z2", "roof", "wash", "air", "glow", "ui"]);
  assert.equal(list.cmds.find((c) => c.sheet === "glow")?.op, "add");
  assert.ok(list.cmds.filter((c) => c.sheet === "wash" || c.sheet === "air" || c.sheet === "ui").every((c) => c.op === "normal") && list.cmds.find((c) => c.sheet === "tie-b")?.flipX === true);
  const anchored = buildDrawList(world({ cols: 8, rows: 6, standing: [
    { kind: "object", sheet: sh("def"), c: 6, r: 0 }, { kind: "object", sheet: sh("auto", 16, 16, 4, "auto"), c: 6, r: 1 },
    { kind: "object", sheet: sh("norm", 16, 16, 4, { x: 0.25, y: 0.5, units: "norm" }), c: 6, r: 2 }, { kind: "object", sheet: sh("pxa", 16, 16, 4, { x: 4, y: 8, units: "px" }), c: 6, r: 3 },
  ] }), fit1, cam0, 0, 10);
  const at = (id: string) => anchored.cmds.find((c) => c.sheet === id);
  assert.deepEqual([at("def")?.dx, at("def")?.dy, at("auto")?.dx, at("auto")?.dy, at("norm")?.dx, at("norm")?.dy, at("pxa")?.dx, at("pxa")?.dy], [96, 0, 96, 16, 100, 40, 100, 56]);
  const wide = (x: number, y: number): boolean => buildDrawList(world({ cols: 4, rows: 4, ground: [{ sheet: sh("big", 32, 32, 1), tiles: [null, null, null, null, 1, ...Array<number | null>(11).fill(null)] }] }), fitView(64, 64, 1, 16, 16), snapCamera(x, y, 1), 0, 10).cmds.some((c) => c.sheet === "big");
  assert.deepEqual([16, 0, 0, 16, 16, 16, 32, 0].reduce<boolean[]>((acc, n, i) => (i % 2 === 0 ? [...acc, wide(n, [16, 0, 0, 16, 16, 16, 32, 0][i + 1] ?? 0)] : acc), []), [true, true, true, false]);
});

test("the dirty flag redraws on state, camera, size and anim ticks, and skips idle frames (step 27)", () => {
  const on = buildDrawList(world({ cols: 4, rows: 2, ground: [{ sheet: sh("w"), tiles: [1, null, null, null, null, null, null, null], anims: { 1: water } }] }), fit1, cam0, 250, 10);
  assert.equal(on.dueMs, 400);
  const hidden = Array.from({ length: 1600 }, (_, i) => (i === 39 * 40 + 39 ? 1 : null));
  assert.equal(buildDrawList(world({ cols: 40, rows: 40, ground: [{ sheet: sh("w"), tiles: hidden, anims: { 1: water } }], standing: [{ kind: "object", sheet: sh("prop"), c: 38, r: 38, clip: water }], overlays: [{ band: "fxAir", sheet: sh("tree"), x: 470, y: 470, clip: water }] }), fitView(64, 64, 1, 16, 16), cam0, 250, 10).dueMs, Infinity);
  assert.equal(buildDrawList(world({ cols: 2, rows: 2, ground: [{ sheet: sh("g", 16, 16, 1), tiles: [0, 1, 2, 3] }] }), fit1, cam0, 250, 10).dueMs, Infinity);
  const started = buildDrawList(world({ overlays: [{ band: "fxAir", sheet: sh("tree"), x: 0, y: 0, clip: water, startMs: 100 }] }), fit1, cam0, 350, 10);
  assert.equal(started.dueMs, 500); assert.equal(started.cmds[0]?.sx, 16); assert.equal(started.cmds[0]?.sy, 32);
  const base = stamp();
  assert.equal(needsDraw(null, Infinity, base), true); assert.equal(needsDraw(base, 400, stamp({ tMs: 100 })), false); assert.equal(needsDraw(base, Infinity, stamp({ tMs: 500 })), false);
  assert.equal(needsDraw(base, 400, stamp({ rev: 2 })), true); assert.equal(needsDraw(base, 400, stamp({ rev: 0 })), true); assert.equal(needsDraw(base, 400, stamp({ tMs: 400 })), true); assert.equal(needsDraw(stamp({ tMs: 50 }), Infinity, stamp({ tMs: 10 })), true);
  for (const next of [stamp({ s: 2 }), stamp({ devW: 65 }), stamp({ devH: 63 }), stamp({ camDevX: 1 }), stamp({ camDevY: 2 })]) assert.equal(needsDraw(base, Infinity, next), true);
  const fake = new FakeRenderer(); present(fake, fit1, on, "#000"); assert.deepEqual(fake.calls, ["begin", ...on.cmds.map(() => "image"), "end"]);
});

test("the render core stays pure: no DOM, no wall time, no frame loop, imports only its own folder (step 27)", () => {
  const dir = new URL("../../../src/runtime/render/", import.meta.url);
  const entries = readdirSync(dir, { withFileTypes: true });
  assert.ok(entries.length > 0);
  for (const entry of entries) assert.ok(entry.isFile() && entry.name.endsWith(".ts"), entry.name);
  const banned = /\b(document|window|globalThis|HTMLCanvasElement|CanvasRenderingContext2D|OffscreenCanvas|Image|Date|performance|requestAnimationFrame|setTimeout|setInterval|setImmediate|process|eval|Function|Intl|Temporal|global|self|require)\b|Math\.random|\bimport\s*\(/;
  const spec = /(?:from|import)\s*[`'"]([^`'"]+)[`'"]/g;
  for (const entry of entries) {
    const text = readFileSync(new URL(entry.name, dir), "utf8").replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/.*$/gm, "$1");
    assert.equal(banned.test(text), false, entry.name);
    for (const hit of text.matchAll(spec)) assert.match(hit[1] ?? "", /^\.\/[^/]+\.ts$/, entry.name);
  }
});
