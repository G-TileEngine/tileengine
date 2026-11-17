import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { build } from "../../tools/play-stage/build.ts";
import { createPlay, recipeOf, TILE } from "../../tools/play-stage/board.ts";
import { DEMO_LOAD, DEMO_MANIFEST, DEMO_MAP, DEMO_STAGE, DEMO_SETUP, docsToInput } from "../../tools/play-stage/load.ts";

const idOf = (unitId: string, play: ReturnType<typeof createPlay>): string => {
  const id = play.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id;
  if (id === undefined) throw new Error(unitId);
  return id;
};
const atOf = (play: ReturnType<typeof createPlay>, id: string): { c: number; r: number } => {
  const u = play.world.units.get(id); if (u === undefined) throw new Error(id); return { c: u.at.c, r: u.at.r };
};

test("boot seats a rules world on the bundled demo and ends in idle; docsToInput is the r73 hook", () => {
  const play = createPlay(), load = docsToInput({ manifest: DEMO_MANIFEST, map: DEMO_MAP, stage: DEMO_STAGE, rules: DEMO_SETUP, talk: DEMO_LOAD.talk, hostSeed: 11 });
  assert.equal(play.world.phases.battle, "idle");
  assert.ok(play.world.rules !== null && play.world.units.all().some((u) => u.unitId === "knight") && play.world.units.all().some((u) => u.unitId === "wolf"));
  assert.equal(play.step.reach, 1);
  assert.equal(load.input.hostSeed, 11);
  assert.equal(load.talk["talk-villager"], "Hello, traveler.");
  assert.equal(createPlay({ manifest: DEMO_MANIFEST, map: DEMO_MAP, stage: DEMO_STAGE, rules: DEMO_SETUP, hostSeed: 11 }).world.phases.battle, "idle");
});

test("selecting a knight highlights its orthogonal walk tiles; a constructor unit id does not throw", () => {
  const play = createPlay(), id = idOf("knight", play), unit = play.world.units.get(id);
  assert.ok(unit !== undefined);
  const step = play.intend({ type: "SelectUnit", unitId: id });
  assert.ok("reject" in step && step.reject === null && play.selected === id);
  assert.ok(play.reach.length >= 1 && play.reach.every((c) => Math.abs(c.c - unit.at.c) + Math.abs(c.r - unit.at.r) === 1));
  const scene = play.scene();
  assert.equal(scene.overlays.length, play.reach.length);
  assert.ok(scene.overlays.every((o) => o.band === "fxGround" && o.sheet.id === "play:reach-player"));
  assert.equal(recipeOf("constructor").id, "starter:unknown-constructor");
  const px = play.pixels("starter:hero-sword");
  assert.ok(px !== undefined && px.w === TILE && px.data.length === TILE * TILE * 4);
  const play2 = createPlay(), id2 = idOf("knight", play2), tap = atOf(play2, id2);
  play2.pointer({ kind: "down", id: 1, pointer: "touch", x: tap.c * TILE + 8, y: tap.r * TILE + 8, ms: 100 }); play2.pointer({ kind: "up", id: 1, pointer: "touch", x: tap.c * TILE + 8, y: tap.r * TILE + 8, ms: 120 }); assert.equal(play2.selected, id2);
});

test("first tap on a reachable tile shows the path and does not walk; the second tap walks, then MOVE_DONE returns to idle", () => {
  const play = createPlay(undefined, 50), id = idOf("knight", play), start = atOf(play, id);
  play.intend({ type: "SelectUnit", unitId: id });
  const dest = play.reach[0];
  assert.ok(dest !== undefined);
  const preview = play.intend({ type: "TargetCell", at: dest });
  assert.ok("preview" in preview && preview.preview.length >= 1 && play.pending?.c === dest.c);
  assert.deepEqual(atOf(play, id), start);
  const walked = play.intend({ type: "TargetCell", at: dest });
  assert.ok("action" in walked && walked.action?.kind === "move" && walked.path !== undefined);
  assert.equal(play.world.phases.battle, "moving");
  play.sync();
  assert.ok(play.world.units.get(id)?.offset !== null && play.walk !== null);
  play.world.clock.advance(walked.action?.durationMs ?? 50);
  play.sync();
  assert.equal(play.walk, null);
  assert.deepEqual(atOf(play, id), dest);
  assert.equal(play.world.units.get(id)?.offset, null);
  assert.equal(play.world.phases.battle, "idle");
});


test("static build writes index.html, the import tree as .js, and a build.json this builder wrote", () => {
  const out = mkdtempSync(join(tmpdir(), "play-stage-"));
  try {
    const sha = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", body = build(out, sha);
    const json = JSON.parse(readFileSync(join(out, "build.json"), "utf8")) as { commit: string; entry: string; files: Record<string, string> };
    assert.equal(json.commit, sha);
    assert.equal(json.entry, "index.html");
    assert.ok(Object.hasOwn(json.files, "index.html") && Object.hasOwn(json.files, "tools/play-stage/page.js") && Object.hasOwn(json.files, "tools/play-stage/board.js"));
    assert.match(readFileSync(join(out, "index.html"), "utf8"), /tools\/play-stage\/page\.js/);
    assert.equal(JSON.parse(body).commit, sha);
  } finally { rmSync(out, { recursive: true, force: true }); }
});
