import assert from "node:assert/strict";
import { test } from "node:test";
import { fitView } from "../../src/runtime/render/index.ts";
import { spellRef, TILE } from "../../tools/play-stage/board.ts";
import { centreOn, clamp, createCam, follow, pan, tickCam, zoomAt } from "../../tools/play-stage/camera-touch.ts";
import { DEMO_SETUP } from "../../tools/play-stage/load.ts";
import { createMatch } from "../../tools/play-stage/match.ts";

const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => {
  const id = m.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id; if (id === undefined) throw new Error(unitId); return id;
};

test("camera pans, zooms, centres, follows and stays clamped", () => {
  const cam = createCam(4), fit = fitView(390, 500, 4, TILE, TILE);
  pan(cam, 40, 10); assert.ok(cam.x !== 0);
  zoomAt(cam, 8, 1170, 1500, 96, 144, 200, 200); assert.ok(cam.s > 4 && cam.s <= 6);
  centreOn(cam, { c: 2, r: 6 }, fit, 0, TILE, 0); clamp(cam, fit, 6, 9);
  assert.ok(Number.isFinite(cam.x));
  follow(cam, "knight#1"); tickCam(cam, 10, { c: 2, r: 6 }, fit); assert.equal(cam.follow, "knight#1");
});

test("spellRef uses Object.hasOwn, so constructor is not a spell row", () => {
  const bag = Object.assign(Object.create({ constructor: [{ effectRef: "fake" }] }), DEMO_SETUP.abilities ?? {});
  assert.equal(spellRef({ ...DEMO_SETUP, abilities: bag }, "constructor"), undefined);
  assert.equal(spellRef(DEMO_SETUP, "archer"), "line-shot");
});

test("after a walk the action row is at actMenu; Wait returns to idle; Spell two-tap fires line-shot", () => {
  const m = createMatch(undefined, 40), knight = idOf(m, "knight"), archer = idOf(m, "archer");
  m.intend({ type: "SelectUnit", unitId: knight });
  const dest = m.reach[0]; assert.ok(dest !== undefined);
  m.intend({ type: "TargetCell", at: dest }); m.intend({ type: "TargetCell", at: dest });
  m.world.clock.advance(80); m.sync();
  assert.equal(m.world.phases.battle, "actMenu");
  assert.equal(m.view().actions.wait.on, true);
  m.wait();
  assert.equal(m.world.phases.battle, "idle");
  const wolf = m.world.units.all().find((u) => u.unitId === "wolf" && u.alive); assert.ok(wolf !== undefined);
  m.world.units.moveTo(archer, { c: wolf.at.c, r: wolf.at.r + 2 }, "move");
  m.intend({ type: "SelectUnit", unitId: archer });
  assert.equal(m.choose("spell"), null);
  const at = m.aims[0] ?? wolf.at;
  m.intend({ type: "TargetCell", at });
  const shot = m.intend({ type: "TargetCell", at });
  assert.ok("action" in shot && shot.action?.kind === "ability" && shot.action.effects[0] === "line-shot");
});

test("Talk appears only when a villager is in reach and shows the bundled text", () => {
  const m = createMatch(), knight = idOf(m, "knight"), villager = idOf(m, "villager"), at = m.world.units.get(knight)?.at;
  m.intend({ type: "SelectUnit", unitId: knight });
  assert.equal(m.view().actions.talk.show, false);
  m.world.units.moveTo(villager, { c: at?.c ?? 0, r: (at?.r ?? 1) - 1 }, "move");
  m.intend({ type: "SelectUnit", unitId: knight });
  assert.equal(m.view().actions.talk.show, true);
  assert.equal(m.choose("talk"), null);
  const aim = m.aims[0]; assert.ok(aim !== undefined);
  m.intend({ type: "TargetCell", at: aim }); m.intend({ type: "TargetCell", at: aim }); m.sync();
  assert.ok(m.talk !== null && m.talk.text === "Hello, traveler." && m.talk.name === "Villager");
  assert.equal(m.world.phases.battle, "actMenu");
});

test("End turn runs the bot; Restart restores the demo; wiping the wolves is a win", () => {
  const m = createMatch(undefined, 20), start = m.world.units.all().map((u) => `${u.id}:${u.at.c},${u.at.r}`).join();
  assert.equal(m.view().actions.end.show, true);
  assert.equal(m.view().actions.basic.show, false);
  assert.equal(m.view().actions.wait.show, false);
  const knight = idOf(m, "knight");
  m.intend({ type: "SelectUnit", unitId: knight });
  const dest = m.reach[0]; assert.ok(dest !== undefined);
  m.intend({ type: "TargetCell", at: dest }); m.intend({ type: "TargetCell", at: dest });
  m.world.clock.advance(80); m.sync();
  assert.equal(m.world.phases.battle, "actMenu");
  m.endTurn();
  for (let i = 0; i < 8 && m.walk !== null; i += 1) { m.world.clock.advance(40); m.sync(); }
  assert.ok(m.outcome !== null || (m.side === "player" && String(m.world.phases.battle) === "idle"));
  const again = m.restart();
  assert.equal(again.world.phases.battle, "idle");
  assert.equal(again.autoWait, false);
  assert.equal(again.world.units.all().map((u) => `${u.id}:${u.at.c},${u.at.r}`).join(), start);
  again.world.units.all().filter((u) => u.side === "wolves").forEach((u) => again.world.units.remove(u.id));
  again.endTurn();
  assert.equal(again.outcome, "win");
});
