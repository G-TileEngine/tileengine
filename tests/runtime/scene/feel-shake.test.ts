import assert from "node:assert/strict";
import { test } from "node:test";
import { createClock } from "../../../src/core/clock/index.ts";
import { createDriver, type HostEnv } from "../../../src/runtime/host/raf-driver.ts";
import { FEEL, buildDrawList, createFxLive, fitView, frameAt, hash32, instanceOffset, mergeHolds, playerPx, shakeAt, shakeCam, shakeLen, shakePx, snapCamera, steadyUi, squashed, stopMs, warp, type Clip, type FxPiece, type LiveFx, type Pixels, type RenderScene, type Sheet, type Standing } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneClock, type SceneUnit, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { FakeCanvas } from "../canvas/fake-canvas.ts";

const unitSheet: Sheet = { id: "hero-sheet", columns: 4, fw: 16, fh: 16 }, slash: Sheet = { id: "slash", columns: 8, fw: 8, fh: 8 };
const atk: Clip = { name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }], points: { hand: [[2, 2], [4, 4], [6, 6], [8, 8]] } }, idle: Clip = { name: "idle-down", frames: [4, 5, 6, 7], ms: [40, 40, 40, 40] };
const hero: SceneAsset = { sheet: unitSheet, clips: [atk, idle] };
const unit = (id: string, c: number, over: Partial<SceneUnit> = {}): SceneUnit => ({ id, sprite: "hero", at: { c, r: 2 }, offset: null, facing: "E", alive: true, action: id === "a" ? "atk" : "idle", ...over });
const piece: FxPiece = { at: 0, ms: 900, sheet: slash, clip: { name: "s", frames: [0, 1, 2, 3, 4, 5, 6, 7], ms: [100, 100, 100, 100, 100, 100, 100, 100], loop: false }, anchor: "target" };
const fx = (over: Partial<LiveFx> = {}): LiveFx => ({ id: "e1", castMs: 1000, caster: "a", target: "b", pieces: [piece], ...over }); // hit = contact = 1300
const world = (effects: LiveFx[], over: Partial<SceneWorld> = {}): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero }, layers: [], units: [unit("a", 2), unit("b", 5)], objects: [], overlays: [], effects, ...over });
const at = (tMs: number, over: Partial<SceneClock> = {}): SceneClock => ({ tMs, stepMs: 10, ...over });
const st = (sc: RenderScene, key: string): Standing | undefined => sc.standing.find((s) => s.kind === "unit" && s.key === key);
const fxFrame = (sc: RenderScene): number | undefined => sc.overlays.find((o) => o.band === "fxAir")?.frame;
const snap = (link: ReturnType<typeof createSceneLink>, w: SceneWorld, t: number, over: Partial<SceneClock> = {}) => { const sc = link.scene(w, at(t, over)); return { sc, a: st(sc, "a"), b: st(sc, "b"), fx: fxFrame(sc), shake: link.shake }; };
const off = (key: string, clip: Clip): number => instanceOffset(clip, 10, 3, `hero-sheet#${key}`, 0, 0);

test("hit-stop: the effect, attacker and victim hold at hitAt for hit_stop_ms (view time only), then the effect plays on late; 0-150 on ticks, reduce motion 0, reduce flashes 50; overlaps end at the latest end capped 150 ms past the first start (step 33b-1)", () => {
  const w = world([fx({ hit_stop_ms: 100 })]), plain = world([fx()]), link = createSceneLink(), ref = createSceneLink();
  const held = [1330, 1360, 1390].map((t) => snap(link, w, t)), after = snap(link, w, 1500), late = snap(ref, plain, 1410);
  assert.deepEqual([held.map((h) => h.fx), after.fx, late.fx], [[3, 3, 3], 4, 4]); // the effect holds its hitAt pose, then plays 100 ms late
  assert.deepEqual(held.map((h) => [h.a?.clip, h.a?.frame, h.b?.clip, h.b?.frame]), held.map(() => [undefined, frameAt(atk, 1300, 10, off("a", atk)).frame, undefined, frameAt(idle, 1300, 10, off("b", idle)).frame]));
  assert.deepEqual([snap(link, w, 1410).a?.clip, snap(link, w, 1290).a?.clip], [atk, atk]); // the units run their own clock again at the end; nothing holds before the hit
  assert.deepEqual([snap(createSceneLink(), w, 1950).fx, snap(createSceneLink(), plain, 1950).fx], [7, undefined]); // the effect ends stop ms late
  assert.equal(createSceneLink().scene(w, at(1330, { reduce: true })).standing.find((s) => s.key === "a")?.clip, atk); // reduce motion: no stop
  assert.deepEqual([stopMs(100, 10, false, false), stopMs(95, 10, false, false), stopMs(400, 10, false, false), stopMs(100, 10, true, false), stopMs(100, 10, false, true), stopMs(-5, 10, false, false), stopMs("x", 10, false, false)], [100, 100, 150, 0, 50, 0, 0]);
  const fl = createSceneLink(); assert.deepEqual([snap(fl, w, 1340, { reduceFlashes: true }).a?.clip, snap(fl, w, 1360, { reduceFlashes: true }).a?.clip], [undefined, atk]); // reduce flashes: 50 ms
  assert.deepEqual(mergeHolds([{ from: 1380, to: 1530 }, { from: 1300, to: 1400 }, { from: 2000, to: 2050 }, { from: 5, to: 5 }]), [{ from: 1300, to: 1450 }, { from: 2000, to: 2050 }]);
  assert.deepEqual(mergeHolds([{ from: 0, to: 100 }, { from: 50, to: 120 }]), [{ from: 0, to: 120 }]); // the latest end, not a sum
  const two = world([fx({ hit_stop_ms: 100 }), fx({ id: "e2", castMs: 1080, hit_stop_ms: 150 })]), L = createSceneLink(); // hits 1300 and 1380
  assert.deepEqual([1420, 1440, 1470].map((t) => snap(L, two, t).b?.clip), [undefined, undefined, idle]);
  assert.deepEqual([warp(50, { from: 100, to: 200 }), warp(150, { from: 100, to: 200 }), warp(250, { from: 100, to: 200 }), warp(250, null)], [50, 100, 150, 250]);
  assert.equal(link.scene(w, at(1330)).standing.filter((s) => s.kind === "unit").length, 2); assert.equal(snap(createSceneLink(), w, 1305).a?.clip, atk); // holds start on the pose grid
  const F = createSceneLink(); assert.deepEqual([snap(F, w, 1360).a?.clip, snap(F, w, 1360, { reduceFlashes: true }).a?.clip], [undefined, atk]); // reduce flashes is in the scene key
  const g = { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 3 }; assert.deepEqual([createFxLive().frame([fx({ hit_stop_ms: 100 })], () => null, 1940, 1950, g).dueMs, createFxLive().frame([fx()], () => null, 1940, 1950, g).dueMs], [1980, Infinity]);
});

test("shiver: during hit-stop the victim moves ±1 art px every 30 ms pose step (60 in lite); the attacker and the effect stay still; none under reduce motion (step 33b-1)", () => {
  const w = world([fx({ hit_stop_ms: 150 })]), link = createSceneLink();
  const rows = [1320, 1350, 1380, 1410].map((t) => snap(link, w, t));
  assert.deepEqual(rows.map((r) => [r.b?.ox, r.a?.ox, r.fx]), [[-1, undefined, 3], [1, undefined, 3], [-1, undefined, 3], [1, undefined, 3]]);
  const ref = createSceneLink().scene(world([fx()]), at(1300)).overlays[0], mine = rows[1]?.sc.overlays[0];
  assert.deepEqual([mine?.x, mine?.y], [ref?.x, ref?.y]); // the effect does not follow the shiver
  assert.deepEqual([1320, 1350, 1380].map((t) => snap(createSceneLink(), w, t, { lite: true }).b?.ox), [-1, -1, 1]);
  assert.equal(snap(createSceneLink(), w, 1330, { reduce: true }).b?.ox, undefined);
  assert.equal(snap(createSceneLink(), w, 1470).b?.ox, undefined);
  const hand: FxPiece = { at: 0, ms: 900, sheet: slash, anchor_point: "hand", attach: "follow", draw_layer: "front-unit" }, times = [1320, 1350, 1380, 1410, 1440], H = createSceneLink();
  const oxs = times.map((t) => H.scene(world([fx({ hit_stop_ms: 150, pieces: [hand] })]), at(t)).standing.find((s) => s.kind === "fxFront")?.ox), free = times.map((t) => createSceneLink().scene(world([fx({ pieces: [hand] })]), at(t)).standing.find((s) => s.kind === "fxFront")?.ox);
  assert.deepEqual([new Set(oxs).size, oxs[0] !== undefined, new Set(free).size > 1], [1, true, true]); // a follow piece reads the held attacker pose
});

test("squash: with squash on, the victim draws one 60 ms frame 2 px wider and 2 px shorter with its feet kept, nearest at art res; off by default and under reduce motion (step 33b-1)", () => {
  const w = world([fx({ squash: true })]), link = createSceneLink();
  const on = snap(link, w, 1330), cell = frameAt(idle, 1320, 10, off("b", idle)).frame;
  assert.deepEqual([on.b?.squash, on.b?.clip, on.b?.frame, on.a?.squash], [true, undefined, cell, undefined]);
  assert.deepEqual([snap(link, w, 1380).b?.squash, snap(link, w, 1290).b?.squash, snap(createSceneLink(), world([fx()]), 1330).b?.squash, snap(createSceneLink(), w, 1330, { reduce: true }).b?.squash], [undefined, undefined, undefined, undefined]);
  const cmd = buildDrawList(on.sc, fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 1330, 10).cmds.find((c) => c.sheet.includes("~sq"));
  const plainCmd = buildDrawList(snap(createSceneLink(), world([fx()]), 1330).sc, fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 1330, 10).cmds.find((c) => c.sx === (cell % 4) * 16 && c.dx === 5 * 16);
  assert.deepEqual([cmd?.sheet, cmd?.sx, cmd?.sw, cmd?.sh, cmd?.dw, cmd?.dh, cmd?.dx, cmd?.dy], [`hero-sheet~sq${cell}~16x16`, 0, 18, 14, 18, 14, (plainCmd?.dx ?? 0) - 1, (plainCmd?.dy ?? 0) + 2]);
  const src: Pixels = { w: 4, h: 4, data: new Uint8ClampedArray(64).map((_, i) => (i % 4 === 0 ? Math.floor(i / 16) * 10 + ((i / 4) % 4) : 255)) }, asked: string[] = [];
  const out = squashed("hero~sq7~4x4", (id, f, fw, fh) => { asked.push(`${id}:${f}:${fw}x${fh}`); return src; });
  assert.deepEqual([asked, out?.w, out?.h, Array.from({ length: 12 }, (_, i) => out?.data[i * 4])], [["hero:7:4x4"], 6, 2, [10, 11, 11, 12, 13, 13, 30, 31, 31, 32, 33, 33]]); // rows 1 and 3 of 4: the feet row stays
  assert.deepEqual([squashed("hero~sq1~4x2", () => src), squashed("hero~m0~k", () => src), squashed("hero~sq1~4x4", () => undefined), squashed("hero~sq1~4x4", () => ({ w: 3, h: 4, data: new Uint8ClampedArray(48) }))], [undefined, undefined, undefined, undefined]);
  assert.equal(createSceneLink((_id, _f, fw, fh) => ({ w: fw, h: fh, data: new Uint8ClampedArray(fw * fh * 4) })).pixels("hero~sq0~16x16")?.w, 18); assert.equal(link.lagged(), 0); // a squash alone is no hold: no late clock
});

test("shake: 0-3 art px (4+ plays as 3, negative as 0, outOfRange), 120/200/300 ms by strength or shake_ms 80-400; trauma² peaking at the strength, max then cap 3; whole px, seeded, stepped every 30 ms, first step along the hit; player Off/Low/Full and reduce motion (step 33b-1)", () => {
  assert.deepEqual([shakePx(undefined), shakePx(2), shakePx(4), shakePx(-1), shakePx(1.5), shakePx("x")], [{ px: 0, bad: false }, { px: 2, bad: false }, { px: 3, bad: true }, { px: 0, bad: true }, { px: 1, bad: true }, { px: 0, bad: true }]);
  assert.deepEqual([shakeLen(undefined, 1).ms, shakeLen(undefined, 2).ms, shakeLen(undefined, 3).ms, shakeLen(500, 3), shakeLen(50, 1), shakeLen(250, 1)], [120, 200, 300, { ms: 400, bad: true }, { ms: 80, bad: true }, { ms: 250, bad: false }]);
  assert.deepEqual([playerPx(3, undefined, false), playerPx(3, "full", false), playerPx(3, "low", false), playerPx(1, "low", false), playerPx(2, "low", false), playerPx(3, "off", false), playerPx(3, "full", true), playerPx(0, "full", false)], [3, 3, 1, 1, 1, 0, 0, 0]);
  const kick = { at: 1000, px: 3, ms: 300, dx: 1, dy: 0, seed: 9 }, samples = Array.from({ length: 12 }, (_, i) => shakeAt([kick], 1000 + i * 25));
  assert.deepEqual([shakeAt([kick], 1000), shakeAt([kick], 1029).x, shakeAt([kick], 999), shakeAt([kick], 1300)], [{ x: 3, y: 0, nextMs: 1030 }, 3, { x: 0, y: 0, nextMs: 1000 }, { x: 0, y: 0, nextMs: Infinity }]);
  assert.equal(samples.every((s) => Number.isInteger(s.x) && Number.isInteger(s.y) && Math.abs(s.x) <= 3 && Math.abs(s.y) <= 3), true);
  assert.deepEqual(shakeAt([kick], 1100), shakeAt([{ ...kick }], 1100)); assert.equal(shakeAt([kick], 1100).nextMs, 1120); // replays exactly; next grid step
  assert.equal(Array.from({ length: 9 }, (_, i) => shakeAt([kick], 1030 + i * 30)).some((s) => s.x !== 0 || s.y !== 0), true); // noise after the kick
  assert.equal(new Set(Array.from({ length: 9 }, (_, i) => JSON.stringify(shakeAt([{ ...kick, dx: 0 }], 1030 + i * 30)))).size > 1, true);
  const late = Array.from({ length: 3 }, (_, i) => shakeAt([kick], 1250 + i * 10)); assert.equal(late.every((s) => Math.abs(s.x) <= 1 && Math.abs(s.y) <= 1), true); // trauma² decays
  assert.deepEqual(shakeAt([{ ...kick, px: 1, dx: -1 }, { ...kick, px: 3, dx: 0, dy: 1 }], 1000), { x: 0, y: 3, nextMs: 1030 }); // max, never a sum
  assert.deepEqual([shakeAt([{ ...kick, px: 9 }], 1000).x, shakeAt([{ ...kick, dx: 5, dy: -7 }], 1000)], [3, { x: 3, y: -3, nextMs: 1030 }]);
  const w = world([fx({ shake: 2 })]), link = createSceneLink(), hit = snap(link, w, 1300);
  assert.deepEqual([hit.shake, snap(link, w, 1500).shake, snap(link, w, 1290).shake], [{ x: 2, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]); // caster west of target: kick east
  assert.deepEqual([snap(createSceneLink(), w, 1300, { shake: "low" }).shake, snap(createSceneLink(), w, 1300, { shake: "off" }).shake, snap(createSceneLink(), w, 1300, { reduce: true }).shake, snap(createSceneLink(), world([fx({ shake: 2, shake_dir: "none" })]), 1300).shake], [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, (({ x, y }) => ({ x, y }))(shakeAt([{ at: 1300, px: 2, ms: 200, dx: 0, dy: 0, seed: hash32(3, "e1", 0, 0) }], 1300))]); // shake_dir none: no kick, just noise
  const due = createSceneLink(); due.scene(world([fx({ shake: 3, shake_ms: 400, pieces: [] })]), at(1300)); assert.deepEqual(due.shake, { x: 3, y: 0 });
  const bad = createSceneLink(); for (const t of [1300, 1310, 1320]) bad.scene(world([fx({ shake: 4, shake_ms: 9000 })]), at(t));
  assert.deepEqual(bad.notices.map((n) => `${n.code}:${n.message}`), ["outOfRange:shake", "outOfRange:shake_ms"]); assert.deepEqual(bad.shake, { x: 3, y: 0 });
  assert.deepEqual(shakeAt([{ ...kick, dx: 0 }, { at: 1150, px: 1, ms: 300, dx: 1, dy: 0, seed: 4 }], 1150), { x: 1, y: 0, nextMs: 1180 }); // trauma²: the old 3 px hit is down to 0.75, below the new 1 px kick
  bad.scene(world([fx({ shake: 4 })])); assert.deepEqual(bad.shake, { x: 0, y: 0 }); // no clock, no shake
  assert.equal(createFxLive().frame([fx({ shake: 3, pieces: [] })], () => null, 1090, 1100, { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 3 }).dueMs, 1120); // shake keeps the frame due after the effect ends
  assert.deepEqual([FEEL.stopMaxMs, FEEL.stopFlashMs, FEEL.squashMs, FEEL.shakeGridMs, FEEL.shakeMax], [150, 50, 60, 30, 3]);
});

test("run late: a held unit resumes on the pose it froze on, its clip running late by the hold until its clip changes; units never held keep their own clock; one offset per held unit, none kept for gone units (step 33b-1 r2)", () => {
  const w = world([fx({ hit_stop_ms: 100 }), fx({ id: "e2", castMs: 2000, hit_stop_ms: 100 })], { units: [unit("a", 2), unit("b", 5), unit("c", 7)] }), link = createSceneLink(), fit = fitView(160, 96, 1, 16, 16), cam = snapCamera(0, 0, 1);
  const cell = (sc: RenderScene, t: number, c: number): number | undefined => { const k = buildDrawList(sc, fit, cam, t, 10).cmds.find((d) => d.sheet === "hero-sheet" && d.dx === c * 16); return k === undefined ? undefined : k.sx / 16 + (k.sy / 16) * 4; };
  for (const t of [1290, 1320, 1350, 1380]) link.scene(w, at(t));
  const after = [1410, 1440, 1500].map((t) => snap(link, w, t)), held = frameAt(idle, 1300, 10, off("b", idle)).frame;
  assert.deepEqual(after.map((r) => [r.a?.lagMs, r.b?.lagMs, st(r.sc, "c")?.lagMs]), after.map(() => [100, 100, undefined]));
  assert.deepEqual([cell(after[0]?.sc ?? w as never, 1400, 5), held !== frameAt(idle, 1400, 10, off("b", idle)).frame], [held, true]); // the victim resumes on the held pose
  assert.deepEqual([1410, 1440, 1500].map((t, i) => cell(after[i]?.sc ?? w as never, t, 5)), [1310, 1340, 1400].map((t) => frameAt(idle, t, 10, off("b", idle)).frame));
  assert.deepEqual([cell(after[2]?.sc ?? w as never, 1500, 7), link.lagged()], [frameAt(idle, 1500, 10, off("c", idle)).frame, 2]); // never held: own clock; one offset per held unit
  assert.deepEqual([snap(link, w, 2330).b?.frame, snap(link, w, 2410).b?.lagMs, link.lagged()], [frameAt(idle, 2200, 10, off("b", idle)).frame, 200, 2]); // a second hold freezes on the late pose and adds up
  const hand: FxPiece = { at: 0, ms: 900, sheet: slash, anchor_point: "hand", attach: "follow", draw_layer: "front-unit" }, H = createSceneLink(), hw = world([fx({ hit_stop_ms: 100, pieces: [hand] })]);
  for (const t of [1320, 1350, 1380]) H.scene(hw, at(t));
  assert.equal(H.scene(hw, at(1500)).standing.find((s) => s.kind === "fxFront")?.ox, createSceneLink().scene(world([fx({ pieces: [hand] })]), at(1400)).standing.find((s) => s.kind === "fxFront")?.ox); // follow pieces read the late pose
  const swapped = world(w.effects as LiveFx[], { units: [unit("a", 2, { action: "idle" }), unit("b", 5, { action: "atk" }), unit("c", 7)] }), cleared = snap(link, swapped, 2600);
  assert.deepEqual([cleared.a?.lagMs, cleared.b?.lagMs, link.lagged(), snap(link, w, 2700).b?.lagMs], [undefined, undefined, 0, undefined]); // the offset clears on the next clip and stays cleared
  const gone = createSceneLink(); for (const t of [1320, 1410]) gone.scene(w, at(t)); gone.scene(world([], { units: [] }), at(1500)); assert.equal(gone.lagged(), 0); // nothing kept for gone units
});

test("HUD never shakes: the driver builds the world with the shaken camera (whole art px times the scale, never past a map edge), so no edge pixel shows the clear colour at max shake; the night layer shakes with it; the ui band stays put; a shake change redraws (step 33b-1 r2)", async () => {
  const list = { dueMs: 5, cmds: [{ band: "base", sheet: "a", sx: 0, sy: 0, sw: 8, sh: 8, dx: 10, dy: 10, dw: 8, dh: 8, op: "normal", flipX: false }, { band: "ui", sheet: "hud", sx: 0, sy: 0, sw: 8, sh: 8, dx: 1, dy: 1, dw: 8, dh: 8, op: "normal", flipX: false }] } as const;
  assert.deepEqual(steadyUi(list, 4, -2).cmds.map((c) => [c.dx, c.dy]), [[10, 10], [5, -1]]); assert.equal(steadyUi(list, 0, 0), list);
  const fit = fitView(128, 128, 2, 16, 16), mid = snapCamera(100, 100, 2), corner = snapCamera(0, 0, 2), far = snapCamera(256, 256, 2);
  assert.deepEqual([shakeCam(mid, 6, -6, 320, 320, fit), shakeCam(corner, 6, 6, 320, 320, fit), shakeCam(corner, -6, -6, 320, 320, fit), shakeCam(far, -6, 6, 320, 320, fit), shakeCam(mid, 0, 0, 320, 320, fit) === mid], [{ ...mid, devX: 194, devY: 206 }, corner, { ...corner, devX: 6, devY: 6 }, { ...far, devY: 506 }, true]);
  const tile = (c: number) => ({ w: 16, h: 16, px: new Uint32Array(256).fill(c) }), CLEAR = 0xff000000;
  const scene: RenderScene = { cols: 20, rows: 20, tileW: 16, tileH: 16, mapSeed: 1, ground: [{ sheet: { id: "t", columns: 1, fw: 16, fh: 16 }, tiles: Array.from({ length: 400 }, () => 0) }], above: [], standing: [], overlays: [{ band: "fxAir", sheet: { id: "w", columns: 1, fw: 8, fh: 8 }, x: 120, y: 120 }, { band: "ui", sheet: { id: "hud", columns: 1, fw: 8, fh: 8 }, x: 104, y: 104 }] };
  const q: ((ts: number) => void)[] = [], env: HostEnv = { requestAnimationFrame: (cb) => q.push(cb), cancelAnimationFrame: () => undefined, devicePixelRatio: 1, document: { visibilityState: "visible", addEventListener: () => undefined, removeEventListener: () => undefined, createElement: () => new FakeCanvas() } };
  let shake: { x: number; y: number } | undefined = { x: 3, y: 3 }, x = 100; const lights = { res: 4, w: 8, h: 4, dark: new Uint8Array(32), level: new Uint8Array(32) }, canvas = Object.assign(new FakeCanvas(), { clientWidth: 128, clientHeight: 128 });
  const drv = createDriver({ env, canvas, clock: createClock(), view: () => ({ scene, x, y: x, s: 2, lights, ...(shake === undefined ? {} : { shake }) }), load: (id) => Promise.resolve(tile(id === "t" ? 0xff336699 : 0xff00ff00)) });
  const drawn: string[] = [], cams: number[] = [], be = drv.backend, draw = be.drawImage.bind(be), lit = be.lights.bind(be);
  be.drawImage = (id, sx, sy, sw, sh, dx, dy, dw, dh, op, flip) => { drawn.push(`${id}@${dx},${dy}`); draw(id, sx, sy, sw, sh, dx, dy, dw, dh, op, flip); };
  be.lights = (plan, f, c) => { cams.push(c.devX, c.devY); lit(plan, f, c); };
  drv.start(); let ts = 1000, last: string[] = []; const tick = async (n: number) => { for (let i = 0; i < n; i += 1) { drawn.length = 0; const cb = q.shift(); ts += 16; cb?.(ts); if (drawn.length > 0) last = [...drawn]; await new Promise((r) => setImmediate(r)); } };
  const clearAt = (): number => canvas.px.filter((p) => p === CLEAR || p === 0).length;
  await tick(12); const shook = last;
  assert.deepEqual([clearAt(), shook.filter((d) => d.startsWith("w") || d.startsWith("hud")), cams.slice(-2)], [0, [`w@${240 - 194},${240 - 194}`, "hud@8,8"], [194, 194]]); // max shake: the world moves 6 device px, no clear edge; the HUD stays
  shake = { x: -3, y: -3 }; await tick(4); assert.deepEqual([clearAt(), cams.slice(-2)], [0, [206, 206]]); // a shake change alone redraws
  x = 0; shake = { x: 3, y: 3 }; await tick(4); assert.deepEqual([clearAt(), cams.slice(-2)], [0, [0, 0]]); // at the map corner the shake stops at the edge
  x = 100; shake = { x: 0, y: 0 }; await tick(1); const still = drawn.filter((d) => d.startsWith("w") || d.startsWith("hud")); await tick(1);
  assert.deepEqual([still, drawn.length], [["w@40,40", "hud@8,8"], 0]); // a shake change redraws; no change, no draw
  shake = undefined; await tick(1); assert.equal(drawn.length, 0); drv.dispose();
});
