import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDrawList, fitView, hash32, playerPx, shakeAt, shakeCam, snapCamera, stopMs, type Clip, type FxPiece, type LiveFx, type Sheet } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneClock, type SceneUnit, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";

const atk: Clip = { name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }] }, idle: Clip = { name: "idle-down", frames: [4, 5, 6, 7], ms: [40, 40, 40, 40] };
const asset = (fh: number): SceneAsset => ({ sheet: { id: "hero-sheet", columns: 4, fw: 16, fh }, clips: [atk, idle] });
const unit = (id: string, c: number): SceneUnit => ({ id, sprite: "hero", at: { c, r: 2 }, offset: null, facing: "E", alive: true, action: id === "a" ? "atk" : "idle" });
const slash: Sheet = { id: "slash", columns: 8, fw: 8, fh: 8 }, piece: FxPiece = { at: 0, ms: 900, sheet: slash, clip: { name: "s", frames: [0, 1, 2, 3, 4, 5, 6, 7], ms: [100, 100, 100, 100, 100, 100, 100, 100], loop: false }, anchor: "target" };
const fx = (over: Partial<LiveFx> = {}): LiveFx => ({ id: "e1", castMs: 1000, caster: "a", target: "b", pieces: [piece], ...over }); // hit = contact = 1300
const world = (effects: LiveFx[], fh = 16): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero: asset(fh) }, layers: [], units: [unit("a", 2), unit("b", 5)], objects: [], overlays: [], effects });
const at = (tMs: number, over: Partial<SceneClock> = {}): SceneClock => ({ tMs, stepMs: 10, ...over });

test("QA 33b-1 (G1 r2): non-finite hit_stop_ms is no stop; only the victim squashes, also with a stop; no squash for sprites 2 px tall or less (step 33b-1)", () => {
  assert.deepEqual([stopMs(Number.NaN, 10, false, false), stopMs(Number.POSITIVE_INFINITY, 10, false, false), stopMs(Number.POSITIVE_INFINITY, 10, false, true)], [0, 0, 0]);
  const sc = createSceneLink().scene(world([fx({ squash: true, hit_stop_ms: 100 })]), at(1330)), u = (k: string) => sc.standing.find((s) => s.kind === "unit" && s.key === k);
  assert.deepEqual([u("a")?.squash, u("b")?.squash], [undefined, true]); // the held attacker never squashes
  const tiny = createSceneLink().scene(world([fx({ squash: true })], 2), at(1330)), cmds = buildDrawList(tiny, fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 1330, 10).cmds;
  assert.deepEqual([cmds.some((c) => c.sheet.includes("~sq")), cmds.filter((c) => c.sheet === "hero-sheet").map((c) => c.sh)], [false, [2, 2]]);
});

test("QA 33b-1 (G1 r2): only the first 30 ms step kicks along the hit; x and y noise use their own axis; the seed is the effect's own; shake 0 is none on Low; the far map edge is in device px (step 33b-1)", () => {
  const kick = { at: 1000, px: 3, ms: 300, dx: 1, dy: 0, seed: 9 };
  assert.deepEqual([1030, 1060].map((t) => shakeAt([kick], t)), [1030, 1060].map((t) => shakeAt([{ ...kick, dx: 0 }], t))); // step 1 on: noise only
  assert.equal(Array.from({ length: 9 }, (_, i) => shakeAt([{ ...kick, dx: 0 }], 1030 + i * 30)).some((s) => s.x !== s.y), true);
  const ref = (id: string, t: number) => (({ x, y }) => ({ x, y }))(shakeAt([{ at: 1300, px: 3, ms: 300, dx: 0, dy: 0, seed: hash32(3, id, 0, 0) }], t)), times = [1300, 1330, 1360, 1390, 1420, 1450];
  for (const id of ["e1", "zz"]) { const L = createSceneLink(); assert.deepEqual(times.map((t) => { L.scene(world([fx({ id, shake: 3, shake_dir: "none" })]), at(t)); return L.shake; }), times.map((t) => ref(id, t))); }
  assert.notDeepEqual(times.map((t) => ref("e1", t)), times.map((t) => ref("zz", t)));
  const low = createSceneLink(); low.scene(world([fx({ shake: 0, shake_ms: 200 })]), at(1300, { shake: "low" }));
  assert.deepEqual([playerPx(0, "low", false), low.shake], [0, { x: 0, y: 0 }]);
  const fit = fitView(128, 128, 2, 16, 16), deep = snapCamera(200, 200, 2); // devX 400, past (320 - 64) art px but well short of the far edge at 512 device px
  assert.deepEqual(shakeCam(deep, -6, -6, 320, 320, fit), { ...deep, devX: 406, devY: 406 });
});
