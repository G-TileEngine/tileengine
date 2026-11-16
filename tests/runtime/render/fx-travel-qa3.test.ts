import assert from "node:assert/strict";
import { test } from "node:test";
import { docToLiveFx, type DocHost } from "../../../src/runtime/render/fx-doc.ts";
import { pathAt, readPath, type FxPath } from "../../../src/runtime/render/fx-path.ts";
import type { LiveFx } from "../../../src/runtime/render/fx-live.ts";
import { createSceneLink } from "../../../src/runtime/scene/world-scene.ts";
const sheet = { id: "fx", fw: 16, fh: 16, columns: 4 }, host: DocHost = { id: "q3", castMs: 0, caster: "u0", target: "u1", sheetOf: () => sheet };
type Out = { overlays: { sheet: { id: string }; x: number; y: number }[] };
const world = (fx: LiveFx, c0: number) => ({ cols: 10, rows: 10, tileW: 16, tileH: 16, mapSeed: 3, overlays: [], objects: [], layers: [], effects: [fx], assets: { hero: { sheet: { ...sheet, id: "hero" } }, fx: { sheet } },
  units: [{ id: "u0", sprite: "hero", at: { c: c0, r: 2 }, offset: null, facing: "E" as const, alive: true }, { id: "u1", sprite: "hero", at: { c: 2, r: 5 }, offset: null, facing: "E" as const, alive: true }] });
// plays frames `early` with the caster on column `c0`, then frame `t` with it on column 6; returns the travel piece's [x, y]
const play = (step: Record<string, unknown>, c0: number, early: number[], t: number): [number, number] => { const fx = docToLiveFx({ steps: [{ id: "a", kind: "straight", bend: 0, ...step }] }, host).fx, link = createSceneLink();
  for (const e of early) link.scene(world(fx, c0), { tMs: e, stepMs: 10 }); const p = (link.scene(world(fx, 6), { tMs: t, stepMs: 10 }) as unknown as Out).overlays.find((o) => o.sheet.id === "fx"); assert.ok(p !== undefined); return [p.x, p.y]; };
test("E2 QA builds: after the caster moves, a travel piece is offset from the cell placeStep anchored (ruling 4): named anchors keep only their anchor_point offset, plain and screen pieces track the live cell", () => {
  for (const step of [{ seconds: 0.6, anchor_point: "centre" }, { seconds: 0.6, anchor_point: "foot" }, { seconds: 0.6 }, { seconds: 0.6, anchor_point: "centre", anchor: "screen" }, { seconds: 0.6, anchor_point: "centre", attach: "follow" }])
    assert.deepEqual(play(step, 2, [0, 100], 300), play(step, 6, [0, 100], 300), JSON.stringify(step));
  assert.deepEqual(play({ seconds: 0.6, anchor_point: "foot" }, 2, [0, 100], 300), [64, 56], "foot: halfway from (6, 2) to (2, 5)");
  const detach = { seconds: 1, anchor_point: "centre", attach: "follow", detach: "hit" }; // hit = 0.92 × 1000; the caster moves after it
  assert.deepEqual(play(detach, 2, [0, 300, 600, 900, 930, 950], 990), play(detach, 6, [0, 300, 600, 900, 930, 950], 990), "detach at hit");
});
test("E2 QA builds: holding keeps the last heading on a curved path too (ruling 8)", () => {
  const arc = readPath({ kind: "straight", bend: 1 }, 0, 600).path as FxPath, a = { x: 8, y: 16 }, b = { x: 56, y: 16 };
  assert.equal(pathAt(arc, 9000, a, b, 16, 16).deg, pathAt(arc, 600, a, b, 16, 16).deg); assert.ok((pathAt(arc, 9000, a, b, 16, 16).deg ?? 0) > 45, "it lands falling and stays that way");
});
