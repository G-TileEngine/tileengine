import assert from "node:assert/strict";
import { test } from "node:test";
import { xGo } from "../../src/state/xgo.ts";
import type { Event, Phase } from "../../src/state/types.ts";
import { sample } from "./helpers.ts";

type Snap = { readonly phase: Phase };

function fold(start: Phase, events: readonly Event[]): Phase[] {
  const got: Phase[] = [];
  let s: Snap = { phase: start };
  for (const e of events) {
    const next = xGo(s.phase, e);
    s = { ...s, phase: next };
    got.push(s.phase);
  }
  return got;
}

test("scripted battle reaches play.result", () => {
  // Rival side uses the same events (SELECT_UNIT then FUSE_EXPIRE), not a second copy of the player script.
  const steps: readonly [Event, Phase][] = [
    [sample("BATTLE_READY"), "deploy"],
    [sample("DEPLOY_DONE"), "roundStart"],
    [sample("ROUND_BEGIN"), "sideStart"],
    [sample("SIDE_BEGIN"), "idle"],
    [sample("SELECT_UNIT"), "unitSelected"],
    [sample("TAP_MOVE_CELL"), "moving"],
    [sample("MOVE_DONE"), "actMenu"],
    [sample("CHOOSE_ACTION", "targeting"), "targeting"],
    [sample("CONFIRM_TARGET"), "resolving"],
    [sample("RESOLVE_DONE"), "victoryCheck"],
    [sample("CHECK_NONE", "unitDone"), "unitDone"],
    [sample("UNIT_DONE", "idle"), "idle"],
    [sample("SELECT_UNIT"), "unitSelected"],
    [sample("TAP_MOVE_CELL"), "moving"],
    [sample("MOVE_DONE"), "actMenu"],
    [sample("CHOOSE_ACTION", "resolving"), "resolving"],
    [sample("RESOLVE_DONE"), "victoryCheck"],
    [sample("CHECK_NONE", "unitDone"), "unitDone"],
    [sample("UNIT_DONE", "sideEnd"), "sideEnd"],
    [sample("SIDE_END"), "victoryCheck"],
    [sample("CHECK_NONE", "sideStart"), "sideStart"],
    [sample("SIDE_BEGIN"), "idle"],
    [sample("SELECT_UNIT"), "unitSelected"],
    [sample("FUSE_EXPIRE"), "sideEnd"],
    [sample("SIDE_END"), "victoryCheck"],
    [sample("CHECK_NONE", "roundEnd"), "roundEnd"],
    [sample("ROUND_END"), "roundStart"],
    [sample("ROUND_BEGIN"), "sideStart"],
    [sample("SIDE_BEGIN"), "idle"],
    [sample("END_TURN"), "sideEnd"],
    [sample("SIDE_END"), "victoryCheck"],
    [sample("CHECK_END"), "play.result"],
  ];
  const got = fold("play.loading", steps.map(([e]) => e));
  assert.deepEqual(got, steps.map(([, to]) => to));
  assert.equal(got.at(-1), "play.result");
});

test("overlay rows push and pop", () => {
  const got = fold("overlay.none", [
    sample("OPEN_PAUSE"),
    sample("OPEN_SETTINGS"),
    sample("CLOSE"),
  ]);
  assert.deepEqual(got, ["overlay.pause", "overlay.settings", "overlay.none"]);
  assert.deepEqual(fold("overlay.pause", [sample("OPEN_PAUSE")]), ["overlay.pause"]);
});
