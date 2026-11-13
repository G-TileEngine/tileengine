import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_FX_READ_LIMITS } from "../../../src/btf-adapters/src/index.ts";
import { readFxOrder } from "../../../src/fx/order/index.ts";
import { BANDS, buildDrawList, clipEvents, clipPoints, crossed, fitView, hitAt, nextChangeMs, ownLight, placeStep, pointAt, poseMs, snapCamera, startMs, stripNote, viewHitMs, type FxActor, type FxEvent, type FxPiece, type Overlay, type RenderScene, type Standing } from "../../../src/runtime/render/index.ts";

const unitSheet = { id: "unit", columns: 1, fw: 16, fh: 16 }, fxSheet = { id: "fx", columns: 1, fw: 8, fh: 8 }, box = { x: 4, y: 2, w: 8, h: 12 };
const hand = clipPoints({ hand: [[12, 6]] }, 1, 16, 16).points;
const actor = (over: Partial<FxActor> = {}): FxActor => ({ c: 2, r: 2, sheet: unitSheet, frame: 0, points: hand, box, ...over });
const piece = (over: Partial<FxPiece> = {}): FxPiece => ({ at: 0, ms: 500, sheet: fxSheet, anchor_point: "hand", ...over });
const walker = (t: number): FxActor => actor({ c: Math.floor(t / 100) });
const place = (p: FxPiece, t: number, unitAt: (t: number) => FxActor | null = walker, hitMs = 1100): Standing | Overlay | null => placeStep(p, 1000, t, hitMs, unitAt, { x: 40, y: 40 }, 16, 16, 10);
const fxText = (n: number): string => `SKILLRIG v1\n${JSON.stringify({ frames: Array.from({ length: n }, () => ({ kind: "straight", seconds: 0.3 })), connect: 0.5 })}\n`;

test("clip events: valid entries kept in stored order, bad entries skipped with clipEventInvalid, a non-list reads as absent, over 16 the first 16 fire (step 33a, CN-014)", () => {
  const got = clipEvents([{ frame: 3, name: "contact" }, { frame: 4, name: "x" }, { frame: 1, name: "" }, { frame: 0, name: "a".repeat(17) }, { frame: 1.5, name: "step" }, null, { frame: 0, name: "release" }], 4);
  assert.deepEqual(got.events, [{ frame: 3, name: "contact" }, { frame: 0, name: "release" }]); assert.deepEqual(clipEvents([{ frame: -1, name: "a" }, { frame: 1, name: "b".repeat(16) }], 2).events, [{ frame: 1, name: "b".repeat(16) }]);
  assert.deepEqual(got.notes.map((n) => n.code), Array(5).fill("clipEventInvalid"));
  const many = clipEvents(Array.from({ length: 18 }, (_, i) => ({ frame: i % 4, name: `e${i}` })), 4);
  assert.deepEqual(many.events.map((e) => e.name), Array.from({ length: 16 }, (_, i) => `e${i}`));
  assert.deepEqual(many.notes.map((n) => n.code), ["clipEventsOverCap"]);
  const odd = clipEvents("contact", 6);
  assert.deepEqual([odd.notes.map((n) => n.code), odd.events], [["clipEventInvalid"], [{ frame: 3, name: "release" }, { frame: 3, name: "contact" }]]);
});

test("derived events: null, [] and all-bad are absent; contact = the biggest pose change (first on ties), else floor(n/2); release on the same frame (step 33a)", () => {
  for (const stored of [null, undefined, [], [{ frame: 9, name: "late" }]]) assert.deepEqual(clipEvents(stored, 5).events, [{ frame: 2, name: "release" }, { frame: 2, name: "contact" }]);
  assert.deepEqual(clipEvents(null, 6, [0, 3, 9, 9, 1, 0]).events, [{ frame: 2, name: "release" }, { frame: 2, name: "contact" }]);
  assert.deepEqual(clipEvents([], 7, [0, 0, 0, 0, 0, 0, 0]).events[1], { frame: 3, name: "contact" });
  assert.equal(clipEvents([], 4, [0, 0, 0, 0, 0, 0, 50]).events[1]?.frame, 2);
});

test("clip points: 1 entry = every frame, other lengths pad with the last / cut with clipPointsInvalid, a bad entry is null, a stored foot is ignored (step 33a)", () => {
  assert.deepEqual(clipPoints({ tip: [[1, 2]] }, 3, 16, 16), { points: { hand: [], tip: [{ x: 1, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 2 }], head: [], centre: [] }, notes: [] });
  const padded = clipPoints({ hand: [[1, 1], [2, 2]] }, 4, 16, 16), cut = clipPoints({ hand: [[1, 1], [2, 2], [3, 3]] }, 2, 16, 16);
  assert.deepEqual([padded.points.hand, padded.notes.map((n) => n.code)], [[{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 2 }], ["clipPointsInvalid"]]);
  assert.deepEqual([cut.points.hand, cut.notes.length], [[{ x: 1, y: 1 }, { x: 2, y: 2 }], 1]);
  const bad = clipPoints({ head: [[16, 0], null, [1.5, 2], [3, 4]], foot: [[8, 16]] }, 4, 16, 16);
  assert.deepEqual(bad.points.head, [null, null, null, { x: 3, y: 4 }]);
  assert.deepEqual(bad.notes.map((n) => n.code), ["clipPointsInvalid", "clipPointsInvalid", "clipPointsInvalid"]);
  assert.equal("foot" in bad.points, false); assert.deepEqual(clipPoints({ tip: [[0, 16], [-1, 0], [2, 1.5], [15, 15]] }, 4, 16, 16).points.tip, [null, null, null, { x: 15, y: 15 }]);
});

test("anchor points: stored first, centre / head derived from the opaque box, hand / tip fall back to centre, mirrored x' = fw - 1 - x (step 33a)", () => {
  assert.deepEqual([pointAt(hand, "hand", 0, box, 16, false), pointAt(hand, "hand", 0, box, 16, true)], [{ x: 12, y: 6 }, { x: 3, y: 6 }]);
  assert.deepEqual([pointAt(hand, "centre", 0, box, 16, false), pointAt(hand, "head", 0, box, 16, false), pointAt(hand, "tip", 0, box, 16, false)], [{ x: 8, y: 8 }, { x: 8, y: 2 }, { x: 8, y: 8 }]);
  const centred = clipPoints({ centre: [[3, 5]] }, 1, 16, 16).points;
  assert.deepEqual([pointAt(centred, "tip", 0, box, 16, false), pointAt(centred, "head", 0, box, 16, true)], [{ x: 3, y: 5 }, { x: 7, y: 2 }]); assert.deepEqual(pointAt(hand, "centre", 0, { x: 1, y: 1, w: 5, h: 7 }, 16, false), { x: 3, y: 4 });
});

test("start_on and hitAt: release / contact start at that clip event, no clip or an unknown option starts at cast; hitAt = effect hit, else contact, else lunge peak, else cast; ticks once (step 33a)", () => {
  const clip = { name: "atk", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100] }, ev = [{ frame: 2, name: "release" }, { frame: 3, name: "contact" }];
  assert.deepEqual([startMs("release", 1000, clip, ev, 10), startMs("contact", 1000, clip, ev, 10), startMs("cast", 1000, clip, ev, 10), startMs("zap", 1000, clip, ev, 10), startMs(undefined, 1000, clip, ev, 10), startMs("contact", 1000, undefined, ev, 10)], [1200, 1300, 1000, 1000, 1000, 1000]);
  assert.equal(startMs("release", 1003, clip, ev, 10), 1210);
  assert.deepEqual([hitAt(1000, 10, { effectHitMs: 1234, contactMs: 1300, lungePeakMs: 1150 }), hitAt(1000, 10, { contactMs: 1300, lungePeakMs: 1150 }), hitAt(1000, 10, { lungePeakMs: 1151 }), hitAt(1001, 10, {})], [1240, 1300, 1160, 1010]);
});

test("crossing rule: every event in (t1, t2] fires once, in time then list order; split windows fire the same set; a loop adds fx:loop per lap (step 33a)", () => {
  const list: FxEvent[] = [{ type: "fx:end", at: 400 }, { type: "fx:start", at: 100 }, { type: "clip:event", at: 200, name: "contact" }, { type: "fx:hit", at: 200 }];
  assert.deepEqual(crossed(list, 100, 200).map((e) => e.name ?? e.type), ["contact", "fx:hit"]);
  assert.deepEqual(crossed(list, 0, 1000).map((e) => e.name ?? e.type), ["fx:start", "contact", "fx:hit", "fx:end"]);
  assert.deepEqual([...crossed(list, 0, 150), ...crossed(list, 150, 399), ...crossed(list, 399, 400)], crossed(list, 0, 400));
  assert.deepEqual(crossed(list, 400, 900), []);
  assert.deepEqual([crossed([], 0, 250, { from: 0, lapMs: 100 }).map((e) => e.at), crossed([], 0, 260, { from: 50, lapMs: 100 }).map((e) => e.at)], [[100, 200], [150, 250]]);
  assert.deepEqual(crossed([{ type: "fx:hit", at: 200 }], 100, 300, { from: 0, lapMs: 100 }).map((e) => e.type + e.at), ["fx:hit200", "fx:loop200", "fx:loop300"]);
});

test("view lag: the view shows the hit at hitAt, never past commit + min(effect length, 500 ms); the rules' commit never moves (step 33a)", () => {
  assert.deepEqual([viewHitMs(1000, 1200, 800), viewHitMs(1000, 1800, 800), viewHitMs(1000, 1800, 300), viewHitMs(1000, 900, 800), viewHitMs(1000, 1500, 2000), viewHitMs(1000, 1501, 2000)], [1200, 1500, 1300, 1000, 1500, 1500]);
});

test("pose grid: effects pose on a 30 ms grid (60 in lite); the frame is due at the smallest nextChangeMs; 120 Hz frames add no poses (step 33a)", () => {
  assert.deepEqual([poseMs(29, false), poseMs(30, false), poseMs(59, true), poseMs(60, true)], [0, 30, 0, 60]);
  assert.deepEqual([nextChangeMs(31, false), nextChangeMs(31, false, 45, 90), nextChangeMs(31, true), nextChangeMs(61, true, Infinity)], [60, 45, 60, 120]);
  const at = Array.from({ length: 120 }, (_, i) => Math.floor((i * 1000) / 120));
  assert.deepEqual([new Set(at.map((t) => poseMs(t, false))).size, new Set(at.map((t) => poseMs(t, true))).size], [34, 17]);
});

test("placement: spawn stays where the unit was, follow moves, detach hit freezes at hitAt; tile, screen, unknown or no unit play as today; lit absent = own light (step 33a)", () => {
  assert.deepEqual(place(piece(), 1250), { band: "fxAir", sheet: fxSheet, x: 168, y: 30, frame: 0 });
  assert.deepEqual([place(piece({ attach: "follow" }), 1250), place(piece({ attach: "follow", detach: "hit" }), 1250), place(piece({ detach: "hit" }), 1250)].map((o) => o !== null && "x" in o ? o.x : null), [200, 184, 168]);
  assert.deepEqual([place(piece(), 999), place(piece(), 1500), place(piece({ at: 100 }), 1050)], [null, null, null]); assert.deepEqual([place(piece(), 1000), place(piece(), 1499)].map((o) => o !== null && "x" in o ? o.x : null), [168, 168]);
  assert.deepEqual([place(piece({ attach: "follow" }), 1250, (t) => (t === 1000 ? actor() : null)), place(piece({ draw_layer: "front-unit", anchor_point: "tile" }), 1250)], [{ band: "fxAir", sheet: fxSheet, x: 40, y: 30, frame: 0 }, { band: "fxAir", sheet: fxSheet, x: 36, y: 32, frame: 0 }]);
  for (const p of [piece({ anchor_point: "tile" }), { at: 0, ms: 500, sheet: fxSheet }, piece({ anchor_point: "elbow" }), piece({ anchor: "screen" })]) assert.deepEqual(place(p, 1250), { band: "fxAir", sheet: fxSheet, x: 36, y: 32, frame: 0 });
  assert.deepEqual([place(piece({ draw_layer: "ground" }), 1250, () => null), place(piece({ draw_layer: "overlay", anchor_point: "tile" }), 1250), place(piece({ draw_layer: "behind-unit", anchor_point: "tile" }), 1250)].map((o) => o !== null && "band" in o ? o.band : null), ["fxGround", "flash", "fxAir"]);
  assert.deepEqual([place(piece({ anchor_point: "foot" }), 1250), place(piece(), 1250, (t) => actor({ c: Math.floor(t / 100), flipX: true }))].map((o) => o !== null && "x" in o ? o.x : null), [164, 159]);
  const clip = { name: "puff", frames: Array.from({ length: 65 }, (_, i) => i % 4) };
  assert.equal(place(piece({ clip }), 1250), null);
  assert.deepEqual([stripNote(clip, "puff")?.code, stripNote(clip, "puff")?.message === "{subject: strip, count: 65, limit: 64, assetId: puff}", stripNote({ ...clip, frames: clip.frames.slice(1) }, "puff")], ["fxTooManyFrames", true, null]);
  assert.deepEqual([ownLight(piece()), ownLight(piece({ lit: "self" })), ownLight(piece({ lit: "scene" })), ownLight(piece({ lit: "none" }))], [true, true, false, true]);
});

test("draw list: fx-behind < anchor unit < fx-front at the anchor's sort key only, facing away swaps front behind unless depth_by_facing is off; fxGround draws after the ground, before standing (step 33a)", () => {
  const scene = (standing: Standing[], overlays: Overlay[] = []): RenderScene => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 1, ground: [{ sheet: { id: "g", columns: 1, fw: 16, fh: 16 }, tiles: [0] }], above: [], standing, overlays });
  const ids = (sc: RenderScene): string[] => buildDrawList(sc, fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 1250, 10).cmds.map((c) => c.sheet + ":" + c.band);
  const at = (p: FxPiece, a: FxActor = actor()): Standing => { const s = place(p, 1250, () => a); assert.ok(s !== null && "kind" in s); return { ...s, sheet: { ...fxSheet, id: p.draw_layer ?? "air" } }; };
  const unit: Standing = { kind: "unit", sheet: unitSheet, c: 2, r: 2, key: "u" }, below: Standing = { kind: "unit", sheet: { ...unitSheet, id: "below" }, c: 2, r: 3 };
  const front = at(piece({ draw_layer: "front-unit" })), behind = at(piece({ draw_layer: "behind-unit" }));
  assert.deepEqual(ids(scene([below, front, unit, behind])), ["g:base", "behind-unit:base", "unit:base", "front-unit:base", "below:base"]);
  const away = at(piece({ draw_layer: "front-unit" }), actor({ facesAway: true })), kept = at(piece({ draw_layer: "front-unit", depth_by_facing: false }), actor({ facesAway: true }));
  assert.deepEqual([ids(scene([unit, away])), ids(scene([unit, kept]))], [["g:base", "front-unit:base", "unit:base"], ["g:base", "unit:base", "front-unit:base"]]); assert.deepEqual(ids(scene([unit, away, { kind: "object", sheet: { ...unitSheet, id: "prop" }, c: 2, r: 2 }])), ["g:base", "prop:base", "front-unit:base", "unit:base"]);
  assert.deepEqual(BANDS, ["base", "fxGround", "wash", "fxAir", "glow", "flash", "ui"]);
  const cmds = buildDrawList(scene([unit, front]), fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 1250, 10).cmds;
  assert.deepEqual([(cmds[2]?.dx ?? 0) - (cmds[1]?.dx ?? 0), (cmds[2]?.dy ?? 0) - (cmds[1]?.dy ?? 0)], [8, -2]);
  const air: Overlay = { band: "fxAir", sheet: { ...fxSheet, id: "air" }, x: 0, y: 0 }, mark: Overlay = { band: "fxGround", sheet: { ...fxSheet, id: "mark" }, x: 0, y: 0 };
  assert.deepEqual(ids(scene([unit], [air, mark])), ["g:base", "mark:fxGround", "unit:base", "air:fxAir"]);
});

test("64 ceiling: an effect over 64 steps is refused, never cut, and the refusal names subject steps (step 33a, CN-014)", () => {
  const over = readFxOrder(fxText(65), BTF_FX_READ_LIMITS);
  assert.deepEqual([over.order, over.notices[0]?.code, over.notices[0]?.message], [null, "fxTooManyFrames", "{subject: steps, count: 65, limit: 64}"]);
  assert.equal(readFxOrder(fxText(64), BTF_FX_READ_LIMITS).order?.steps.length, 6);
});
