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
