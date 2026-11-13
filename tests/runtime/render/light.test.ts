import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDrawList, clipMs, createLighting, createMoonlit, createSight, darkness, fitView, lightOps, openCell, snapCamera, visibleCells, type LightPlan, type RenderScene } from "../../../src/runtime/render/index.ts";
import * as render from "../../../src/runtime/render/index.ts";
import { createSceneLink } from "../../../src/runtime/scene/world-scene.ts";

const grid = (cols: number, rows: number, walls: readonly (readonly [number, number])[]) => { const blocks = new Uint8Array(cols * rows); for (const [c, r] of walls) blocks[r * cols + c] = 1; return { cols, rows, blocks }; };
const world = (cols = 10, rows = 10, walls: readonly (readonly [number, number])[] = []) => ({ ...grid(cols, rows, walls), tileW: 16, tileH: 16 });
const row = (arr: ArrayLike<number>, w: number, y: number): number[] => Array.from(arr).slice(y * w, (y + 1) * w);
const lit = (plan: LightPlan): number => [...plan.level].filter((v) => v > 0).length;
const sheet = (id: string) => ({ id, columns: 8, fw: 16, fh: 16 });

test("line of sight: shadowcasting stops at walls, lights the wall faces, shadows behind a pillar and moves a torch out of a wall (step 31)", () => {
  const col = visibleCells(grid(9, 9, Array.from({ length: 9 }, (_, r) => [5, r])), 2, 4, 8);
  assert.deepEqual(row(col, 9, 4), [1, 1, 1, 1, 1, 1, 0, 0, 0]); assert.equal([...col].some((v, i) => v === 1 && i % 9 > 5), false); assert.equal(visibleCells(grid(9, 9, []), 4, 4, 3).reduce((n, v) => n + v, 0), 29);
  const pillar = visibleCells(grid(9, 9, [[4, 4]]), 2, 4, 8); assert.deepEqual(row(pillar, 9, 4), [1, 1, 1, 1, 1, 0, 0, 0, 0]); assert.equal(pillar[3 * 9 + 6], 1);
  const stair = visibleCells(grid(12, 12, Array.from({ length: 9 }, (_, i) => [i, 8 - i])), 2, 2, 20); assert.equal([...stair].some((v, i) => v === 1 && (i % 12) + Math.floor(i / 12) >= 10), false);
  assert.deepEqual(openCell(grid(4, 4, [[1, 1], [1, 0]]), 1, 1), { c: 2, r: 1 }); assert.equal(openCell(grid(3, 3, Array.from({ length: 9 }, (_, i) => [i % 3, Math.floor(i / 3)])), 1, 1), null);
  const torch = createLighting().plan(world(7, 7, [[3, 3]]), [{ x: 56, y: 56, radius: 48 }], 1, 0, 8); assert.ok((torch.level[4 * torch.w + 7] ?? 0) > 0); assert.equal(torch.level[12 * torch.w + 7], 0); });
test("masks and plans are cached: recomputed only when the light changes cell, the blockers change, or a light, wash or dim input changes (step 31)", () => {
  const sight = createSight(), g = grid(9, 9, []); sight.mask(g, 2, 4, 8); const once = sight.stats.computed; sight.mask(g, 2, 4, 8); assert.equal(sight.stats.computed, once);
  sight.mask(g, 3, 4, 8); assert.equal(sight.stats.computed, once + 1); sight.mask(grid(9, 9, []), 2, 4, 8); assert.equal(sight.stats.computed, once + 2);
  const blocks = new Uint8Array(64), shape = createSight(), narrow = shape.mask({ cols: 4, rows: 8, blocks }, 1, 1, 3), wide = shape.mask({ cols: 8, rows: 8, blocks }, 1, 1, 3);
  assert.equal(shape.stats.computed, 2); assert.notEqual(narrow.length, wide.length);
  const big = grid(40, 20, []), cap = createSight(); for (let i = 0; i < 300; i += 1) cap.mask(big, i % 40, Math.floor(i / 40), 2);
  const full = cap.stats.computed; cap.mask(big, 0, 0, 2); assert.equal(cap.stats.computed, full + 1);
  const lights = [{ x: 80, y: 80, radius: 48 }], L = createLighting(), w = world(), plan = L.plan(w, lights, 1, 0, 8), held = L.stats.masks.computed;
  assert.equal(L.plan(w, lights, 1, 0, 8), plan); assert.equal(L.stats.plans, 1); L.plan(w, [{ x: 81, y: 80, radius: 48 }], 1, 0, 8); assert.equal(L.stats.masks.computed, held);
  L.plan(w, [{ x: 96, y: 80, radius: 48 }], 1, 0, 8); assert.equal(L.stats.masks.computed, held + 1); const at = L.stats.plans;
  assert.notEqual(L.plan(w, lights, 1, 0.25, 8), plan); assert.notEqual(L.plan(w, lights, 0.5, 0, 8), plan); assert.notEqual(L.plan(w, lights, 1, 0, 4), plan);
  assert.notEqual(L.plan(w, [{ x: 80, y: 80, radius: 48 }], 1, 0, 8), plan); assert.notEqual(L.plan(world(), lights, 1, 0, 8), plan); assert.equal(L.stats.plans, at + 5); });
test("six-step falloff: rings 6 down to 1 from the light, 0 past the radius and 0 behind a wall (step 31)", () => {
  const plan = createLighting().plan(world(), [{ x: 80, y: 80, radius: 48 }], 1, 0, 8);
  assert.deepEqual(row(plan.level, plan.w, 9), [0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0]);
  assert.deepEqual(row(plan.dark, plan.w, 9), [19, 19, 19, 19, 16, 13, 10, 6, 3, 0, 0, 3, 6, 10, 13, 16, 19, 19, 19, 19]); assert.deepEqual([...new Set(plan.level)].sort(), [0, 1, 2, 3, 4, 5, 6]);
  const walled = createLighting().plan(world(10, 10, Array.from({ length: 10 }, (_, r) => [7, r])), [{ x: 80, y: 80, radius: 48 }], 1, 0, 8);
  assert.ok((walled.level[9 * walled.w + 14] ?? 0) > 0); assert.deepEqual(row(walled.level, walled.w, 9).slice(16), [0, 0, 0, 0]); assert.deepEqual(row(walled.dark, walled.w, 9).slice(16), [19, 19, 19, 19]);
  const both = createLighting().plan(world(), [{ x: 40, y: 80, radius: 20 }, { x: 80, y: 80, radius: 80 }], 1, 0, 8); assert.ok((both.level[9 * both.w + 4] ?? 0) >= 5); });
test("darkness: the night wash and stage dim share one overlay capped at 0.72, and every alpha the light ops use is a whole 32nd (step 31)", () => {
  assert.deepEqual([[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.25], [-1, 2]].map(([w, d]) => darkness(w ?? 0, d ?? 0)), [0, 19, 23, 23, 15, 23]);
  const ops = lightOps(createLighting().plan(world(), [{ x: 80, y: 80, radius: 40 }], 1, 0.5, 4), fitView(320, 320, 1, 16, 16), snapCamera(0, 0, 1));
  for (const op of ops) { const k = Number(op.colour.slice(op.colour.lastIndexOf(",") + 1, -1)) * 32; assert.equal(k, Math.round(k)); assert.ok(k >= 1 && k <= 23); } });
test("stage dim: a torch keeps a half-size glow by default; a fullyDark light goes fully dark (step 31)", () => {
  const L = createLighting(), w = world(), far = (p: LightPlan): number => { let m = 0; const sx = Math.floor(80 / p.res); for (let iy = 0; iy < p.h; iy += 1) for (let ix = 0; ix < p.w; ix += 1) if ((p.level[iy * p.w + ix] ?? 0) > 0) m = Math.max(m, Math.abs(ix - sx), Math.abs(iy - sx)); return m; };
  const night = L.plan(w, [{ x: 80, y: 80, radius: 64 }], 1, 0, 8), dim = L.plan(w, [{ x: 80, y: 80, radius: 64 }], 1, 1, 8);
  assert.deepEqual([far(night), far(dim)], [8, 4]); assert.ok(lit(dim) * 3 < lit(night));
  const out = L.plan(w, [{ x: 80, y: 80, radius: 64, fullyDark: true }, { x: 40, y: 40, radius: 32 }], 1, 0.5, 8); assert.equal(out.dark[10 * out.w + 10], darkness(1, 0.5)); assert.ok(lit(out) > 0);
  assert.equal(lit(L.plan(w, [{ x: 80, y: 80, radius: 64, fullyDark: true }], 1, 0, 8)), lit(night)); });
test("stepped glow and runs: fills merge equal runs, stay inside the view, glow only on levels 4 to 6, and fit the draw budget (step 31)", () => {
  const plan = createLighting().plan(world(20, 20), [{ x: 64, y: 40, radius: 32 }, { x: 120, y: 70, radius: 32 }], 1, 0, 4);
  const fit = { ...fitView(160, 96, 1, 16, 16), padX: 3, padY: 5 }, cam = snapCamera(16, 8, 1), ops = lightOps(plan, fit, cam); assert.ok(ops.length > 20 && ops.length <= 300);
  const vx1 = fit.padX + fit.artW, vy1 = fit.padY + fit.artH, glow = ops.filter((o) => o.colour.startsWith("rgba(255"));
  for (let i = 0; i < ops.length; i += 1) { const o = ops[i], n = ops[i + 1]; if (o === undefined) continue; assert.equal((o.x - fit.padX + cam.devX) % plan.res, 0); assert.equal((o.y - fit.padY + cam.devY) % plan.res, 0); assert.ok(o.x + o.w > fit.padX - 4 && o.x < vx1 + 4 && o.y + o.h > fit.padY - 4 && o.y < vy1 + 4); if (n !== undefined && n.y === o.y && n.colour === o.colour) assert.notEqual(n.x, o.x + o.w); }
  assert.deepEqual([...new Set(glow.map((o) => o.colour))].sort(), ["rgba(255,176,72,0.0625)", "rgba(255,176,72,0.125)", "rgba(255,176,72,0.1875)"]);
  const hit = (ix: number, iy: number): boolean => glow.some((o) => { const x = ix * plan.res - cam.devX + fit.padX + 1, y = iy * plan.res - cam.devY + fit.padY + 1; return x >= o.x && x < o.x + o.w && y >= o.y && y < o.y + o.h; });
  let low = false, high = false; for (let iy = 0; iy < plan.h; iy += 1) for (let ix = 0; ix < plan.w; ix += 1) { const lv = plan.level[iy * plan.w + ix] ?? 0; if (lv > 0 && lv < 4 && hit(ix, iy)) low = true; if (lv === 6 && hit(ix, iy)) high = true; }
  assert.equal(low, false); assert.equal(high, true); });
test("moonlit swaps in the paired night sheets, keeps the scene stable, and has no tint mode (step 31)", () => {
  const above = { sheet: sheet("a"), tiles: [1] }, scene: RenderScene = { cols: 2, rows: 2, tileW: 16, tileH: 16, mapSeed: 1, ground: [{ sheet: sheet("g"), tiles: [1] }], above: [above], standing: [{ kind: "unit", sheet: sheet("s"), c: 0, r: 0 }], overlays: [{ band: "ui", sheet: sheet("o"), x: 0, y: 0 }] };
  const swap = new Map([["g", "gn"], ["s", "sn"], ["o", "on"]]), moon = createMoonlit(), first = moon(scene, swap);
  assert.equal(moon(scene, swap), first); assert.equal(first.ground[0]?.sheet.id, "gn"); assert.equal(first.standing[0]?.sheet.id, "sn"); assert.equal(first.overlays[0]?.sheet.id, "on"); assert.equal(first.above[0]?.sheet, above.sheet); assert.notEqual(moon(scene, new Map(swap)), first);
  assert.equal(Object.keys(render).some((name) => /tint/i.test(name)), false); });
test("R2-N1: a non-array ms plays by fps (or 8) and warns clipMsInvalid once per clip, never rewritten (step 31)", () => {
  for (const ms of ["100", null, { length: 2 }, 5]) { assert.deepEqual(clipMs({ name: "a", frames: [0, 1], fps: 4, ms: ms as unknown as readonly number[] }, 10), [250, 250]); assert.deepEqual(clipMs({ name: "a", frames: [0], ms: ms as unknown as readonly number[] }, 10), [130]); }
  const stored = { name: "a", frames: [0, 1], fps: 4, ms: "100" as unknown as readonly number[] }, link = createSceneLink(), base = { cols: 2, rows: 2, tileW: 16, tileH: 16, mapSeed: 1, layers: [], units: [], objects: [], overlays: [] };
  link.scene({ ...base, assets: { hero: { sheet: sheet("h"), clips: [stored, { name: "n", frames: [0], ms: null as unknown as readonly number[] }] } } });
  link.scene({ ...base, assets: { hero: { sheet: sheet("h"), clips: [stored] }, twin: { sheet: sheet("t"), clips: [stored] } } });
  assert.deepEqual(link.notices.map((n) => n.code), ["clipMsInvalid"]); assert.equal(stored.ms, "100"); });
test("Q26: the walking-unit seed keeps the sheet id, so two sprites with one key do not animate in lockstep (step 31)", () => {
  const walk = { name: "walk", frames: [0, 1, 2, 3, 4, 5, 6, 7], ms: [100, 100, 100, 100, 100, 100, 100, 100] }, fit = fitView(64, 64, 1, 16, 16), cam = snapCamera(0, 0, 1);
  const seq = (id: string): number[] => [0, 100, 200, 300, 400, 500, 600, 700].map((t) => { const cmd = buildDrawList({ cols: 2, rows: 2, tileW: 16, tileH: 16, mapSeed: 1, ground: [], above: [], standing: [{ kind: "unit", sheet: sheet(id), c: 0, r: 0, key: "u", clip: walk }], overlays: [] }, fit, cam, t, 10).cmds[0]; return (cmd?.sx ?? -1) + (cmd?.sy ?? -1); });
  assert.notDeepEqual(seq("h"), seq("k")); });
