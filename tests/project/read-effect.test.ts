import assert from "node:assert/strict";
import { test } from "node:test";
import { EFFECT_ANSWERS, readEffect } from "../../src/project/read/effect.ts";

const env = (o: Record<string, unknown> = {}): Record<string, unknown> => ({ kind: "behaviour-setup", formatVersion: 3, id: "setup_01J0EFFECT0000000000000000", rev: 4, behaviourId: "effect", answers: {}, history: { cap: 200, baseSeq: 0, ops: [] }, orphans: {}, copiedFrom: null, parts: [{ id: "p1" }], ...o });
const ok = (json: unknown, defaults?: Readonly<Record<string, unknown>>): { id: string; rev: number; values: Readonly<Record<string, unknown>> } => { const r = readEffect(json, defaults); assert.equal(r.ok, true); return r.ok ? r.doc : { id: "", rev: 0, values: {} }; };

test("E7p readEffect: happy path keeps id, rev and effective values; history, orphans, copiedFrom and parts stay out of values", () => {
  const doc = ok(env({ answers: { connect: { source: "user", value: 0.5 }, steps: { source: "user", value: [{ kind: "stamp", seconds: 0.3 }] }, shake: { source: "preset", value: 2 } } }));
  assert.deepEqual(doc, { id: "setup_01J0EFFECT0000000000000000", rev: 4, values: { connect: 0.5, steps: [{ kind: "stamp", seconds: 0.3 }], shake: 2 } });
  assert.equal("history" in doc.values || "orphans" in doc.values || "copiedFrom" in doc.values || "parts" in doc.values, false);
});

test("E7p readEffect: source default uses defaults[knob] when present and leaves the key out when it is not (catalogue connect 0.5 ≠ runtime 0.92)", () => {
  const answers = { connect: { source: "default" }, shake: { source: "default", value: 9 }, steps: { source: "user", value: [] } };
  assert.deepEqual(ok(env({ answers }), { connect: 0.5, unused: 1 }).values, { connect: 0.5, steps: [] });
  assert.deepEqual(ok(env({ answers })).values, { steps: [] });
  assert.equal("shake" in ok(env({ answers }), { connect: 0.5 }).values, false);
});

test("E7p readEffect: a unit doc, formatVersion 2, a missing answers record, a 65th answer and prototype keys are refused or skipped without a throw", () => {
  const unit = readEffect(env({ behaviourId: "unit" })); assert.equal(unit.ok, false); if (!unit.ok && !unit.needsMigration) assert.equal(unit.error, "bad field behaviourId");
  const v2 = readEffect(env({ formatVersion: 2 })); assert.equal(v2.ok, false); if (!v2.ok) assert.equal(v2.needsMigration, true);
  assert.equal(readEffect(env({ answers: null })).ok, false);
  const many: Record<string, unknown> = {}; for (let i = 0; i < EFFECT_ANSWERS + 1; i += 1) many[`k${i}`] = { source: "user", value: i };
  const cap = readEffect(env({ answers: many })); assert.equal(cap.ok, false); if (!cap.ok && !cap.needsMigration) assert.equal(cap.error, "over cap answers");
  const proto = Object.assign(Object.create({ stolen: { source: "user", value: 1 } }), { steps: { source: "user", value: [1] } });
  Object.defineProperty(proto, "constructor", { value: { source: "user", value: 7 }, enumerable: true, configurable: true });
  assert.deepEqual(ok(env({ answers: proto })).values, { steps: [1], constructor: 7 });
  assert.doesNotThrow(() => readEffect(new Proxy(env(), { get: () => { throw new Error("get"); } })));
  const long = Array.from({ length: 13 }, () => ({ kind: "stamp" }));
  assert.equal((ok(env({ answers: { steps: { source: "user", value: long } } })).values["steps"] as unknown[]).length, 13);
});
