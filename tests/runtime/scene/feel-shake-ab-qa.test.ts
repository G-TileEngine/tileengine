import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDrawList, fitView, frameAt, hash32, instanceOffset, mergeHolds, shakeAt, shakeCam, shakeLen, snapCamera, type Clip, type FxPiece, type LiveFx, type RenderScene, type Sheet } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneClock, type SceneUnit, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";

const sheet: Sheet = { id: "hero-sheet", columns: 4, fw: 16, fh: 16 }, slash: Sheet = { id: "slash", columns: 8, fw: 8, fh: 8 };
const atk: Clip = { name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }] }, idle: Clip = { name: "idle-down", frames: [4, 5, 6, 7], ms: [40, 40, 40, 40] };
const hero: SceneAsset = { sheet, clips: [atk, idle] }, statue: SceneAsset = { sheet: { id: "statue", columns: 1, fw: 16, fh: 16 } };
const unit = (id: string, c: number, over: Partial<SceneUnit> = {}): SceneUnit => ({ id, sprite: "hero", at: { c, r: 2 }, offset: null, facing: "E", alive: true, action: id === "a" ? "atk" : "idle", ...over });
const piece: FxPiece = { at: 0, ms: 900, sheet: slash, anchor: "target" };
const fx = (over: Partial<LiveFx> = {}): LiveFx => ({ id: "e1", castMs: 1000, caster: "a", target: "b", pieces: [piece], ...over }); // hit = contact = 1300
const world = (effects: LiveFx[], units: SceneUnit[] = [unit("a", 2), unit("b", 5)]): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero, statue }, layers: [], units, objects: [], overlays: [], effects });
const at = (tMs: number, over: Partial<SceneClock> = {}): SceneClock => ({ tMs, stepMs: 10, ...over });
const unitAt = (link: ReturnType<typeof createSceneLink>, w: SceneWorld, t: number, key: string) => link.scene(w, at(t)).standing.find((s) => s.kind === "unit" && s.key === key);

test("QA 33b-1 A/B: shake_dir none, or a hit with no aim, is seeded noise from the first 30 ms step; touching holds stay apart; the far map edge is whole art px at any backing size (step 33b-1 rulings 1, 4, 6)", () => {
  const seed = hash32(3, "e1", 0, 0), n = (axis: number): number => (hash32(seed, "shake", 0, axis) % 5) - 2, step0 = { x: n(0), y: n(1) }; // 2 px at step 0: noise in -2..2 per axis
  const shook = (w: SceneWorld): { x: number; y: number } => { const L = createSceneLink(); L.scene(w, at(1300)); return L.shake; };
  assert.deepEqual([shook(world([fx({ shake: 2, shake_dir: "none" })])), shook(world([fx({ shake: 2 })], [unit("a", 2), unit("b", 2)])), shook(world([{ id: "e1", castMs: 1000, caster: "a", at: { c: 4, r: 2 }, pieces: [piece], shake: 2 }]))], [step0, step0, step0]);
  assert.deepEqual(shakeAt([{ at: 1300, px: 2, ms: 200, dx: 0, dy: 0, seed }], 1300), { ...step0, nextMs: 1330 });
  assert.deepEqual(mergeHolds([{ from: 0, to: 100 }, { from: 100, to: 200 }]), [{ from: 0, to: 100 }, { from: 100, to: 200 }]); // [from, to): touching is not overlapping
  const L = createSceneLink(), w = world([fx({ hit_stop_ms: 100 }), fx({ id: "e2", castMs: 1100, hit_stop_ms: 100 })]); // hits 1300 and 1400
  assert.deepEqual([1330, 1390, 1460, 1490, 1500, 1520].map((t) => unitAt(L, w, t, "b")?.clip), [undefined, undefined, undefined, undefined, idle, idle]); // the second hold runs its full 100 ms
  assert.equal(unitAt(L, w, 1530, "b")?.lagMs, 200); // back-to-back holds add up, with no frame between them
  const xs = new Set(Array.from({ length: 200 }, (_, i) => shakeAt([{ at: 0, px: 3, ms: 300, dx: 0, dy: 0, seed: i }], 30).x)); assert.deepEqual([...xs].sort((p, q) => p - q), [-2, -1, 0, 1, 2]); // step 1 is 2 px: noise reaches both ends
  for (const [devW, s, x] of [[129, 2, 255], [130, 3, 276], [127, 2, 0]] as const) { const fit = fitView(devW, 128, s, 16, 16), cam = snapCamera(x, 0, s), far = (320 - fit.artW) * s, moved = shakeCam(cam, -3 * s, 0, 320, 320, fit).devX; assert.equal(moved % s, 0); assert.ok(moved <= far && (cam.devX + 3 * s > far ? moved === far : true)); }
});

test("QA 33b-1 A/B: only an effect's own target shivers, never a held attacker; a clipless victim shivers and squashes; a squash holds one cell for its 60 ms, the late cell on a late unit; the draw list never squashes a sprite 2 px tall; a shake_ms that is not a number plays as absent (step 33b-1 rulings 2, 3, 4, 9; EA folds)", () => {
  const trade = world([fx({ hit_stop_ms: 100 }), fx({ id: "e2", castMs: 2000, caster: "b", target: "a", hit_stop_ms: 100 })], [unit("a", 2), unit("b", 5, { action: "atk" })]), T = createSceneLink();
  assert.deepEqual([1330, 2330].map((t) => { const sc = T.scene(trade, at(t)), f = (k: string) => sc.standing.find((s) => s.key === k)?.ox; return [f("a"), f("b")]; }), [[undefined, -1], [-1, undefined]]);
  const S = createSceneLink(), stone = world([fx({ hit_stop_ms: 100, squash: true })], [unit("a", 2), unit("b", 5, { sprite: "statue" })]), b = unitAt(S, stone, 1340, "b");
  assert.deepEqual([b?.ox, b?.squash, unitAt(S, stone, 1420, "b")?.ox], [-1, true, undefined]);
  const fit = fitView(160, 96, 1, 16, 16), cam = snapCamera(0, 0, 1), drawnB = (sc: RenderScene) => buildDrawList(sc, fit, cam, 1330, 10).cmds.find((c) => c.sheet === "hero-sheet" && c.dx >= 5 * 16 - 8)?.dx;
  const hit = world([fx({ hit_stop_ms: 100 })]); assert.deepEqual([drawnB(createSceneLink().scene(hit, at(1330))), drawnB(createSceneLink().scene(world([fx()]), at(1330)))], [79, 80]); // the drawing moves by ox (-1) only
  assert.equal(unitAt(createSceneLink(), { ...world([fx({ squash: true })], [unit("a", 2), unit("b", 5, { sprite: "flat" })]), assets: { hero, statue, flat: { sheet: { id: "flat", columns: 1, fw: 16, fh: 2 } } } }, 1330, "b")?.squash ?? "none", "none"); // no squash flag on a 2 px sprite
  const cmd = buildDrawList(S.scene(stone, at(1330)), fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 1330, 10).cmds.find((c) => c.sheet.startsWith("statue"));
  assert.deepEqual([cmd?.sheet, cmd?.sw, cmd?.sh], ["statue~sq0~16x16", 18, 14]);
  const late = world([fx({ hit_stop_ms: 100 }), fx({ id: "e2", castMs: 2000, squash: true })]), G = createSceneLink(), off = instanceOffset(idle, 10, 3, "hero-sheet#b", 0, 0);
  for (const t of [1330, 1500]) G.scene(late, at(t));
  assert.deepEqual([2310, 2340].map((t) => { const sq = unitAt(G, late, t, "b"); return [sq?.squash, sq?.frame]; }), [2310, 2310].map((t) => [true, frameAt(idle, t - 100, 10, off).frame])); // one cell for all 60 ms: the late cell at the squash start (EA fold)
  const short = createSceneLink(); assert.deepEqual([1320, 1350].map((t) => short.scene(world([fx({ hit_stop_ms: 100, squash: true })]), at(t, { reduceFlashes: true })).standing.find((x) => x.key === "b")?.frame), [1300, 1300].map((t) => frameAt(idle, t, 10, off).frame)); // a 50 ms stop ends inside the squash: still the held cell
  assert.deepEqual([shakeLen("x", 1), shakeLen(Number.NaN, 3)], [{ ms: 120, bad: true }, { ms: 300, bad: true }]); // EA fold Q4: not a number plays as absent, with outOfRange
  const tiny: RenderScene = { cols: 4, rows: 4, tileW: 16, tileH: 16, mapSeed: 1, ground: [], above: [], standing: [{ kind: "unit", sheet: { id: "flat", columns: 1, fw: 16, fh: 2 }, c: 1, r: 1, key: "f", frame: 0, squash: true }], overlays: [] };
  assert.deepEqual(buildDrawList(tiny, fitView(64, 64, 1, 16, 16), snapCamera(0, 0, 1), 0, 10).cmds.map((c) => [c.sheet, c.sh]), [["flat", 2]]);
});
