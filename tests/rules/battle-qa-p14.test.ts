import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import type { BattleSetup } from "../../src/rules/battle/index.ts";
import { createWorld, snapshot, submit } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

// QA P1-4 pin: abilities?.[unitId] hits prototype keys; a constructor/__proto__/toString document id must use the default 3/2 and not throw.
const S: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 8, atk: 1 } }, hitClass: "basic", abilities: { archer: [{ reach: 3, damage: 2, effectRef: "line-shot" }] } };
const shot = (id: string, actor: string, unitId: string): Action =>
  ({ id, kind: "ability", actor, target: { pipe: "unit", unitId }, durationMs: null, turns: null, effects: ["line-shot"] });

test("qa: a line-shot from a prototype-key unit document id uses default 3/2 and does not throw", () => {
  for (const unitId of ["constructor", "__proto__", "toString"]) {
    const w = createWorld({ ...input("stage-fixed"), rules: S });
    const got = w.units.place({ unitId, side: "player", at: { c: 2, r: 3 }, facing: null });
    assert.equal(got.ok, true);
    if (!got.ok) throw new Error(`place ${unitId}`);
    submit(w, shot("s1", got.id, "wolf#3"));
    assert.deepEqual(w.notices.map((n) => n.code), []);
    assert.equal(snapshot(w).rules?.units.find((u) => u.id === "wolf#3")?.hp, 6);
    const ev = w.bus.history().map((r) => r.event).find((e) => e.type === "hit") as { amount?: number; hitClass?: string } | undefined;
    assert.deepEqual({ amount: ev?.amount, hitClass: ev?.hitClass }, { amount: 2, hitClass: "spell" });
  }
});
