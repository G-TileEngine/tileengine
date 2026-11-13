// QA pins for step 33h (A/B must-fixes): attach memory per step, default attach, lap replay on the pose grid.
import { test } from "node:test";
import assert from "node:assert/strict";
import type { FxPiece, LiveFx, Sheet } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
const slash: Sheet = { id: "slash", columns: 1, fw: 8, fh: 8 }, hero: SceneAsset = { sheet: { id: "h", columns: 4, fw: 16, fh: 16 }, clips: [{ name: "idle-down", frames: [0] }] };
const piece = (o: Partial<FxPiece> = {}): FxPiece => ({ at: 0, ms: 400, sheet: slash, draw_layer: "air", anchor_point: "centre", ...o });
const unit = (id: string, c: number) => ({ id, sprite: "hero", at: { c, r: 2 }, offset: null, facing: "S" as const, alive: true, action: "idle" });
const world = (fx: LiveFx, a = 2, b = 6): SceneWorld => ({ cols: 12, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero }, layers: [], units: [unit("a", a), unit("b", b)], objects: [], overlays: [], effects: [fx] });
const xs = (link: ReturnType<typeof createSceneLink>, w: SceneWorld, tMs: number): number[] => link.scene(w, { tMs, stepMs: 10 }).overlays.map((o) => o.x);
test("attach memory is kept per step: a caster step and a target step with the same start keep their own unit; default attach keeps the spawn place (QA 33h A/B)", () => {
  for (const o of [{ attach: "spawn" }, { attach: "follow", detach: "hit" }]) {
    const fx: LiveFx = { id: "e", castMs: 0, caster: "a", target: "b", hitOffsetMs: 50, pieces: [piece(o), piece({ ...o, anchor: "target" })] }, link = createSceneLink();
    xs(link, world(fx), 60); assert.deepEqual(xs(link, world(fx, 3, 8), 200), [36, 100]);
  }
  const fx: LiveFx = { id: "e", castMs: 0, caster: "a", pieces: [piece()] }, link = createSceneLink();
  assert.deepEqual([xs(link, world(fx), 60), xs(link, world(fx, 5), 200)], [[36], [36]]);
});
test("a looping effect replays its steps from the pose time, not the exact clock (ruling 4 and 6) (QA 33h A/B)", () => {
  const fx: LiveFx = { id: "e", castMs: 0, caster: "a", loopMs: 100, pieces: [piece({ ms: 50 })] };
  assert.deepEqual([1015, 1045, 1075, 1105].map((t) => xs(createSceneLink(), world(fx), t).length), [0, 1, 0, 0]);
});
test("events across effects are global by time; ties keep the effects' order in the call, then timeline before fx:loop (EA ruling on 33h A/B, ruling 5) (QA 33h A/B)", () => {
  const run = (list: LiveFx[], times: number[]): string[] => { const link = createSceneLink(), w: SceneWorld = { ...world(e1), effects: list }; let out: string[] = []; for (const t of times) { link.scene(w, { tMs: t, stepMs: 10 }); out = link.fired.map((e) => `${e.fx}:${e.type}@${e.at}`); } return out; };
  const e1: LiveFx = { id: "e1", castMs: 100, caster: "a", pieces: [piece()] }, e2: LiveFx = { id: "e2", castMs: 0, caster: "a", hitOffsetMs: 50, pieces: [piece({ ms: 100 })] };
  const at100 = (id: string): string[] => [`${id}:fx:start@100`, `${id}:clip:event@100`, `${id}:clip:event@100`, `${id}:fx:release@100`, `${id}:fx:hit@100`];
  assert.deepEqual(run([e1, e2], [0, 150]), ["e2:fx:hit@50", ...at100("e1"), "e2:fx:end@100"]);
  const h: LiveFx = { id: "h", castMs: 0, caster: "a", hitOffsetMs: 100, loopMs: 100, pieces: [piece({ ms: 100 })] }, s: LiveFx = { id: "s", castMs: 100, caster: "a", pieces: [piece()] };
  assert.deepEqual([run([h, s], [0, 100]), run([s, h], [0, 100])], [["h:fx:hit@100", "h:fx:loop@100", ...at100("s")], [...at100("s"), "h:fx:hit@100", "h:fx:loop@100"]]);
});
test("a step whose anchor unit is missing draws at the effect's at-cell, and skips only with no at-cell (EA ruling on 33h A/B) (QA 33h A/B)", () => {
  const fx: LiveFx = { id: "e", castMs: 0, caster: "gone", at: { c: 4, r: 1 }, pieces: [piece()] }, noCell: LiveFx = { id: "e", castMs: 0, caster: "gone", pieces: [piece()] };
  assert.deepEqual([xs(createSceneLink(), world(fx), 100), xs(createSceneLink(), world(noCell), 100)], [[68], []]);
});
