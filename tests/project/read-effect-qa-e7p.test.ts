import assert from "node:assert/strict";
import { test } from "node:test";
import { readEffect } from "../../src/project/read/effect.ts";
import { docToLiveFx, stepTimes } from "../../src/runtime/render/fx-doc.ts";

test("an own answers key __proto__ (JSON) does not become the values prototype or compile as steps", () => {
  const json = JSON.parse('{"kind":"behaviour-setup","formatVersion":3,"id":"setup_01J0EFFECT0000000000000000","rev":4,"behaviourId":"effect","answers":{"__proto__":{"source":"user","value":{"steps":[{"kind":"stamp","seconds":0.9}],"loopMs":1200}},"shake":{"source":"user","value":2}}}');
  const r = readEffect(json);
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(Object.getPrototypeOf(r.doc.values), Object.prototype);
  assert.equal("steps" in r.doc.values, false);
  assert.equal(r.doc.values["shake"], 2);
  const compiled = docToLiveFx(r.doc.values, { id: "t", castMs: 0, caster: "k1", sheetOf: () => ({ id: "fx", columns: 4, fw: 16, fh: 16 }) });
  assert.equal(compiled.fx.pieces.length, 0);
  assert.equal(stepTimes(r.doc.values).endMs, 0);
});
