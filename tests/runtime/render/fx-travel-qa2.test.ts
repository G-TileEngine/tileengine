import assert from "node:assert/strict";
import { test } from "node:test";
import { docToLiveFx, type DocHost } from "../../../src/runtime/render/fx-doc.ts";
const sheet = { id: "fx", fw: 16, fh: 16, columns: 4 }, host: DocHost = { id: "q2", castMs: 0, caster: "u0", target: "u1", sheetOf: () => sheet };
test("E2 QA r3: ride resolves to the FIRST step with that id (ruling 10, CN-026 rule 1)", () => {
  const first = docToLiveFx({ steps: [{ id: "a", kind: "stamp" }, { id: "a", kind: "straight", seconds: 0.6 }, { kind: "stamp", ride: "a" }] }, host);
  assert.equal(first.fx.pieces[2]?.path, undefined); assert.deepEqual(first.notes, [{ code: "unknownRef", message: "steps[2].ride" }]);
  const travelFirst = docToLiveFx({ steps: [{ id: "a", kind: "straight", seconds: 0.6 }, { id: "a", kind: "orbit", seconds: 0.3 }, { kind: "stamp", ride: "a" }] }, host);
  assert.deepEqual(travelFirst.fx.pieces[2]?.path, travelFirst.fx.pieces[0]?.path); assert.deepEqual(travelFirst.notes, []);
});
test("E2 QA r3: on a non-rider kind or a screen flash a ride of any type is ignored, with no note (ruling 16, CN-026 rule 1b)", () => {
  const { fx, notes } = docToLiveFx({ steps: [{ kind: "dim", ride: 7 }, { kind: "straight", seconds: 0.6, ride: null }, { kind: "flash", ride: 5 }, { kind: "orbit", seconds: 0.3, ride: { id: "x" } }] }, host);
  assert.deepEqual(notes, []); assert.equal(fx.pieces[1]?.path?.kind, "straight"); assert.equal(fx.pieces[3]?.path?.kind, "orbit"); assert.equal(fx.pieces[2]?.path, undefined);
});
test("E2 QA r3: an empty ride is unknownRef even when a step's id is empty (CN-026 rule 3; like connect_step \"\")", () => {
  const { fx, notes } = docToLiveFx({ steps: [{ id: "", kind: "straight", seconds: 0.6 }, { kind: "stamp", ride: "" }] }, host);
  assert.equal(fx.pieces[1]?.path, undefined); assert.deepEqual(notes, [{ code: "unknownRef", message: "steps[1].ride" }]);
});
