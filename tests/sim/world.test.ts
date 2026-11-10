import { test } from "node:test";
import assert from "node:assert/strict";
import { createRng, streamSeed } from "../../src/core/rng/index.ts";
import { readMap, readStage, resolvePlacements } from "../../src/project/read/index.ts";
import { createWorld } from "../../src/sim/index.ts";
import { input } from "./input.ts";

test("a world loads the step-08 fixtures and places every unit at tick 0", () => {
  const w = createWorld(input("stage-fixed"));
  assert.equal(w.seed === 0x5eed && w.log.header.seed === 0x5eed && w.clock.tick() === 0 && w.notices.length === 0, true);
  assert.deepEqual(w.units.all().map((u) => [u.id, u.side, u.at.c, u.at.r]), [
    ["knight#1", "player", 0, 8], ["archer#2", "player", 1, 8], ["wolf#3", "wolves", 2, 0],
    ["wolf#4", "wolves", 3, 0], ["crate#5", "neutral", 3, 4], ["merchant#6", "player", 4, 4],
  ]);
  assert.deepEqual(w.bus.history().map((h) => [h.tick, h.event.type]), Array.from({ length: 6 }, () => [0, "landedOn"]));
});
test("the host seed is used when the stage has none; picks use the pool stream", () => {
  const src = input("stage-weighted");
  const w = createWorld(src);
  const stage = readStage(src.stage);
  const map = readMap(src.map);
  if (!stage.ok || !map.ok) throw new Error("stage");
  const pool = createRng(streamSeed(7, "pool"));
  const placed = resolvePlacements(stage.doc, map.doc, src.chosen, (weights) => pool.weighted(weights));
  assert.equal(w.seed, 7);
  assert.deepEqual(w.units.all().map((u) => u.unitId), placed.placements.map((p) => p.unitId));
  assert.deepEqual(w.notices.map((n) => n.code), ["footprintIgnored", ...placed.notices.map((n) => n.code)]);
});
test("a bad document is a hard error", () => {
  const src = input("stage-fixed");
  const stage = JSON.parse(JSON.stringify(src.stage)) as Record<string, unknown>;
  const map = JSON.parse(JSON.stringify(src.map)) as Record<string, unknown>;
  stage.mapRef = 3;
  map.formatVersion = 4;
  assert.throws(() => createWorld({ ...src, stage }), /stage: bad field mapRef/);
  assert.throws(() => createWorld({ ...src, map }), /map: needs migration from 4/);
  assert.throws(() => createWorld({ ...src, map: input("stage-weighted").map }), /mapRef map-6x9/);
});
