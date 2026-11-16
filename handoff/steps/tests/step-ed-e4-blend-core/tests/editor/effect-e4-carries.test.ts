import assert from "node:assert/strict";
import { test } from "node:test";
import { fit, flatten } from "../../src/editor/effect/fit.ts";
import { docToLiveFx, stepTimes, type DocHost, type FxDocValues } from "../../src/runtime/render/fx-doc.ts";
import { createSceneLink, type SceneWorld } from "../../src/runtime/scene/world-scene.ts";
type Row = Record<string, unknown>;
const sheet = { id: "fx", fw: 16, fh: 16, columns: 4 }, host: DocHost = { id: "c", castMs: 0, caster: "u0", target: "u1", sheetOf: () => sheet };
const stamps = (n: number, o: Row = {}): Row[] => Array.from({ length: n }, (_, i) => ({ id: `t${i}`, kind: "stamp", seconds: 0.3, ...o }));
test("E4 carry (e): Fit pins connect_step to the hit step when it is absent, empty, not a string or names no step in the first 12, so a drop never moves the hit", () => {
  const parts = [{ id: "tr", kind: "trail", beats: ["cast"] }], steps = stamps(13).map((s, i) => (i === 3 || i === 4 ? { ...s, part: "tr" } : s));
  for (const named of [undefined, "", 7, "nope", "t12"]) {
    const r = fit({ parts, steps, ...(named === undefined ? {} : { connect_step: named }) }, []);
    assert.equal(r.doc["connect_step"], "t11", String(named)); assert.equal(stepTimes(r.doc).hitIndex, 10, "t11 is still the hit after t4 goes"); assert.deepEqual(r.messages, ["Trimmed 1 trail step to fit"]);
  }
  assert.equal(fit({ connect_step: "t2", steps: stamps(3) }, []).doc["connect_step"], "t2", "a good id is kept");
});
test("E4 Fit keeps one hit moment: when Fit drops a base step before the hit, the other side's at-time steps move with the base hit (clamped at 0)", () => {
  const hp = [{ id: "ph", kind: "sparks", beats: ["hit"] }], other = Array.from({ length: 10 }, (_, i) => ({ id: `o${i}`, kind: "stamp", part: "ph", start_mode: "at-time", start_at_ms: i === 0 ? 100 : 900 }));
  const doc: FxDocValues = { connect_step: "h", parts: hp, steps: [{ id: "b0", kind: "stamp", seconds: 0.3, jitter: 1 }, { id: "b1", kind: "stamp", seconds: 0.3 }, { id: "h", kind: "stamp", seconds: 0.3 }, ...other] };
  const r = fit(doc, ["base", "base", "base", ...other.map(() => "other" as const)]), rows = r.doc["steps"] as Row[];
  assert.deepEqual(rows.map((s) => s["id"]).slice(0, 3), ["b1", "h", "o0"]); assert.deepEqual(r.messages, ["Trimmed 1 spread step to fit"]);
  assert.deepEqual([stepTimes(doc).hitMs - stepTimes(r.doc).hitMs, rows[2]?.["start_at_ms"], rows[3]?.["start_at_ms"]], [300, 0, 600]);
  assert.deepEqual((fit(doc, []).doc["steps"] as Row[]).find((s) => s["id"] === "o1")?.["start_at_ms"], 900, "a base-only fit moves nothing");
});
test("E4 flatten pin (E2 ruling 11): an empty or non-string ride is removed even when the other side has a step whose id is the empty string", () => {
  let n = 0; const mint = (p: string): string => `${p}${(n += 1)}`;
  const b = { id: "B", rev: 1, doc: { steps: [{ id: "", kind: "straight", seconds: 0.3 }, { id: "r", kind: "stamp", ride: "" }, { id: "q", kind: "stamp", ride: 5 }, { id: "k", kind: "stamp", ride: null }] } };
  const moved = (flatten({ id: "A", rev: 1, doc: { steps: [{ id: "a", kind: "stamp" }] } }, b, { base: "a", mix: 0, mint }).doc["steps"] as Row[]).slice(1);
  assert.deepEqual(moved.map((s) => "ride" in s), [false, false, false, false]);
});
test("E4 Fit drops a ridden step: the rider keeps its ride and plays at its anchor with unknownRef (CN-026 rule 5)", () => {
  const doc: FxDocValues = { connect_step: "h", steps: [...stamps(9), { id: "h", kind: "stamp", seconds: 0.3 }, { id: "t", kind: "straight", seconds: 0.15 }, { id: "l", kind: "straight", seconds: 0.6 }, { id: "r", kind: "stamp", ride: "t" }] };
  const r = fit(doc, []), rows = r.doc["steps"] as Row[], out = docToLiveFx(r.doc, host);
  assert.deepEqual([rows.some((s) => s["id"] === "t"), rows[11]?.["ride"], r.messages], [false, "t", ["Trimmed 1 linger step to fit"]]);
  assert.deepEqual(out.notes, [{ code: "unknownRef", message: "steps[11].ride" }]); assert.equal(out.fx.pieces[11]?.path, undefined);
});
test("E4 H foot (E2 carry, ruled: unchanged): a named-anchor travel piece carries its caster's sub-tile offset (dx, dy) along the whole path; a plain piece does not", () => {
  const at = (step: Row, dx: number, dy: number, t: number): [number, number] => {
    const fx = docToLiveFx({ steps: [{ id: "a", kind: "straight", bend: 0, seconds: 0.6, ...step }] }, host).fx, w = { cols: 10, rows: 10, tileW: 16, tileH: 16, mapSeed: 3, overlays: [], objects: [], layers: [], effects: [fx], assets: { hero: { sheet: { ...sheet, id: "hero" } }, fx: { sheet } },
      units: [{ id: "u0", sprite: "hero", at: { c: 2, r: 2 }, offset: dx === 0 && dy === 0 ? null : { dx, dy }, facing: "E" as const, alive: true }, { id: "u1", sprite: "hero", at: { c: 6, r: 2 }, offset: null, facing: "E" as const, alive: true }] } as SceneWorld;
    const p = (createSceneLink().scene(w, { tMs: t, stepMs: 10 }) as unknown as { overlays: { sheet: { id: string }; x: number; y: number }[] }).overlays.find((o) => o.sheet.id === "fx"); assert.ok(p !== undefined); return [p.x, p.y];
  };
  assert.deepEqual([0, 300].map((t) => at({ anchor_point: "centre" }, 0.5, 0.25, t)), [[40, 28], [72, 28]]); assert.deepEqual([0, 300].map((t) => at({ anchor_point: "centre" }, 0, 0, t)), [[32, 24], [64, 24]]);
  assert.deepEqual([0, 300].map((t) => at({}, 0.5, 0.25, t)), [[32, 32], [64, 32]]);
});
