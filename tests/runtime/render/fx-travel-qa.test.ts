import assert from "node:assert/strict";
import { test } from "node:test";
import { docToLiveFx, type DocHost, type FxDocValues } from "../../../src/runtime/render/fx-doc.ts";
import { pathAt, readPath, type FxPath } from "../../../src/runtime/render/fx-path.ts";
import type { LiveFx } from "../../../src/runtime/render/fx-live.ts";
import { createSceneLink } from "../../../src/runtime/scene/world-scene.ts";
const sheet = { id: "fx", fw: 16, fh: 16, columns: 4 }, host: DocHost = { id: "q", castMs: 0, caster: "u0", target: "u1", sheetOf: () => sheet };
const look = (doc: FxDocValues, t: number): string | undefined => { const fx: LiveFx = docToLiveFx(doc, host).fx, units = [0, 1].map((i) => ({ id: `u${i}`, sprite: "hero", at: { c: 2, r: 2 + i * 3 }, offset: null, facing: "E" as const, alive: true }));
  const out = createSceneLink().scene({ cols: 8, rows: 8, tileW: 16, tileH: 16, mapSeed: 3, overlays: [], objects: [], layers: [], units, assets: { hero: { sheet: { ...sheet, id: "hero" } }, fx: { sheet } }, effects: [fx] }, { tMs: t, stepMs: 10 }) as unknown as { overlays: { look?: string }[] };
  return out.overlays[0]?.look; };
const p = (o: Record<string, unknown>): FxPath => readPath({ kind: "straight", ...o }, 0, 600).path as FxPath;
const xy = (q: FxPath, t: number, a: { x: number; y: number }, b: { x: number; y: number }, w: number, h: number): [number, number] => { const s = pathAt(q, t, a, b, w, h); return [s.x, s.y]; };
test("E2 QA: the travel turn adds the step's own angle (ruling 8: (angle ?? 0) + deg)", () => {
  const south = look({ steps: [{ kind: "straight", seconds: 0.6, bend: 0, angle: 90 }] }, 300), still = look({ steps: [{ kind: "stamp", seconds: 0.6, angle: 180 }] }, 300);
  assert.notEqual(south, look({ steps: [{ kind: "straight", seconds: 0.6, bend: 0 }] }, 300)); assert.equal(south, still);
});
test("E2 QA: a ride naming its own step is unknownRef and the piece plays at its anchor (ruling 10); on a travel step ride is ignored (ruling 16)", () => {
  const { fx, notes } = docToLiveFx({ steps: [{ id: "a", kind: "stamp", seconds: 0.6, ride: "a" }, { id: "b", kind: "straight", seconds: 0.6, ride: "b" }] }, host);
  assert.equal(fx.pieces[0]?.path, undefined); assert.equal(fx.pieces[1]?.path?.kind, "straight"); assert.deepEqual(notes, [{ code: "unknownRef", message: "steps[0].ride" }]);
});
test("E2 QA: shapes scale with the world's tile size: bend and orbit radius × tileW, bounce dc × tileW and dr × tileH (ruling 5)", () => {
  const a = { x: 16, y: 32 }, b = { x: 112, y: 32 };
  assert.deepEqual(xy(p({ bend: 1 }), 300, a, b, 32, 16), [64, 0], "1 tile of bend = tileW 32 px");
  assert.deepEqual(xy(p({ kind: "orbit", orbit_radius: 1 }), 300, a, b, 32, 32), [32, 32], "radius 1 tile = 32 px at mid-flight");
  assert.deepEqual(xy(p({ kind: "bounce", bend: 0, bounce_points: [{ dc: 1, dr: 1 }] }), 300, a, { x: 80, y: 32 }, 32, 16), [48, 48], "hop at (dc·tileW, dr·tileH)");
});
