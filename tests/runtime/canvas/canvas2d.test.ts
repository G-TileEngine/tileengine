import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { canvas2d, type Canvas2D } from "../../../src/runtime/canvas/canvas2d.ts";
import { buildDrawList, chunkedList, fitView, present, snapCamera, type Cam, type Fit, type RenderScene, type Sheet } from "../../../src/runtime/render/index.ts";
import { FakeCanvas, type Raster } from "./fake-canvas.ts";

const CLEAR = "#010101", water = { name: "water", frames: [4, 5], ms: [200, 200] };
const argb = (n: number): number => (0xff << 24) | n;
const sheet = (id: string, fw = 16, fh = 16, columns = 4): Sheet => ({ id, fw, fh, columns });
const solid = (w: number, h: number, c: number): Raster => ({ w, h, px: new Uint32Array(w * h).fill(argb(c)) });
const grid = (cols: number, fw: number, fh: number, n: number, salt = 0): Raster => {
  const px = new Uint32Array(cols * fw * Math.ceil(n / cols) * fh);
  for (let f = 0; f < n; f += 1) {
    const colour = argb((0x010101 * (f + 1)) ^ salt), ox = (f % cols) * fw, oy = Math.floor(f / cols) * fh;
    for (let y = 0; y < fh; y += 1) for (let x = 0; x < fw; x += 1) px[(oy + y) * (cols * fw) + ox + x] = colour;
  }
  return { w: cols * fw, h: Math.ceil(n / cols) * fh, px };
};
const stripe = (): Raster => { const px = new Uint32Array(256); for (let y = 0; y < 16; y += 1) for (let x = 0; x < 16; x += 1) px[y * 16 + x] = argb(0x20 + x); return { w: 16, h: 16, px }; };
const bank = new Map<string, Raster>([["g", grid(4, 16, 16, 8)], ["a", grid(4, 16, 16, 8)], ["u", stripe()], ["ga", solid(8, 8, 0x000040)], ["gb", solid(8, 8, 0x004000)], ["ui", solid(8, 8, 0x0000f0)], ["big", grid(2, 32, 32, 4)], ["g64", grid(4, 64, 64, 8)]]);
const stage = (over: Partial<RenderScene> = {}): RenderScene => {
  const cols = over.cols ?? 40, rows = over.rows ?? 20, tileW = over.tileW ?? 16, tileH = over.tileH ?? 16, n = cols * rows;
  return { cols, rows, tileW, tileH, mapSeed: 1, standing: [], overlays: [], ground: [{ sheet: sheet(tileW === 64 ? "g64" : "g", tileW, tileH), tiles: Array.from({ length: n }, (_, i) => (i === cols + 1 ? 2 : 1)), anims: { 2: water } }], above: [{ sheet: sheet("a"), tiles: Array.from({ length: n }, (_, i) => (i % 5 === 0 ? null : 1)) }], ...over };
};
const eq = (a: FakeCanvas, b: FakeCanvas): void => { assert.equal(`${a.width}x${a.height}`, `${b.width}x${b.height}`); let bad = -1; for (let i = 0; i < a.px.length; i += 1) if (a.px[i] !== b.px[i]) { bad = i; break; } assert.equal(bad, -1, `${(a.px[bad] ?? 0).toString(16)}!=${(b.px[bad] ?? 0).toString(16)}@${bad}`); };
const open = (limit: number, budget?: number, images: (id: string) => object | undefined = (id) => bank.get(id)): { r: Canvas2D; view: FakeCanvas; made: FakeCanvas[] } => {
  const made: FakeCanvas[] = [], view = new FakeCanvas();
  const r = canvas2d(view, { images, buildsPerFrame: limit, ...(budget === undefined ? {} : { budgetBytes: budget }), makeCanvas: (w, h) => { const c = new FakeCanvas(); c.width = w; c.height = h; made.push(c); return c; } });
  return { r, view, made };
};
const refOf = (scene: RenderScene, fit: Fit, cam: Cam, images: (id: string) => object | undefined = (id) => bank.get(id)): FakeCanvas => { const box = open(99, undefined, images); box.r.world(scene, 1); present(box.r, fit, buildDrawList(scene, fit, cam, 250, 10), CLEAR); return box.view; };
const show = (box: { r: Canvas2D; view: FakeCanvas }, scene: RenderScene, fit: Fit, cam: Cam, rev = 1): void => { box.r.world(scene, rev); const mark = box.view.log.length; present(box.r, fit, chunkedList(scene, fit, cam, 250, 10), CLEAR); assert.equal(box.view.state.smoothing, false); assert.ok(box.view.log.slice(mark).every((row) => row.smoothing === false)); };
const tally = (made: readonly FakeCanvas[]): number => made.reduce((sum, c) => sum + c.width * c.height * 4, 0);

test("chunks draw the same pixels as per-tile drawing, from 1x 16x16-tile canvases (step 28)", () => {
  const scene = stage(), box = open(99);
  for (const [w, h, s, x, y] of [[200, 120, 1, 0, 0], [301, 203, 2, 37.4, 11.6], [390, 250, 3, 0, 0], [97, 61, 4, 0, 0], [1024, 2216, 3, 0, 0]] as const) {
    const fit = fitView(w, h, s, 16, 16), cam = snapCamera(x, y, s);
    show(box, scene, fit, cam); eq(box.view, refOf(scene, fit, cam)); assert.deepEqual([box.view.width, box.view.height], [fit.devW, fit.devH]);
  }
  assert.ok(box.made.every((c) => c.width <= 256 && c.height <= 256) && box.made.some((c) => c.width === 256 && c.height === 256));
});

test("the chunk plan keeps the anim due time and leaves off-size layers live (step 28)", () => {
  const scene = stage(), fit = fitView(200, 120, 1, 16, 16), cam = snapCamera(0, 0, 1);
  assert.equal(chunkedList(scene, fit, cam, 250, 10).dueMs, buildDrawList(scene, fit, cam, 250, 10).dueMs); assert.equal(chunkedList(scene, fit, cam, 250, 10).dueMs, 400);
  const bare = open(9, undefined, () => undefined); show(bare, scene, fit, cam); assert.equal(bare.r.busy(), true);
  const big = stage({ ground: [{ sheet: sheet("big", 32, 32, 2), tiles: Array.from({ length: 800 }, () => 1) }], above: [] }), wide = fitView(301, 203, 2, 16, 16), at = snapCamera(0, 0, 2);
  assert.equal(chunkedList(big, wide, at, 250, 10).cmds.some((c) => c.sheet.startsWith("chunk:")), false);
  const box = open(99); show(box, big, wide, at); eq(box.view, refOf(big, wide, at));
});

test("smoothing is off after every resize, the letterbox is never painted, glow is lighter and flips mirror (step 28)", () => {
  const scene = stage(), box = open(99);
  for (const [w, h] of [[34, 30], [35, 33], [35, 33], [66, 30]] as const) {
    const fit = fitView(w, h, 4, 16, 16); show(box, scene, fit, snapCamera(0.4, 0.6, 4));
    const x0 = fit.padX, y0 = fit.padY, x1 = x0 + fit.artW * fit.s, y1 = y0 + fit.artH * fit.s;
    for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) assert.equal(x >= x0 && x < x1 && y >= y0 && y < y1, (box.view.px[y * w + x] ?? 0) !== 0xff010101);
  }
  const glow = stage({ cols: 4, rows: 2, ground: [], above: [], overlays: [{ band: "glow", sheet: sheet("ga", 8, 8, 1), x: 0, y: 0, frame: 0, op: "normal" }, { band: "glow", sheet: sheet("gb", 8, 8, 1), x: 0, y: 0, frame: 0 }, { band: "ui", sheet: sheet("ui", 8, 8, 1), x: 16, y: 0, frame: 0 }] });
  const g = open(4), gfit = fitView(32, 16, 1, 16, 16); show(g, glow, gfit, snapCamera(0, 0, 1));
  assert.equal(g.view.state.op, "source-over"); assert.ok(g.view.log.some((row) => row.op === "lighter")); assert.equal(g.view.px[0], 0xff014141); assert.equal(g.view.px[16], 0xff0000f0);
  const flip = stage({ cols: 2, rows: 2, ground: [], above: [], standing: [{ kind: "unit", sheet: sheet("u", 16, 16, 1), c: 0, r: 0, frame: 0, flipX: true }] });
  const f = open(4), ffit = fitView(32, 32, 1, 16, 16); show(f, flip, ffit, snapCamera(0, 0, 1)); assert.equal(f.view.px[0], 0xff00002f);
});

test("a draw that throws leaves no clip, flip or lighter behind (step 28)", () => {
  const copy = (img: Raster): Raster => ({ w: img.w, h: img.h, px: img.px.slice(), throws: 1 });
  const u = copy(stripe()), ga = copy(solid(8, 8, 0x000040)), images = (id: string): Raster | undefined => (id === "u" ? u : id === "ga" ? ga : undefined);
  const scene = stage({ cols: 2, rows: 2, ground: [], above: [], standing: [{ kind: "unit", sheet: sheet("u", 16, 16, 1), c: 0, r: 0, frame: 0, flipX: true }], overlays: [{ band: "glow", sheet: sheet("ga", 8, 8, 1), x: 0, y: 0, frame: 0, op: "normal" }] });
  const box = open(4, undefined, images), fit = fitView(32, 32, 1, 16, 16), cam = snapCamera(0, 0, 1);
  assert.throws(() => show(box, scene, fit, cam)); assert.throws(() => show(box, scene, fit, cam, 2));
  assert.equal(box.view.state.op, "source-over"); assert.equal(box.view.unbalanced, 0);
  show(box, scene, fit, cam, 3); eq(box.view, refOf(scene, fit, cam, images));
});

test("a tile or image change rebuilds only its chunks, a few per frame, never showing a hole or stale pixels (step 28)", () => {
  const tiles: number[] = Array.from({ length: 800 }, (_, i) => (i === 41 ? 2 : 1)), aboveTiles = Array.from({ length: 800 }, (_, i) => (i % 5 === 0 ? null : 1));
  let aboveSheet = sheet("a");
  const scene = (): RenderScene => ({ cols: 40, rows: 20, tileW: 16, tileH: 16, mapSeed: 1, ground: [{ sheet: sheet("g"), tiles, anims: { 2: water } }], above: [{ sheet: aboveSheet, tiles: aboveTiles }], standing: [], overlays: [] });
  const fit = fitView(640, 320, 1, 16, 16), cam = snapCamera(0, 0, 1), box = open(2);
  const frame = (rev: number): void => { show(box, scene(), fit, cam, rev); eq(box.view, refOf(scene(), fit, cam)); };
  frame(1); assert.equal(box.r.stats.builds, 2); assert.equal(box.r.busy(), true);
  let n = 0; while (box.r.busy() && n < 30) { show(box, scene(), fit, cam, 1); n += 1; }
  assert.equal(box.r.stats.builds, 12); assert.equal(box.r.busy(), false); assert.equal(box.made.filter((c) => c.width > 0).length, 12);
  frame(2); assert.equal(box.r.stats.builds, 12); tiles[0] = 3; show(box, scene(), fit, cam, 2); assert.equal(box.r.stats.builds, 12); frame(3); assert.equal(box.r.stats.builds, 13);
  for (const [i, v] of [[41, 1], [17, 4], [680, 3], [697, 3], [698, 4]] as const) tiles[i] = v;
  frame(4); assert.equal(box.r.stats.builds, 15); assert.equal(box.r.busy(), true);
  for (let k = 0; box.r.busy() && k < 10; k += 1) show(box, scene(), fit, cam, 4); assert.equal(box.r.stats.builds, 17);
  const bump = (rev: number, touch: () => void): void => { const before = box.r.stats.builds; touch(); frame(rev); let k = 0; while (box.r.busy() && k < 20) { show(box, scene(), fit, cam, rev); k += 1; } assert.equal(box.r.stats.builds, before + 6); eq(box.view, refOf(scene(), fit, cam)); };
  const swapped = grid(4, 16, 16, 8, 0x440000); bump(5, () => { bank.set("a", swapped); });
  const renamed = grid(4, 16, 16, 8, 0x330000); bump(6, () => { bank.set("a2", renamed); aboveSheet = sheet("a2"); });
  bump(7, () => { aboveSheet = { id: "a2", fw: 16, fh: 16, columns: 1 }; });
});

test("the chunk cache keeps a byte budget, never evicts what is on screen and zeroes what it drops (step 28)", () => {
  const one = stage({ above: [] }), fit = fitView(640, 320, 1, 16, 16), cam = snapCamera(0, 0, 1), box = open(30, 512 * 1024);
  for (let i = 0; i < 3; i += 1) show(box, one, fit, cam); assert.equal(box.r.stats.builds, 6); assert.equal(box.r.stats.bytes, 819200); assert.equal(tally(box.made), 819200);
  const pan = stage({ cols: 96, rows: 16, above: [] }), pfit = fitView(767, 256, 1, 16, 16), wide = open(30, 1024 * 1024);
  show(wide, pan, pfit, snapCamera(0, 0, 1)); show(wide, pan, pfit, snapCamera(768, 0, 1), 2);
  assert.equal(wide.r.stats.builds, 6); assert.equal(wide.made.filter((c) => c.width === 0).length, 2); assert.equal(wide.r.stats.bytes, 1048576); assert.equal(tally(wide.made), 1048576);
  show(wide, pan, pfit, snapCamera(256, 0, 1), 3); assert.equal(wide.made[4]?.width, 0); assert.notEqual(wide.made[2]?.width, 0);
  const big = stage({ cols: 160, rows: 16, tileW: 64, tileH: 64, above: [] }), bfit = fitView(512, 512, 1, 64, 64), huge = open(30);
  for (let i = 0; i < 10; i += 1) show(huge, big, bfit, snapCamera(i * 1024, 0, 1), i + 1);
  assert.equal(huge.r.stats.builds, 10); assert.equal(huge.r.stats.bytes, 32 * 1024 * 1024); assert.equal(tally(huge.made), 32 * 1024 * 1024); assert.equal(huge.made.filter((c) => c.width === 0).length, 2);
});

test("a lost context skips drawing and a restored one rebuilds every chunk (step 28)", () => {
  const scene = stage({ cols: 16, rows: 16, above: [] }), fit = fitView(64, 64, 1, 16, 16), cam = snapCamera(0, 0, 1), box = open(2);
  show(box, scene, fit, cam); const logged = box.view.log.length, before = box.view.px.slice();
  box.view.fire("contextlost"); show(box, scene, fit, cam, 2); box.r.fillRect(0, 0, 4, 4, "#ffffff");
  assert.equal(box.view.log.length, logged); assert.deepEqual(box.view.px, before); assert.equal(box.view.unbalanced, 0); assert.equal(box.r.stats.lost, true);
  box.view.width = 3; box.view.fire("contextrestored"); assert.equal(box.r.busy(), true); assert.equal(box.r.stats.bytes, 0); assert.ok(box.made.every((c) => c.width === 0 && c.height === 0));
  show(box, scene, fit, cam, 3); assert.equal(box.r.busy(), false); assert.equal(box.view.state.smoothing, false); assert.equal(box.view.width, fit.devW);
});

test("the canvas lives only in the backend and the host driver; the backend imports only the render core (steps 28, 29)", () => {
  const root = fileURLToPath(new URL("../../../src/", import.meta.url));
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".ts") ? [join(dir, e.name)] : []));
  const comments = (text: string): string => text.replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/.*$/gm, "$1");
  const dom = /\b(getContext|addEventListener|imageSmoothingEnabled|globalCompositeOperation|OffscreenCanvas|HTMLCanvasElement|document|window|navigator)\b/;
  const banned = /\b(Date|performance|requestAnimationFrame|setTimeout|setInterval|setImmediate|queueMicrotask|globalThis|window|document|navigator|self|process|eval|Function|Intl|Temporal|global|require)\b|Math\.random|\bimport\s*\(/;
  for (const file of walk(root)) assert.equal(dom.test(comments(readFileSync(file, "utf8")).replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)/g, "")), ["runtime/canvas/canvas2d.ts", "runtime/host/raf-driver.ts"].map((f) => join(root, f)).includes(file), file);
  for (const file of walk(join(root, "runtime/canvas"))) {
    const text = comments(readFileSync(file, "utf8")); assert.equal(banned.test(text), false, file); assert.equal(/\bimport\s*\(/.test(text), false, file);
    for (const hit of text.matchAll(/(?:from|import)\s*[`'"]([^`'"]+)[`'"]/g)) assert.match(hit[1] ?? "", /^(?:\.\.\/render\/index\.ts|\.\/[^/]+\.ts)$/, file);
  }
  const dead = new FakeCanvas(); dead.getContext = () => null; assert.throws(() => canvas2d(dead, { images: () => undefined, makeCanvas: () => new FakeCanvas() }), /no 2d context/);
});
