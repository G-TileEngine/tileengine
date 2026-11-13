import assert from "node:assert/strict";
import { test } from "node:test";
import { createLighting, createSeeThrough, cycleFrames, darkness, fitView, lightOps, scrollFrames, SEE_THROUGH_DEFAULT, shoreDistance, shoreFrames, snapCamera, swayFrames, waveOffsetMs, type Pixels, type RenderScene } from "../../../src/runtime/render/index.ts";

const pix = (w: number, h: number, at: (x: number, y: number) => readonly number[]): Pixels => { const data = new Uint8ClampedArray(w * h * 4); for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) { const pair = at(x, y), c = pair[0] ?? 0, a = pair[1] ?? 255, i = (y * w + x) * 4; data[i] = (c >> 16) & 255; data[i + 1] = (c >> 8) & 255; data[i + 2] = c & 255; data[i + 3] = a; } return { w, h, data }; };
const ch = (img: Pixels, x: number, y: number): number => { const i = (y * img.w + x) * 4, d = img.data; return ((d[i + 3] ?? 0) << 24) | ((d[i] ?? 0) << 16) | ((d[i + 1] ?? 0) << 8) | (d[i + 2] ?? 0); };
const pure = (x: number, y: number): number => { const a = Math.max(Math.abs(x), Math.abs(y)), b = Math.min(Math.abs(x), Math.abs(y)); return Math.min(32, Math.round((3 * a + b) / 3)); };
const sheet = { id: "t", columns: 1, fw: 16, fh: 16 };

test("colour cycle bake: one frame per ramp step, ramp colours rotate, other and transparent pixels never change, a bad ramp bakes no cycle (step 32)", () => {
  const img = pix(4, 1, (x) => [[0x112233, 255], [0x445566, 128], [0xabcdef, 255], [0x112233, 0]][x] ?? [0, 0]), ramp = [0x112233, 0x445566, 0x778899], fr = cycleFrames(img, ramp);
  assert.equal(fr[0], img); assert.equal(fr.length, 3); assert.equal(ch(fr[1] ?? img, 0, 0), (255 << 24) | 0x445566); assert.equal(ch(fr[1] ?? img, 1, 0), (128 << 24) | 0x778899); assert.equal(ch(fr[2] ?? img, 1, 0), (128 << 24) | 0x112233);
  assert.equal(ch(fr[1] ?? img, 2, 0), ch(img, 2, 0)); assert.equal(ch(fr[2] ?? img, 3, 0), ch(img, 3, 0)); assert.deepEqual([cycleFrames(img, [1]), cycleFrames(img, [1, 1]), cycleFrames(img, [])].map((a) => a.length), [0, 0, 0]);
});

test("slow scroll bake: size/step frames, each shifted step px downstream and wrapping, so the loop is seamless; a bad step bakes no scroll (step 32)", () => {
  const row = pix(4, 1, (x) => [0x010101 * (x + 1), 255]), sc = scrollFrames(row, 2), y = pix(1, 4, (_x, yy) => [0x10 * (yy + 1), 255]), ys = scrollFrames(y, 1, "y");
  assert.equal(sc[0], row); assert.equal(sc.length, 2); assert.equal(ch(sc[1] ?? row, 2, 0), ch(row, 0, 0)); assert.equal(ch(sc[1] ?? row, 0, 0), ch(row, 2, 0)); assert.equal(scrollFrames(row, 4).length, 1);
  assert.equal(ys.length, 4); assert.equal(ch(ys[1] ?? y, 0, 1), ch(y, 0, 0)); assert.equal(ch(ys[1] ?? y, 0, 0), ch(y, 0, 3)); assert.equal(ch(ys[3] ?? y, 0, 0), ch(y, 0, 1));
  assert.deepEqual([0, 3, 1.5, 8].map((step) => scrollFrames(row, step).length), [0, 0, 0, 0]);
});

test("leafy sway bake: four whole-pixel poses, the trunk rows never move, no hole opens, only outer leaves move, and the frame edge counts as transparent (step 32)", () => {
  const block = pix(4, 4, (x, y) => [0x10000 * y + x + 1, 255]), sw = swayFrames(block, 99, 1), right = sw[3] ?? block, tree = pix(3, 4, (x, y) => (y >= 3 ? [0x00ff00, 255] : x === 0 && y === 0 ? [0xff0000, 255] : [0, 0])), tw = swayFrames(tree, 3, 1), pose = tw[3] ?? tree;
  assert.equal(sw.length, 4); assert.equal(sw[0], block); assert.equal(ch(right, 2, 0) & 0xffffff, ch(block, 1, 0) & 0xffffff); assert.equal(ch(right, 2, 2), ch(block, 2, 2)); assert.equal(ch(right, 2, 1), ch(block, 2, 1)); assert.equal(ch(right, 0, 1), ch(block, 0, 1));
  assert.equal(ch(pose, 0, 3), ch(tree, 0, 3)); assert.equal(ch(pose, 1, 3), ch(tree, 1, 3)); assert.equal(ch(pose, 0, 0) & 0xffffff, 0xff0000); assert.equal(ch(pose, 1, 0) & 0xffffff, 0xff0000); assert.equal((pose.data[0] ?? 0) !== 0, true);
});

test("traveling wave: a plant's pose lags by how far downwind it stands, so a gust rolls across the map (step 32)", () => {
  assert.equal(waveOffsetMs(-45, 1600), 1000); assert.equal(waveOffsetMs(-117, 1600), 1000); assert.equal(waveOffsetMs(0, 1000), 0); assert.equal(waveOffsetMs(22.5, 1000), 500); assert.equal(waveOffsetMs(45, 1000), 0);
  assert.equal(waveOffsetMs(-1, 1000), 23); assert.ok(waveOffsetMs(-90.1, 1000) >= 0); assert.equal(waveOffsetMs(NaN, 1000) + waveOffsetMs(1, 0) + waveOffsetMs(1, 1000, 0) + waveOffsetMs(Infinity, 80) + waveOffsetMs(4, -5), 0);
});

test("distance-field shore: distance to land per pixel with at most 2 px of seeded smooth noise; foam breathes, waves roll toward land, shallows near shore, deep and land transparent (step 32)", () => {
  const w = 8, h = 6, spot = (x: number, y: number): Uint8Array => { const a = new Uint8Array(w * h); a[y * w + x] = 1; return a; }, tl = shoreDistance(spot(0, 0), w, h, 1, 32, 32), br = shoreDistance(spot(w - 1, h - 1), w, h, 1, 32, 32);
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) { assert.equal(tl[y * w + x], pure(x, y)); assert.equal(br[y * w + x], pure(x - (w - 1), y - (h - 1))); }
  const strip = new Uint8Array(40); strip[0] = 1; assert.equal(shoreDistance(strip, 40, 1, 0, 32, 32)[39], 32); const band = spot(0, 0), base = shoreDistance(band, w, h, 0, 32, 32); let differ = false;
  for (const seed of [1, 2, 3, 4, 5, 6]) { const d = shoreDistance(band, w, h, seed, 32, 2), e = shoreDistance(band, w, h, seed + 7, 32, 2); for (let i = 0; i < d.length; i += 1) { const p = base[i] ?? 0; assert.ok((d[i] ?? 0) >= p && (d[i] ?? 0) <= Math.min(32, p + (p > 2 ? 2 : 0))); if (p <= 2) assert.equal(d[i], p); if (d[i] !== e[i]) differ = true; } }
  assert.equal(differ, true); const wide = shoreDistance(band, w, h, 1, 32, 4), wideB = shoreDistance(band, w, h, 6, 32, 4); for (let i = 0; i < wide.length; i += 1) if ((base[i] ?? 99) <= 4) assert.equal(wide[i], wideB[i]);
  const dist = Uint8Array.from([0, 1, 2, 3, 6, 9, 12, 15, 18, 21, 24]), colours = { foam: 0xff0000, shallow: 0x00ff00, wave: 0x0000ff }, fr = shoreFrames(dist, dist.length, 1, colours, { foamPx: 2, shallowPx: 6, waveGap: 12, frames: 4 });
  const col = (f: number, px: number): number => { const o = px * 4, data = fr[f]?.data ?? dist; return ((data[o + 3] ?? 0) << 24) | ((data[o] ?? 0) << 16) | ((data[o + 1] ?? 0) << 8) | (data[o + 2] ?? 0); };
  assert.equal(col(0, 0), 0); assert.equal(col(0, 1) & 0xffffff, 0xff0000); assert.equal(col(0, 2) & 0xffffff, 0xff0000); assert.equal(col(1, 1) & 0xffffff, 0xff0000); assert.notEqual(col(1, 2) & 0xffffff, 0xff0000); assert.equal(col(0, dist.indexOf(18)), 0);
  for (const [f, rings] of [[0, [12, 24]], [1, [9, 21]], [2, [6, 18]], [3, [3, 15]]] as const) for (const ring of rings) assert.equal(col(f, dist.indexOf(ring)) & 0xffffff, 0x0000ff);
  const thin = shoreFrames(Uint8Array.from([0, 1]), 2, 1, colours, { foamPx: 1, shallowPx: 6, waveGap: 8, frames: 2 }); assert.equal(thin[1]?.data[7], 255); assert.throws(() => shoreDistance([1, 0], 2, 2), RangeError);
});

test("see-through canopy is off by default; when on, it cuts the above tiles over a unit and the cell above it, per tile, and keeps the scene stable (step 32)", () => {
  const scene = (standing: RenderScene["standing"]): RenderScene => ({ cols: 2, rows: 2, tileW: 16, tileH: 16, mapSeed: 1, ground: [{ sheet, tiles: [2, 2, 2, 2] }], above: [{ sheet, tiles: [1, 1, 1, 1] }, { sheet, tiles: [3, 3, 3, 3] }], standing, overlays: [] });
  const cut = createSeeThrough(), base = scene([{ kind: "unit", sheet, c: 1, r: 1 }]);
  assert.equal(SEE_THROUGH_DEFAULT, false); assert.equal(cut(base), base); assert.equal(cut(base, undefined), base); const on = cut(base, true); assert.equal(cut(base, true), on); assert.deepEqual(on.above[0]?.tiles, [1, null, 1, null]); assert.deepEqual(on.above[1]?.tiles, [3, null, 3, null]); assert.equal(on.ground[0], base.ground[0]); assert.equal(on.standing, base.standing);
  const off = scene([{ kind: "unit", sheet, c: -1, r: 0 }, { kind: "object", sheet, c: 0, r: 0 }, { kind: "unit", sheet, c: 0, r: 2 }]), opened = cut(off, true), empty = scene([]);
  assert.deepEqual(opened.above[0]?.tiles, [1, 1, null, 1]); assert.equal(cut(empty, true), empty);
});

test("N-4 and additive glow: a NaN wash or dim counts as 0 and drops the glow; glow fills are marked add, darkness fills are not (step 32)", () => {
  assert.equal(darkness(NaN, 1), darkness(0, 1)); assert.equal(darkness(1, NaN), darkness(1, 0)); assert.equal(darkness(Infinity, 0.5), darkness(0, 0.5)); assert.equal(darkness(NaN, NaN), 0);
  const world = { cols: 10, rows: 10, tileW: 16, tileH: 16, blocks: new Uint8Array(100) }, lights = [{ x: 80, y: 80, radius: 48 }], L = createLighting(), nan = L.plan(world, lights, NaN, 0, 8);
  assert.equal(L.plan(world, lights, NaN, 0, 8), nan); assert.equal(L.stats.plans, 1); assert.equal([...nan.level].some((v) => v > 0), false); const dim = L.plan(world, lights, 1, NaN, 8); assert.equal([...dim.level].every((v) => v === 0), true); assert.equal(dim.dark[0], darkness(1, 0)); assert.equal(L.plan(world, lights, 1, NaN, 8), dim);
  const ops = lightOps(L.plan(world, lights, 1, 0, 8), fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), "1,2,3");
  for (const op of ops) if (op.colour.startsWith("rgba(1,2,3,")) assert.equal(op.op, "add"); else assert.equal(op.op, undefined);
  assert.equal(ops.some((op) => op.op === "add"), true); assert.equal(ops.some((op) => op.op === undefined), true); assert.equal(lightOps(nan, fitView(64, 64, 1, 16, 16), snapCamera(0, 0, 1)).some((op) => op.op === "add"), false);
});
