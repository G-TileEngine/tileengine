import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { Action } from "../../src/core/log/types.ts";
import { buildDrawList } from "../../src/runtime/render/draw-list.ts";
import { snapCamera } from "../../src/runtime/render/camera.ts";
import { fitView } from "../../src/runtime/render/fit.ts";
import { docToLiveFx, stepTimes } from "../../src/runtime/render/fx-doc.ts";
import { CAST, createCastFx, cueFromEntry, type CastCue, type EffectValues } from "../../src/runtime/scene/cast-fx.ts";
import { sceneFromMatch, type MatchArt } from "../../src/runtime/scene/match-link.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";

const sheet = { id: "fx", columns: 4, fw: 16, fh: 16 };
const doc = (n = 0.3, extra: Record<string, unknown> = {}): Record<string, unknown> => ({ steps: [{ kind: "stamp", seconds: n }], ...extra });
const endOf = (values: Record<string, unknown>): number => stepTimes(values).endMs;
const table = (rows: Record<string, EffectValues>): ((ref: string) => EffectValues | null) => ((ref) => (Object.hasOwn(rows, ref) ? rows[ref] ?? null : null));
const fxOf = (rows: Record<string, EffectValues>, sheetOf: () => typeof sheet = () => sheet) => createCastFx({ sheetOf, values: table(rows) });
const cue = (o: Partial<CastCue> & { id: string; ref: string }): CastCue => ({ atMs: 0, caster: "k1", target: "w1", ...o });
const act = (effects: readonly string[], target: Action["target"]): Action => ({ id: "a", kind: "ability", actor: "k1", target, durationMs: null, turns: null, effects });
const refOf = (a: Action): string | undefined => (a.effects.length === 1 ? a.effects[0] : undefined);
const art: MatchArt = { cols: 8, rows: 6, tileW: 16, tileH: 16, mapSeed: 1, assets: { knight: { sheet: { id: "knight", columns: 4, fw: 16, fh: 16 } }, wolf: { sheet: { id: "wolf", columns: 4, fw: 16, fh: 16 } }, fx: { sheet } }, layers: [{ tileset: null, aboveUnits: false, visible: true, tiles: Array.from({ length: 48 }, () => 0) }], sprites: { knight: "knight", wolf: "wolf" } };
const snap = { units: [{ id: "k1", unitId: "knight", at: { c: 2, r: 2 }, offset: null, facing: "E", alive: true }, { id: "w1", unitId: "wolf", at: { c: 5, r: 1 }, offset: null, facing: "W", alive: true }] };
const hash = (list: readonly unknown[]): string => { const world = { ...sceneFromMatch(snap, art).world, effects: list as never }, scene = createSceneLink().scene(world, { tMs: 50, stepMs: 10 }), fit = fitView(128, 96, 1, 16, 16); return JSON.stringify(buildDrawList(scene, fit, snapCamera(0, 0, 1), 50, 10)); };

test("E7p compile cache: five casts of one ref@rev compile once; a rev bump compiles again; a new sheetOf does not reuse the cache", () => {
  const rows: Record<string, EffectValues> = { stock: { rev: 1, values: doc() } }, a = fxOf(rows);
  for (let i = 0; i < 5; i += 1) a.cast(cue({ id: `cast:${i + 1}`, ref: "stock" }));
  assert.equal(a.compiles, 1); rows["stock"] = { rev: 2, values: doc(0.4) }; a.cast(cue({ id: "cast:9", ref: "stock" })); assert.equal(a.compiles, 2);
  const b = fxOf(rows, () => ({ ...sheet, id: "fx-b" })); b.cast(cue({ id: "cast:1", ref: "stock" })); assert.equal(b.compiles, 1);
});

test("E7p cueFromEntry: a unit aim sets target and fallbackAt; a tile aim sets at; missing, none and prototype refs do not throw", () => {
  const unit = cueFromEntry({ seq: 3, tick: 7, action: act(["stock"], { pipe: "unit", unitId: "w1", fallbackAt: { c: 5, r: 1 } }) }, 10, refOf);
  assert.deepEqual(unit, { id: "cast:3", atMs: 70, caster: "k1", ref: "stock", target: "w1", at: { c: 5, r: 1 } });
  const tile = cueFromEntry({ seq: 4, tick: 2, action: act(["stock"], { pipe: "tile", at: { c: 4, r: 2 } }) }, 10, refOf);
  assert.deepEqual(tile, { id: "cast:4", atMs: 20, caster: "k1", ref: "stock", at: { c: 4, r: 2 } });
  assert.equal(cueFromEntry({ seq: 5, tick: 0, action: act([], { pipe: "unit", unitId: "w1" }) }, 10, refOf), null);
  assert.equal(cueFromEntry({ seq: 6, tick: 1, action: { ...act(["stock"], { pipe: "tile", at: { c: 1, r: 1 } }), via: { presentation: "card", ref: "wrong" } } }, 10, refOf)?.ref, "stock");
  const rows = { stock: { rev: 1, values: doc() } }, fx = fxOf(rows), naive = createCastFx({ sheetOf: () => sheet, values: (ref) => (rows as Record<string, EffectValues | undefined>)[ref] ?? null });
  for (const ref of ["__proto__", "constructor", "toString", "valueOf", "missing"]) { fx.cast(cue({ id: `x-${ref}`, ref })); naive.cast(cue({ id: `n-${ref}`, ref })); assert.ok(fx.notes.some((n) => n.code === "unknownRef" && n.message === ref), ref); assert.ok(naive.notes.some((n) => n.code === "unknownRef" && n.message === ref), "naive " + ref); }
  fx.cast(cue({ id: "n1", ref: "none" })); assert.equal(fx.effects(0).length, 0); assert.equal(fx.notes.some((n) => n.message === "none"), false);
  fx.cast({ id: "bad", atMs: Number.NaN, caster: "k1", ref: "stock" }); fx.cast({ id: "bad2", atMs: 0, caster: "", ref: "stock" });
  assert.ok(fx.notes.filter((n) => n.code === "invalidValue" && n.message === "cue").length >= 2);
  assert.doesNotThrow(() => fx.cast(new Proxy({ id: "p", atMs: 0, caster: "k1", ref: "stock" }, { get() { throw new Error("get"); } })));
});

test("E7p retire, reset, caps, loop, determinism and no sim import", () => {
  const values = doc(), endMs = endOf(values), fx = fxOf({ stock: { rev: 1, values }, looped: { rev: 1, values: doc(0.3, { loopMs: 1200 }) }, bad: { rev: 1, values: 7 as unknown as Record<string, unknown> } });
  fx.cast(cue({ id: "cast:1", ref: "stock", atMs: 100 })); assert.equal(fx.effects(100).length, 1); assert.equal(fx.effects(100 + endMs).length, 1); assert.equal(fx.effects(100 + endMs + 1).length, 0);
  const mid = fxOf({ stock: { rev: 1, values } });
  mid.cast(cue({ id: "cast:2", ref: "stock", atMs: 0 })); mid.cast(cue({ id: "cast:8", ref: "stock", atMs: 80 })); mid.cast(cue({ id: "cast:8", ref: "stock", atMs: 80 }));
  assert.equal(mid.effects(80).filter((e) => e.id === "cast:8").length, 1);
  mid.reset(50, 5); assert.deepEqual(mid.effects(0).map((e) => e.id), ["cast:2"]); mid.cast(cue({ id: "cast:4", ref: "stock", atMs: 0 })); mid.cast(cue({ id: "cast:8", ref: "stock", atMs: 80 }));
  assert.deepEqual(mid.effects(80).map((e) => e.id), ["cast:2", "cast:8"]);
  const cap = fxOf({ stock: { rev: 1, values } });
  for (let i = 1; i <= 1000; i += 1) cap.cast(cue({ id: `cast:${i}`, ref: "stock", atMs: 0 }));
  assert.equal(cap.effects(0).length, CAST.live); assert.equal(cap.effects(0)[0]?.id, "cast:993"); assert.equal(cap.compiles, 1);
  assert.equal(cap.notes.filter((n) => n.code === "overCap").length, 1);
  const many = Object.fromEntries(Array.from({ length: 70 }, (_, i) => [`r${i}`, { rev: 1, values }])) as Record<string, EffectValues>;
  const cache = fxOf(many); cache.prewarm(Object.keys(many)); assert.equal(cache.compiles, 70); cache.prewarm(["r0"]); assert.equal(cache.compiles, 71); cache.prewarm(["r69"]); assert.equal(cache.compiles, 71);
  const loop = fxOf({ looped: { rev: 1, values: doc(0.3) } }); loop.cast(cue({ id: "cast:1", ref: "looped" }));
  assert.equal(loop.effects(0)[0]?.loopMs, undefined); assert.equal(loop.effects(endMs).length, 1); assert.equal(loop.effects(endMs + 1).length, 0);
  fx.cast({ id: "cast:v", atMs: 0, caster: "k1", ref: "bad" }); assert.ok(fx.notes.some((n) => n.code === "invalidValue" && n.message === "bad"));
  const a = fxOf({ stock: { rev: 1, values } }), b = fxOf({ stock: { rev: 1, values } });
  for (const e of [1, 2, 3]) { const c = cueFromEntry({ seq: e, tick: 0, action: act(["stock"], { pipe: "unit", unitId: "w1" }) }, 10, refOf); assert.ok(c); a.cast(c); b.cast(c); }
  const left = a.effects(0), right = b.effects(0);
  assert.deepEqual(JSON.parse(JSON.stringify(left)), JSON.parse(JSON.stringify(right))); assert.equal(hash(left), hash(right));
  assert.doesNotMatch(readFileSync(new URL("../../src/runtime/scene/cast-fx.ts", import.meta.url), "utf8"), /from\s+["'][^"']*\/sim/);
  const gone = fxOf({ stock: { rev: 1, values } }); gone.cast(cue({ id: "cast:1", ref: "stock", target: "no-such", at: { c: -1, r: 0 } }));
  assert.equal(gone.effects(0)[0]?.target, "no-such"); assert.deepEqual(gone.effects(0)[0]?.at, { c: -1, r: 0 });
  assert.equal(docToLiveFx(values, { id: "t", castMs: 0, caster: "k1", sheetOf: () => sheet }).fx.hitOffsetMs, gone.effects(0)[0]?.hitOffsetMs);
});
