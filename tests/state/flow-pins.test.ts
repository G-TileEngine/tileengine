import assert from "node:assert/strict";
import { test } from "node:test";
import { xGo } from "../../src/state/xgo.ts";
import { ALL_PHASES, type Event, type EventType, type Phase } from "../../src/state/types.ts";
import { sample } from "./helpers.ts";

const fold = (start: Phase, types: readonly EventType[]): Phase => types.reduce<Phase>((p, t) => xGo(p, sample(t)), start);

test("G4 R3 CLOSE from pause, from settings or saveLoad opened via pause, and from either opened directly lands in overlay.none (no back-stack)", () => {
  assert.deepEqual([
    fold("overlay.none", ["OPEN_PAUSE", "CLOSE"]), fold("overlay.none", ["OPEN_PAUSE", "OPEN_SETTINGS", "CLOSE"]), fold("overlay.none", ["OPEN_PAUSE", "OPEN_SAVELOAD", "CLOSE"]),
    fold("overlay.none", ["OPEN_SETTINGS", "CLOSE"]), fold("overlay.none", ["OPEN_SAVELOAD", "CLOSE"]), fold("overlay.none", ["CLOSE"]),
  ], ["overlay.none", "overlay.none", "overlay.none", "overlay.none", "overlay.none", "overlay.none"]);
  assert.deepEqual([fold("overlay.none", ["OPEN_PAUSE", "OPEN_SETTINGS"]), fold("overlay.none", ["OPEN_PAUSE", "OPEN_SAVELOAD"]), fold("overlay.settings", ["OPEN_SAVELOAD"]), fold("overlay.saveLoad", ["OPEN_SETTINGS"]), fold("overlay.settings", ["OPEN_PAUSE"]), fold("overlay.saveLoad", ["OPEN_PAUSE"])],
    ["overlay.settings", "overlay.saveLoad", "overlay.settings", "overlay.saveLoad", "overlay.settings", "overlay.saveLoad"]);
  for (const p of ALL_PHASES.filter((x) => !x.startsWith("overlay."))) assert.equal(xGo(p, sample("CLOSE")), p, p);
});

test("G4 R4 the tables: FUSE_EXPIRE is taken only in idle, unitSelected, actMenu and targeting (moving and resolving ignore it, so the turn holds it); MOVE_DONE and RESOLVE_DONE leave only moving and resolving", () => {
  const takes = (t: EventType): string[] => ALL_PHASES.filter((p) => xGo(p, sample(t) as Event) !== p);
  assert.deepEqual(takes("FUSE_EXPIRE"), ["targeting", "idle", "unitSelected", "actMenu"]);
  assert.deepEqual([xGo("idle", sample("FUSE_EXPIRE")), xGo("actMenu", sample("FUSE_EXPIRE")), xGo("moving", sample("FUSE_EXPIRE")), xGo("resolving", sample("FUSE_EXPIRE"))], ["sideEnd", "sideEnd", "moving", "resolving"]);
  assert.deepEqual([takes("MOVE_DONE"), takes("RESOLVE_DONE"), xGo("moving", sample("MOVE_DONE")), xGo("resolving", sample("RESOLVE_DONE"))], [["moving"], ["resolving"], "actMenu", "victoryCheck"]);
  assert.deepEqual([takes("UNDO_MOVE"), xGo("actMenu", sample("UNDO_MOVE")), takes("END_TURN")], [["actMenu"], "unitSelected", ["idle", "unitSelected"]]);
});
