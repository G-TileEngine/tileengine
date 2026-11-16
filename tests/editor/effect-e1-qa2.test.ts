// QA pins from the E1 kit review (QA plants the shipped E1 tests missed): seed 0 and NaN codes, the fold into every
// particle piece, a variant_seed note once per effect, every noPicture noted, a pure converter, spread at 0, multi-beat parts.
import assert from "node:assert/strict";
import { test } from "node:test";
import { beatOf, fit } from "../../src/editor/effect/fit.ts";
import { docToLiveFx, type DocHost, type FxDocValues } from "../../src/runtime/render/fx-doc.ts";
import { createFxLive, type FxPiece, type LiveFx } from "../../src/runtime/render/index.ts";
import { variantSeed } from "../../src/runtime/render/fx-particles.ts";

const sheet = { id: "fx", fw: 16, fh: 16, columns: 4 }, grid = { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 7 };
const host: DocHost = { id: "q", castMs: 0, caster: "u0", at: { c: 2, r: 2 }, sheetOf: (s) => (s["picture"] === "none" ? null : sheet) };
const spark: FxPiece = { at: 0, ms: 480, sheet, kind: "particles", particle_count: 12 }, plain: FxPiece = { at: 0, ms: 480, sheet };
const fx = (id: string, pieces: FxPiece[], seed?: unknown): LiveFx => ({ id, castMs: 0, caster: "u0", at: { c: 2, r: 2 }, pieces, ...(seed === undefined ? {} : { variant_seed: seed }) });
const frame = (list: LiveFx[]) => createFxLive().frame(list, () => null, 0, 200, grid);
const st = (o: Record<string, unknown> = {}): Record<string, unknown> => ({ kind: "straight", seconds: 0.3, ...o });

test("QA E1: seed 0 is clean, NaN/Infinity are outOfRange; the seed reaches every particle piece; one note per bad effect", () => {
  assert.deepEqual([0, Number.NaN, Infinity].map(variantSeed), [{ seed: 0, bad: null }, { seed: 0, bad: "outOfRange" }, { seed: 0, bad: "outOfRange" }]);
  for (let k = 0; k < 4; k += 1) { const pieces = [0, 1, 2, 3].map((j) => (j === k ? spark : plain));
    assert.notDeepEqual(frame([fx("e", pieces, 5)]).dots, frame([fx("e", pieces)]).dots, `particle piece ${k}`); }
  const bad = (out: { notes: readonly { code: string; message: string }[] }): number => out.notes.filter((n) => n.message === "variant_seed").length;
  assert.equal(bad(frame([fx("a", [spark, spark, plain], -1)])), 1); assert.equal(bad(frame([fx("a", [spark, spark], -1), fx("b", [spark, plain], "5")])), 2);
  assert.equal(bad(frame([fx("a", [spark, spark], 0)])), 0);
});

test("QA E1: every missing picture is noted and skipped; the converter leaves its input untouched; spread needs a value above 0; a multi-beat part uses timing", () => {
  const miss = docToLiveFx({ steps: [st({ picture: "none" }), st(), st({ picture: "none" })] }, host);
  assert.deepEqual(miss.notes.filter((n) => n.code === "noPicture").map((n) => n.message), ["steps[0]", "steps[2]"]); assert.equal(miss.fx.pieces.length, 1);
  const doc: FxDocValues = { variant_seed: 3, parts: [{ id: "p", kind: "trail", beats: ["cast"], from: { effect: "x", rev: 1 } }], steps: [st({ id: "a", part: "p", nudge_ms: 30 }), st({ id: "b", enabled: false })] };
  const before = JSON.stringify(doc); docToLiveFx(doc, host); fit(doc, []); assert.equal(JSON.stringify(doc), before);
  const zero = fit({ parts: [{ id: "c", kind: "shape", beats: ["cast"] }], steps: Array.from({ length: 13 }, (_, i) => st({ id: `s${i}`, part: "c", jitter: 0, start_spread: 0, size_spread: 0 })) }, []);
  assert.deepEqual(zero.messages, ["Still 13 steps: steps 13+ are saved but won't play"]);
  const beats: FxDocValues = { parts: [{ id: "p", kind: "shape", beats: ["cast", "hit"] }], connect_step: "h", steps: [st({ id: "c", part: "p" }), st({ id: "h", part: "p" }), st({ id: "l", part: "p" })] };
  assert.deepEqual([0, 1, 2].map((i) => beatOf(beats, i)), ["cast", "hit", "linger"]);
});
