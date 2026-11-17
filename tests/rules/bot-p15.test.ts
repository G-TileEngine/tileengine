import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { WIN_CONDITION, wipeRule, type BattleSetup } from "../../src/rules/battle/index.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
import { SNAPSHOT_KEYS, createWorld, divergentSnapshotKey, runMatch, snapshot } from "../../src/sim/index.ts";
import { acceptedCheck } from "../../src/sim/exploit.ts";
import type { Action } from "../../src/core/log/index.ts";
import { input } from "../sim/input.ts";
import type { ChaosView } from "../../src/sim/index.ts";

const SETUP: BattleSetup = {
  base: { hp: 9, atk: 1 },
  stats: { wolf: { hp: 4, atk: 1 }, archer: { hp: 6, atk: 2 }, knight: { hp: 9, atk: 1 } },
  hitClass: "basic",
  reach: { knight: 1, wolf: 1, archer: 2 },
  abilities: { archer: [{ reach: 3, damage: 2, effectRef: "line-shot" }] },
};
const armed = () => ({ ...input("stage-fixed"), rules: SETUP });
const sides = ["player", "wolves"] as const;
const win = installOne(WIN_CONDITION, {}).out;
if (win === null) throw new Error("win");
const budget = installOne(ACTION_BUDGET, {}).out;
if (budget === null) throw new Error("budget");
const bot = () => botAbilityPriority({ actionsPerTurn: budget.actionsPerTurn, setup: SETUP });
const sha = (v: unknown): string => createHash("sha256").update(JSON.stringify(v)).digest("hex");

test("bot-ability-priority: a spell already in reach is spent before a basic and before a step; the side gets 2 actions", () => {
  const w = createWorld(armed());
  w.units.moveTo("archer#2", { c: 2, r: 3 }, "move"); // wolf#3 at 2,0 — shot range 3
  w.units.moveTo("knight#1", { c: 2, r: 1 }, "move"); // adjacent, would basic
  const acts = bot()(w, "player");
  assert.equal(acts.length, 2);
  assert.deepEqual(acts[0]?.effects, ["line-shot"]);
  assert.equal(acts[0]?.actor, "archer#2");
  assert.deepEqual(acts[1]?.effects, ["line-shot"]); // a second shot still outranks the knight's basic
});

test("when no shot is in reach, a basic in reach is spent before a step", () => {
  const w = createWorld(armed());
  w.units.moveTo("knight#1", { c: 2, r: 1 }, "move");
  const acts = bot()(w, "player");
  assert.equal(acts[0]?.kind, "ability");
  assert.deepEqual(acts[0]?.effects, []);
  assert.equal(acts[0]?.actor, "knight#1");
});

test("nearest foe is the shortest BFS path; ties go to lowest HP then placement; two calls match (no RNG)", () => {
  const w = createWorld(armed());
  const a = bot()(w, "wolves"), b = bot()(w, "wolves");
  assert.deepEqual(a, b);
  assert.equal(a[0]?.kind, "move");
  const who = w.units.get(a[0]?.actor ?? "");
  const at = a[0]?.target && a[0].target.pipe === "tile" ? a[0].target.at : null;
  assert.ok(who !== undefined && at !== null && Math.abs(who.at.c - at.c) + Math.abs(who.at.r - at.r) <= 2);
});

test("chaos SNAPSHOT_KEYS includes rules; a hit that only changes HP diverges on 'rules'", () => {
  assert.equal(SNAPSHOT_KEYS.includes("rules"), true);
  const w = createWorld(armed());
  const before = snapshot(w);
  assert.ok(before.rules !== undefined);
  const after = { ...before, rules: { units: (before.rules?.units ?? []).map((u, i) => i === 0 ? { ...u, hp: u.hp - 1 } : u) } };
  assert.equal(divergentSnapshotKey(before, after), "rules");
  assert.equal(divergentSnapshotKey(before, { ...before, logSeq: before.logSeq + 1 }), "logSeq");
});

test("acceptedCheck allows a legal ability or interact when rules are on, and still refuses a move off the board", () => {
  const w = createWorld(armed());
  const side = { now: "player" };
  const check = acceptedCheck(side, null);
  const view = (action: Action | null): ChaosView => ({
    prev: snapshot(w), before: snapshot(w), fed: snapshot(w), after: snapshot(w), world: w,
    step: { intent: { type: "SelectUnit", unitId: "knight#1" }, aim: null, tick: 0, from: "idle", event: null, action, reject: null },
  } as ChaosView);
  const ability: Action = { id: "a", kind: "ability", actor: "knight#1", target: { pipe: "unit", unitId: "wolf#3" }, durationMs: null, turns: null, effects: [] };
  const talk: Action = { id: "t", kind: "interact", actor: "knight#1", target: { pipe: "unit", unitId: "crate#5" }, durationMs: null, turns: null, effects: [] };
  assert.equal(check.run(view(ability)), null);
  assert.equal(check.run(view(talk)), null);
  assert.notEqual(check.run(view({ ...ability, durationMs: 5 })), null);
  const off = createWorld(input("stage-fixed"));
  const offView: ChaosView = { prev: snapshot(off), before: snapshot(off), fed: snapshot(off), after: snapshot(off), world: off, step: { intent: { type: "SelectUnit", unitId: "knight#1" }, aim: null, tick: 0, from: "idle", event: null, action: ability, reject: null } } as ChaosView;
  assert.equal(snapshot(off).rules, undefined);
  assert.notEqual(acceptedCheck(side, null).run(offView), null);
  const badMove: Action = { id: "m", kind: "move", actor: "knight#1", target: { pipe: "tile", at: { c: -1, r: 0 } }, durationMs: null, turns: null, effects: [] };
  assert.notEqual(check.run(view(badMove)), null);
});


test("defaults (no opts override): 2 actions; neutrals are not foes; a killing shot is not followed by a shot at the body", () => {
  const setup: BattleSetup = { ...SETUP, stats: { ...SETUP.stats, wolf: { hp: 2, atk: 1 } } };
  const b = botAbilityPriority({ setup });
  const w = createWorld({ ...input("stage-fixed"), rules: setup });
  w.units.moveTo("archer#2", { c: 2, r: 3 }, "move");
  w.units.moveTo("knight#1", { c: 2, r: 1 }, "move");
  const acts = b(w, "player");
  assert.equal(acts.length, 2);
  assert.deepEqual(acts[0]?.effects, ["line-shot"]);
  const targetOf = (a: Action | undefined): string => a?.target && a.target.pipe === "unit" ? a.target.unitId : a?.target && a.target.pipe === "tile" ? "tile" : "";
  assert.equal(targetOf(acts[0]), "wolf#3");
  assert.notEqual(targetOf(acts[1]), "wolf#3"); // hp 2, damage 2 — the body is gone for action 2
  assert.notEqual(targetOf(acts[1]), "crate#5");
  const w2 = createWorld({ ...input("stage-fixed"), rules: setup });
  assert.equal(b(w2, "wolves").every((a) => targetOf(a) !== "crate#5"), true);
});

test("bot-vs-bot 200 seeds all end; a second run of the same seed has an equal snapshot hash", () => {
  const play = (seed: number): { outcome: string; hash: string } => {
    const w = createWorld({ ...input("stage-fixed", seed), rules: SETUP });
    const result = runMatch(w, { sides: [...sides], ai: bot(), victory: wipeRule(win, [...sides]), fuse: "off", maxRounds: 80, maxSimMs: 100000 });
    return { outcome: result.outcome, hash: sha(snapshot(w)) };
  };
  for (let seed = 1; seed <= 200; seed += 1) {
    const a = play(seed), b = play(seed);
    assert.notEqual(a.outcome, "timeout", `seed ${seed} timed out`);
    assert.deepEqual(a, b, `seed ${seed} replay hash`);
  }
});
