import assert from "node:assert/strict";
import { test } from "node:test";
import { blankEffect, commit, ownerOf, saveAndUse, type Store } from "../../src/editor/effect/save.ts";
type Row = Record<string, unknown>;
const at = "2026-11-17T03:00:00.000Z", F = "setups/basic-attack.json", ID = `setup_01JD${"0".repeat(21)}1`;
test("E6 QA r3 (ruling 14): a full stored envelope loads: the owner a Save & use wrote, and one with every §8 field", async () => {
  const files = new Map<string, string>(), s: Store = { read: async (k) => files.get(k) ?? null, write: async (k, t) => { files.set(k, t); }, remove: async (k) => { files.delete(k); } };
  const owner: Row = { kind: "behaviour-setup", formatVersion: 3, id: "setup_O", rev: 0, behaviourId: "basic-attack", answers: {}, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [] } }; let n = 0;
  const out = saveAndUse({ name: `effects/${ID}.json`, doc: null, values: { shake: 1 } }, { name: F, doc: owner }, { at, mint: (p) => `${p}${(n += 1)}`, id: ID, label: "F", catalogueRev: 1 }); assert.ok(!("error" in out));
  assert.ok(!("error" in await commit(s, out.docs, { [F]: null }, { absent: out.absent }))); const text = files.get(F) ?? "";
  assert.deepEqual(ownerOf(F, text), { doc: JSON.parse(text) as Row }); assert.ok(Object.keys(JSON.parse(text) as Row).length > 8);
  const full = { ...blankEffect(ID, "F", at, 1), behaviourId: "basic-attack", rev: 3, copiedFrom: "setup_X" }; assert.deepEqual(ownerOf(F, JSON.stringify(full)), { doc: full });
});
