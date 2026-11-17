import assert from "node:assert/strict";
import { test } from "node:test";
import { readSetup, readStage, readStageOverrides, readUnit } from "../../src/project/read/index.ts";

const L = { picks: 8, waveUnits: 16 };
const unit = (more: Record<string, unknown> = {}) => ({ kind: "unit", formatVersion: 2, id: "mage", rev: 1, ...more });
const setup = (more: Record<string, unknown> = {}) => ({ kind: "behaviour-setup", formatVersion: 3, id: "ls", behaviourId: "line-shot", catalogue: { rev: 26 }, ...more });

test("readUnit: v2 subset sprite, setupIds, stats; a bad field is refused; core identity is kept", () => {
  const ok = readUnit(unit({ sprite: "mage.png", setupIds: ["ls", "ba"], stats: { reach: 4, damage: 3 } }));
  assert.equal(ok.ok, true);
  if (ok.ok) assert.deepEqual(ok.doc, { kind: "unit", formatVersion: 2, id: "mage", rev: 1, sprite: "mage.png", setupIds: ["ls", "ba"], stats: { reach: 4, damage: 3 } });
  assert.equal(readUnit(unit()).ok, true);
  assert.equal(readUnit(unit({ sprite: 1 })).ok, false);
  assert.equal(readUnit(unit({ setupIds: [1] })).ok, false);
  assert.equal(readUnit(unit({ stats: { reach: "x" } })).ok, false);
  assert.equal(readUnit({ kind: "unit", formatVersion: 1, id: "mage", rev: 1 }).ok, false);
});

test("readSetup keeps answers; readStageOverrides is additive and readStage still loads a stage that carries them", () => {
  const s = readSetup(setup({ answers: { reach: { source: "user", value: 4, rev: 1 } } }));
  assert.equal(s.ok, true);
  if (s.ok) assert.equal(s.doc.behaviourId, "line-shot");
  const noCat = readSetup({ kind: "behaviour-setup", formatVersion: 3, id: "ls", behaviourId: "line-shot" });
  assert.equal(noCat.ok, false);
  assert.equal(noCat.ok === false && "error" in noCat ? noCat.error : "", "bad field catalogue");
  const stage = { kind: "stage", formatVersion: 2, id: "s", rev: 1, mapRef: "m", playerSpawns: [{ c: 0, r: 0 }], neutrals: [], enemyPool: { mode: "fixed", entries: [] }, loadout: null, rules: [], overrides: { ls: { reach: 4 } } };
  const ov = readStageOverrides(stage);
  assert.equal(ov.ok, true);
  if (ov.ok) assert.deepEqual(ov.doc, { ls: { reach: 4 } });
  const bag: Record<string, unknown> = Object.create(null);
  bag.ls = { reach: 4 };
  bag["__proto__"] = { x: 1 };
  const proto = readStageOverrides({ overrides: bag });
  assert.equal(proto.ok, true);
  if (proto.ok) {
    assert.equal(Object.getPrototypeOf(proto.doc), Object.prototype);
    assert.equal("x" in proto.doc, false);
    assert.deepEqual(proto.doc, { ls: { reach: 4 } });
  }
  const st = readStage(stage, L);
  assert.equal(st.ok, true);
  if (st.ok) assert.equal("overrides" in st.doc, false);
  assert.equal(readStageOverrides({ overrides: 1 }).ok, false);
});
