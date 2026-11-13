import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDrawList, clipIndex, createFxLive, fitView, instanceOffset, snapCamera, type Clip, type FxPiece, type LiveFx, type Overlay, type RenderScene, type Sheet, type Standing } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneUnit, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";

const unitSheet: Sheet = { id: "hero-sheet", columns: 4, fw: 16, fh: 16 }, slash: Sheet = { id: "slash", columns: 1, fw: 8, fh: 8 };
const atk: Clip = { name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 2, name: "release" }, { frame: 3, name: "contact" }], points: { hand: [[12, 6]] } };
const hero: SceneAsset = { sheet: unitSheet, clips: [atk, { name: "idle-down", frames: [0] }] };
const unit = (id: string, c: number, facing: SceneUnit["facing"] = "E", over: Partial<SceneUnit> = {}): SceneUnit => ({ id, sprite: "hero", at: { c, r: 2 }, offset: null, facing, alive: true, action: "atk", ...over });
const piece = (over: Partial<FxPiece> = {}): FxPiece => ({ at: 0, ms: 400, sheet: slash, anchor_point: "hand", draw_layer: "front-unit", ...over });
const fx = (over: Partial<LiveFx> = {}): LiveFx => ({ id: "e1", castMs: 1000, caster: "a", pieces: [piece()], ...over });
const assets: Readonly<Record<string, SceneAsset>> = { hero };
const world = (over: Partial<SceneWorld> = {}): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets, layers: [], units: [unit("a", 2)], objects: [], overlays: [], ...over });
const at = (tMs: number, lite = false) => ({ tMs, stepMs: 10, lite });
const fxOf = (sc: RenderScene): (Standing | Overlay)[] => [...sc.standing.filter((s) => s.kind === "fxFront" || s.kind === "fxBehind"), ...sc.overlays];
const xOf = (sc: RenderScene): number | undefined => { const o = sc.overlays[0]; return o === undefined ? undefined : o.x; };
const names = (link: { fired: readonly { type: string; name?: string; at: number }[] }): string[] => link.fired.map((e) => `${e.name ?? e.type}@${e.at}`);

test("live canopy: seeThroughCanopy cuts the above layer at each unit's cell and the cell above it; absent or false keeps it; a still world keeps one scene object (step 33h)", () => {
  const tiles = Array.from({ length: 60 }, () => 5), layers = [{ tileset: "hero", aboveUnits: true, visible: true, tiles }], link = createSceneLink();
  const on = link.scene(world({ layers, seeThroughCanopy: true }), at(0)), cut = on.above[0]?.tiles ?? [];
  assert.deepEqual([cut[2 * 10 + 2], cut[1 * 10 + 2], cut[2 * 10 + 3], cut[3 * 10 + 2], cut.filter((t) => t === null).length], [null, null, 5, 5, 2]);
  const w = world({ layers, seeThroughCanopy: true }), first = link.scene(w, at(10));
  assert.equal(link.scene(w, at(20)), first); assert.equal(link.scene({ ...w, seeThroughCanopy: false }, at(30)).above[0]?.tiles.every((t) => t === 5), true);
  for (const flag of [false, undefined]) assert.equal(createSceneLink().scene(world({ layers, ...(flag === undefined ? {} : { seeThroughCanopy: flag }) })).above[0]?.tiles.every((t) => t === 5), true);
});

test("loader: stored clip events and points warn once per asset per code, named by the sheet id; absent ones never warn; a rebuilt world does not repeat them (step 33h)", () => {
  const bad: SceneAsset = { sheet: { ...unitSheet, id: "bad-sheet" }, clips: [{ name: "a", frames: [0, 1], events: [{ frame: 9, name: "x" }, { frame: 0, name: "" }], points: { foot: [[1, 1]], hand: [[99, 0]] } }, { name: "b", frames: [0], events: "contact" }] };
  const link = createSceneLink(), all = { hero, bad }, w = world({ assets: all });
  link.scene(w); link.scene({ ...w, units: [] });
  assert.deepEqual(link.notices.map((n) => `${n.code}:${n.message}`), ["clipEventInvalid:bad-sheet", "clipPointsInvalid:bad-sheet"]);
  assert.deepEqual(createSceneLink().notices, []);
  const fresh = createSceneLink(); fresh.scene(world()); assert.deepEqual(fresh.notices, []); const over = createSceneLink(); over.scene(world({ assets: { hero, o: { sheet: { ...unitSheet, id: "o" }, clips: [{ name: "a", frames: [0], events: Array.from({ length: 17 }, (_, i) => ({ frame: 0, name: `e${i}` })) }] } } })); assert.deepEqual(over.notices.map((n) => `${n.code}:${n.message}`), ["clipEventsOverCap:o"]);
});

test("effects on screen: a front-unit step sits at the caster's sort key with its hand offset, the draw list draws it after the unit, a mirrored caster mirrors the point, facing north swaps it behind (step 33h)", () => {
  const sc = createSceneLink().scene(world({ effects: [fx()] }), at(1020)), mine = fxOf(sc);
  assert.deepEqual(mine, [{ kind: "fxFront", sheet: slash, c: 2, r: 2, frame: 0, ox: 4, oy: -10 }]);
  const cmds = buildDrawList(sc, fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 1020, 10).cmds.map((c) => c.sheet);
  assert.deepEqual(cmds, ["hero-sheet", "slash"]);
  assert.deepEqual(fxOf(createSceneLink().scene(world({ units: [unit("a", 2, "W")], effects: [fx()] }), at(1020))).map((s) => "ox" in s ? s.ox : null), [-5]);
  const north = createSceneLink().scene(world({ units: [unit("a", 2, "N")], effects: [fx()] }), at(1020));
  assert.deepEqual([fxOf(north).map((s) => "faceSwap" in s ? s.faceSwap : null), buildDrawList(north, fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 1020, 10).cmds.map((c) => c.sheet)], [[true], ["slash", "hero-sheet"]]);
  const own: Overlay = { band: "ui", sheet: slash, x: 0, y: 0 }, mixed = createSceneLink().scene(world({ overlays: [own], assets: { hero: { ...hero, box: { x: 2, y: 4, w: 8, h: 8 } } }, effects: [fx({ pieces: [piece(), piece({ draw_layer: "air", anchor_point: "centre" })] })] }), at(1020)); assert.deepEqual([mixed.standing.map((s) => s.kind), mixed.overlays.map((o) => o.x)], [["unit", "fxFront"], [0, 34]]);
});

test("pose grid on screen: steps pose on the 30 ms grid (60 in lite); inside one pose the scene object is kept, the next pose changes it, and an ended effect leaves nothing (step 33h)", () => {
  const link = createSceneLink(), w = world({ effects: [fx({ castMs: 1040 })] });
  assert.equal(fxOf(link.scene(w, at(1030))).length, 0);
  const a = link.scene(w, at(1050)); assert.equal(fxOf(a).length, 1); assert.equal(link.scene(w, at(1079)), a);
  assert.equal(fxOf(createSceneLink().scene(w, at(1050, true))).length, 0); assert.equal(fxOf(createSceneLink().scene(w, at(1080, true))).length, 1);
  assert.equal(fxOf(link.scene(w, at(1439))).length, 1); assert.equal(fxOf(link.scene(w, at(1440))).length, 0);
  const live = createFxLive(); assert.equal(live.frame([fx()], () => null, 0, 1050, { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 3 }).dueMs, 1080);
  assert.equal(live.frame([], () => null, 1050, 1060, { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 3 }).dueMs, Infinity);
});

test("events on screen: each event fires once across frames by the crossing rule, tagged with its effect, in timeline order; start_on and hitAt come from the caster's clip (step 33h)", () => {
  const link = createSceneLink(), w = world({ effects: [fx({ id: "e2", start_on: "release", pieces: [piece({ ms: 300 })] })] }), seen: string[] = [];
  for (const t of [1000, 1250, 1300, 1600, 1700]) { link.scene(w, at(t)); seen.push(names(link).join(" ")); }
  assert.deepEqual(seen, ["", "fx:start@1200 release@1200 fx:release@1200", "contact@1300 fx:hit@1300", "fx:end@1500", ""]);
  link.scene(w, at(1800)); assert.equal(link.fired.length, 0);
  const tagged = createSceneLink(); tagged.scene(world({ effects: [fx({ hitOffsetMs: 55, start_on: "release" })] }), at(2000));
  assert.deepEqual(tagged.fired.map((e) => `${e.fx}:${e.type}@${e.at}`), ["e1:fx:start@1200", "e1:clip:event@1200", "e1:fx:release@1200", "e1:fx:hit@1260", "e1:clip:event@1300", "e1:fx:end@1600"]);
});

test("N-2: after a resume a looping effect fires at most one fx:loop per call; the rest of the window fires once (law 13) (step 33h)", () => {
  const link = createSceneLink(), w = world({ effects: [fx({ castMs: 0, loopMs: 100 })] });
  link.scene(w, at(50)); link.scene(w, at(100000));
  assert.deepEqual([link.fired.filter((e) => e.type === "fx:loop").map((e) => e.at), link.fired.filter((e) => e.type === "fx:hit").length, link.fired.some((e) => e.type === "fx:end")], [[100000], 1, false]);
  link.scene(w, at(100150)); assert.deepEqual(link.fired.map((e) => e.type + "@" + e.at), ["fx:loop@100100"]);
  const lap = createSceneLink(), lw = world({ effects: [fx({ castMs: 0, start_on: "release", loopMs: 150, pieces: [piece({ ms: 140, draw_layer: "air" })] })] }); lap.scene(lw, at(50)); const n355 = fxOf(lap.scene(lw, at(355))).length; assert.deepEqual([lap.fired.filter((e) => e.type === "fx:loop").map((e) => e.at), n355, fxOf(lap.scene(lw, at(420))).length], [[350], 1, 1]);
});

test("N-1 and N-3: a non-finite clock draws no effect, fires nothing and keeps the last time; the view never shows a hit before the commit, even for a zero or negative length (step 33h)", () => {
  const link = createSceneLink(), w = world({ effects: [fx({ commitMs: 1000 })] });
  for (const t of [Number.NaN, Number.POSITIVE_INFINITY]) { assert.equal(fxOf(link.scene(w, at(t))).length, 0); assert.deepEqual([link.fired, link.views], [[], {}]); }
  link.scene(w, at(1210)); assert.deepEqual(names(link), ["fx:start@1000", "release@1200", "fx:release@1200"]); assert.deepEqual(link.views, { e1: 1300 });
  link.scene(w, at(Number.NaN)); link.scene(w, at(1310)); assert.deepEqual(names(link), ["contact@1300", "fx:hit@1300"]);
  const flat = createSceneLink(); flat.scene(world({ effects: [fx({ commitMs: 1000, pieces: [piece({ ms: -50 })] })] }), at(1010)); assert.deepEqual(flat.views, { e1: 1000 }); flat.scene(world({ effects: [fx({ id: "e9" })] }), at(1020)); assert.deepEqual(flat.views, {});
});

test("N-4: a caster clip with no frames gives no clip events and starts at cast; a caster with no clip plays at cast too; every fired time is finite (step 33h)", () => {
  const ghost: SceneAsset = { sheet: unitSheet, clips: [{ name: "atk-right", frames: [] }] };
  for (const a of [ghost, { sheet: unitSheet }]) {
    const link = createSceneLink(); link.scene(world({ assets: { hero: a }, effects: [fx({ castMs: 500, start_on: "contact" })] }), at(2000));
    assert.deepEqual(names(link), ["fx:start@500", "fx:hit@500", "fx:end@900"]);
  }
});

test("attach on screen: spawn keeps the caster's place at step start, follow moves with it, follow + detach hit freezes at the hit place; the live store drops ended effects (law 13) (step 33h)", () => {
  const air = (attach: string, detach?: string): FxPiece => piece({ ms: 1000, anchor_point: "centre", draw_layer: "air", attach, ...(detach === undefined ? {} : { detach }) });
  const xs = (p: FxPiece): (number | undefined)[] => { const link = createSceneLink(), e = [fx({ pieces: [p] })]; return [[1020, 2], [1320, 2], [1350, 5]].map(([t, c]) => xOf(link.scene(world({ units: [unit("a", c ?? 0)], effects: e }), at(t ?? 0)))); };
  assert.deepEqual([xs(air("spawn")), xs(air("follow")), xs(air("follow", "hit"))], [[36, 36, 36], [36, 36, 84], [36, 36, 36]]);
  const walk = (e: LiveFx, f: number[][]): (number | undefined)[] => { const link = createSceneLink(); return f.map(([t, c]) => xOf(link.scene(world({ units: [unit("a", c ?? 0)], effects: [e] }), at(t ?? 0)))); }; assert.deepEqual([walk(fx({ pieces: [{ ...air("spawn"), at: 100 }] }), [[1020, 2], [1110, 5], [1200, 7]]), walk(fx({ loopMs: 500, pieces: [{ ...air("spawn"), ms: 400 }] }), [[1020, 2], [1520, 5], [1600, 7]]), walk(fx({ hitOffsetMs: 200, pieces: [air("follow", "hit")] }), [[1020, 2], [1200, 2], [1230, 5]])], [[undefined, 84, 84], [36, 84, 84], [36, 36, 36]]);
  const live = createFxLive(), g = { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 3 }, many = Array.from({ length: 5 }, (_, i) => fx({ id: `e${i}`, at: { c: 1, r: 1 } }));
  for (let t = 1000; t < 1600; t += 10) live.frame(many, () => null, t - 10, t, g);
  assert.equal(live.held(), 5); live.frame(many.slice(0, 2), () => null, 1600, 1610, g); assert.equal(live.held(), 2); live.frame([], () => null, 1610, 1620, g); assert.equal(live.held(), 0);
});

test("anchors on screen: anchor target uses the target unit, else its cell; the caster is the default; tile points are the cell's foot point (step 33h)", () => {
  const tile = (p: Partial<FxPiece>, e: Partial<LiveFx> = {}): number[] => { const o = createSceneLink().scene(world({ units: [unit("a", 2), unit("b", 4)], effects: [fx({ pieces: [piece({ draw_layer: "air", ...p })], ...e })] }), at(1020)).overlays[0]; return o === undefined ? [] : [o.x, o.y]; };
  assert.deepEqual([tile({ anchor_point: "tile" }), tile({ anchor: "target", anchor_point: "tile" }, { target: "b" }), tile({ anchor: "target", anchor_point: "tile" }, { target: "zz", at: { c: 7, r: 1 } })], [[36, 40], [68, 40], [116, 24]]);
  assert.deepEqual([tile({ anchor: "target", anchor_point: "centre" }, { target: "b" }), tile({ anchor: "target" }, { at: { c: 7, r: 1 } })], [[68, 32], [116, 24]]);
  assert.deepEqual([tile({ anchor: "screen", anchor_point: "tile" }, { target: "b" }), tile({ anchor: "target", anchor_point: "tile" }, { target: "b", at: { c: 7, r: 1 } }), createSceneLink().scene(world({ tileW: 15, effects: [fx({ pieces: [piece({ draw_layer: "air", anchor_point: "tile" })] })] }), at(1020)).overlays[0]?.x], [[36, 40], [68, 40], 34]);
});

test("units for effects: the frame index matches the drawn pose (the draw list's unit offset), a 1-frame or non-finite clock shows frame 0, the box defaults to the frame, facing north faces away (step 33h)", () => {
  const live = createFxLive(), g = { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 3 }, st: Standing = { kind: "unit", sheet: unitSheet, c: 2, r: 2, key: "a", clip: atk };
  const u = live.unit(st, "N", undefined, 1300, g), off = instanceOffset(atk, 10, 3, "hero-sheet#a", 0, 0);
  assert.deepEqual([off, clipIndex(atk, 1300, 10, off), clipIndex(atk, 1300, 10, 0)], [382, 0, 1]);
  assert.deepEqual([u.actor.frame, u.actor.facesAway, u.actor.box, u.actor.points.hand[0], u.clip], [0, true, { x: 0, y: 0, w: 16, h: 16 }, { x: 12, y: 6 }, atk]);
  assert.deepEqual([clipIndex(atk, 250, 10, 0), clipIndex(atk, 250, 10, 60), clipIndex({ ...atk, loop: false }, 5000, 10, 0), clipIndex(atk, 650, 10, 0), clipIndex(atk, Number.NaN, 10, 0), clipIndex({ name: "one", frames: [7] }, 250, 10, 0)], [2, 3, 3, 2, 0, 0]);
  assert.deepEqual([live.unit(st, "E", { x: 1, y: 2, w: 3, h: 4 }, 0, g).actor.box, live.unit(st, "E", undefined, 0, g).actor.facesAway, live.unit({ ...st, dx: 3 }, "E", undefined, 0, g).actor.dx], [{ x: 1, y: 2, w: 3, h: 4 }, false, 3]);
});

test("strips on screen: a step strip over 64 frames draws nothing and warns fxTooManyFrames once per clip (step 33h)", () => {
  const big: Clip = { name: "big", frames: Array.from({ length: 65 }, (_, i) => i % 4) }, link = createSceneLink(), w = world({ effects: [fx({ pieces: [piece({ clip: big, draw_layer: "air" })] })] });
  assert.equal(fxOf(link.scene(w, at(1020))).length, 0); link.scene(w, at(1050));
  assert.deepEqual(link.notices.map((n) => n.code + (n.message.includes("subject: strip, count: 65") ? ":strip" : "")), ["fxTooManyFrames:strip"]); const two = createSceneLink(); two.scene(world({ effects: [fx({ pieces: [piece({ clip: big, draw_layer: "air" }), piece({ clip: { ...big }, draw_layer: "air" })] })] }), at(1020)); assert.equal(two.notices.length, 2);
});

test("F-2, N-5 and N-6: the one lap is computed directly (no hang on huge times), a loop ties after timeline events, a non-finite cast, step at or step ms draws and fires nothing, and a view is never NaN (step 33h r2)", () => {
  for (const [castMs, tMs, loopMs, loops] of [[0, 1e17, 1, 1], [-1e17, 0, 1, 1], [0, 1e7, 1e-300, 1], [0, Number.MAX_VALUE, 1, 1]] as const) {
    const link = createSceneLink(), w = world({ effects: [fx({ castMs, loopMs, at: { c: 1, r: 1 } })] }), t0 = Date.now(); link.scene(w, at(castMs + 50)); link.scene(w, at(tMs));
    assert.equal(link.fired.filter((e) => e.type === "fx:loop").length === loops && link.fired.every((e) => Number.isFinite(e.at)) && Date.now() - t0 < 1000, true);
  }
  const tie = createSceneLink(), tw = world({ effects: [fx({ castMs: 0, loopMs: 100, hitOffsetMs: 100, pieces: [piece({ ms: 50 })] })] }); tie.scene(tw, at(50)); assert.deepEqual(names(tie), ["fx:start@0"]); tie.scene(tw, at(100));
  assert.deepEqual(tie.fired.map((e) => e.type + "@" + e.at), ["fx:hit@100", "fx:loop@100"]);
  const bad = [fx({ castMs: Number.NaN }), fx({ pieces: [piece({ at: Number.NaN, draw_layer: "air" })] }), fx({ pieces: [piece({ ms: Number.NaN, draw_layer: "air" })] })];
  for (const e of bad) { const link = createSceneLink(), w = world({ effects: [e] }); const seen = [100, 1020, 5000, 1e6].map((t) => fxOf(link.scene(w, at(t))).length); assert.deepEqual(seen, [0, 0, 0, 0]); }
  assert.equal(names((() => { const l = createSceneLink(); l.scene(world({ effects: [bad[0] as LiveFx] }), at(1e6)); return l; })()).length, 0);
  for (const e of [fx({ commitMs: Number.NaN }), fx({ commitMs: 1000, hitOffsetMs: Number.NaN }), fx({ commitMs: 1000, castMs: Number.NaN }), fx({ commitMs: 1000, pieces: [piece({ ms: Number.NaN })] })]) { const l = createSceneLink(); l.scene(world({ effects: [e] }), at(1300)); assert.equal(Object.values(l.views).every((v) => Number.isFinite(v)), true); }
  const ok = createSceneLink(); ok.scene(world({ effects: [fx({ commitMs: 1000, pieces: [piece(), piece({ ms: Number.NaN })] })] }), at(1300)); assert.deepEqual(ok.views, { e1: 1300 });
  const inf = createSceneLink(), iw = world({ effects: [fx({ loopMs: Number.POSITIVE_INFINITY, at: { c: 1, r: 1 }, pieces: [piece({ draw_layer: "air" })] })] }); const shown = [1020, 1250].map((t) => fxOf(inf.scene(iw, at(t))).length); inf.scene(iw, at(2000)); assert.deepEqual([shown, names(inf).includes("fx:end@1400"), inf.fired.some((e) => e.type === "fx:loop")], [[1, 1], true, false]); // a non-finite loopMs never loops: it plays once and ends
});
