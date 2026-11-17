import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import { stepTimes } from "../../src/runtime/render/fx-doc.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { DEMO_SETUP, DEMO_MANIFEST, DEMO_MAP, DEMO_STAGE, DEMO_TALK } from "../../tools/play-stage/load.ts";
import { createPlayFx, HOUSE_ATTACK, HOUSE_DOC, LINE_SHOT_DOC, refOf } from "../../tools/play-stage/fx.ts";
import { createMatch } from "../../tools/play-stage/match.ts";

const SAVED_ID = "setup_01J0P18F17TEST000000000000";
const SAVED = {
  kind: "behaviour-setup", formatVersion: 3, id: SAVED_ID, rev: 4, behaviourId: "effect",
  answers: { steps: { source: "user", value: [{ kind: "stamp", seconds: 0.05 }] } },
};
const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => {
  const id = m.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id; if (id === undefined) throw new Error(unitId); return id;
};
const ability = (effects: readonly string[]): Action => ({ id: "a1", kind: "ability", actor: "archer#2", target: { pipe: "unit", unitId: "wolf#1", fallbackAt: { c: 4, r: 1 } }, durationMs: null, turns: null, effects });

test("refOf is exactly one effect; a constructor id does not throw; empty effects get the house default", () => {
  assert.equal(refOf(ability(["line-shot"])), "line-shot");
  assert.equal(refOf(ability([])), undefined);
  assert.equal(refOf(ability(["a", "b"])), undefined);
  const fx = createPlayFx();
  assert.equal(fx.values("constructor"), null);
  assert.equal(fx.values(HOUSE_ATTACK)?.rev, 1);
  const log = { entries: () => [{ seq: 1, tick: 0, action: ability([]) }] };
  const live = fx.ingest(log, 10, 0);
  assert.ok(live.length === 1 && live[0]?.caster === "archer#2");
  assert.equal(stepTimes(HOUSE_DOC).endMs, 250);
  assert.equal(fx.ingest(log, 10, 251).length, 0);
  const two = createPlayFx();
  assert.equal(two.ingest({ entries: () => [{ seq: 1, tick: 0, action: ability(["a", "b"]) }] }, 10, 0).length, 0);
});

test("F17: an editor-saved effect setup is what the match uses", () => {
  const fx = createPlayFx([SAVED]);
  const got = fx.values(SAVED_ID); assert.ok(got !== null && got.rev === 4);
  assert.deepEqual(got.values, { steps: [{ kind: "stamp", seconds: 0.05 }] });
  const end = stepTimes(got.values).endMs;
  assert.equal(end, stepTimes({ steps: [{ kind: "stamp", seconds: 0.05 }] }).endMs);
  assert.ok(end < stepTimes(HOUSE_DOC).endMs && end < stepTimes(LINE_SHOT_DOC).endMs);
  const log = { entries: () => [{ seq: 1, tick: 0, action: ability([SAVED_ID]) }] };
  assert.equal(fx.ingest(log, 10, 0).length, 1);
  assert.equal(fx.ingest(log, 10, end + 1).length, 0);
  const m = createMatch({ manifest: DEMO_MANIFEST, map: DEMO_MAP, stage: DEMO_STAGE, talk: DEMO_TALK, rules: { ...DEMO_SETUP, abilities: { archer: [{ reach: 3, damage: 2, effectRef: SAVED_ID }] } }, effects: [SAVED] });
  assert.equal(m.fx.values(SAVED_ID)?.rev, 4);
  assert.deepEqual(m.fx.values(SAVED_ID)?.values, got.values);
});

test("a Spell two-tap cues line-shot; the scene is live, then fx:hit, then retired", () => {
  const m = createMatch(undefined, 40), archer = idOf(m, "archer");
  const wolf = m.world.units.all().find((u) => u.unitId === "wolf" && u.alive); assert.ok(wolf !== undefined);
  m.world.units.moveTo(archer, { c: wolf.at.c, r: wolf.at.r + 2 }, "move");
  m.intend({ type: "SelectUnit", unitId: archer });
  assert.equal(m.choose("spell"), null);
  const at = m.aims[0] ?? wolf.at;
  m.intend({ type: "TargetCell", at });
  const shot = m.intend({ type: "TargetCell", at });
  assert.ok("action" in shot && shot.action?.kind === "ability" && shot.action.effects[0] === "line-shot");
  const now = m.world.clock.now(), list = m.scene().effects ?? [];
  assert.ok(list.length >= 1, "effect is live after the cue");
  const link = createSceneLink();
  let hits = 0;
  for (let t = now; t <= now + 800; t += 10) {
    link.scene({ ...m.scene(), effects: m.fx.engine.effects(t) }, { tMs: t, stepMs: m.world.clock.stepMs });
    hits += link.fired.filter((e) => e.type === "fx:hit").length;
  }
  assert.ok(hits >= 1, "fx:hit fired");
  assert.equal(m.fx.engine.effects(now + 800).length, 0, "effect retired");
  assert.ok(stepTimes(LINE_SHOT_DOC).endMs > 50);
});

test("a basic attack with empty effects plays the house default", () => {
  const m = createMatch(undefined, 40), knight = idOf(m, "knight");
  const wolf = m.world.units.all().find((u) => u.unitId === "wolf" && u.alive); assert.ok(wolf !== undefined);
  m.world.units.moveTo(knight, { c: wolf.at.c, r: wolf.at.r + 1 }, "move");
  m.intend({ type: "SelectUnit", unitId: knight });
  assert.equal(m.choose("basic"), null);
  const at = m.aims[0] ?? wolf.at;
  m.intend({ type: "TargetCell", at }); m.intend({ type: "TargetCell", at }); m.sync();
  const list = m.scene().effects ?? [];
  assert.ok(list.length >= 1);
  assert.ok(list.some((e) => e.id.startsWith("cast:")));
});
