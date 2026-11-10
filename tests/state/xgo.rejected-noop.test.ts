import assert from "node:assert/strict";
import { test } from "node:test";
import { ALL_EVENT_TYPES, ALL_PHASES, type Event } from "../../src/state/types.ts";
import { TABLES, xGo } from "../../src/state/xgo.ts";
import { sample } from "./helpers.ts";

const keyed = new Set<string>();
for (const table of TABLES) {
  for (const row of table.rows) {
    for (const from of row.from) keyed.add(`${from}|${row.event}`);
  }
}

function illegal(event: Event, next: string): Event {
  const wide: unknown = { ...event, next };
  return wide as Event;
}

test("no row → xGo returns from", () => {
  let pairs = 0;
  for (const from of ALL_PHASES) {
    for (const type of ALL_EVENT_TYPES) {
      if (keyed.has(`${from}|${type}`)) continue;
      pairs += 1;
      const event = sample(type);
      assert.doesNotThrow(() => xGo(from, event));
      assert.equal(xGo(from, event), from);
    }
  }
  assert.ok(pairs > 300, `expected > 300 missing pairs, got ${pairs}`);
});

test("illegal next on a pick-list row → from", () => {
  assert.equal(xGo("unitDone", illegal(sample("UNIT_DONE"), "roundEnd")), "unitDone");
  assert.equal(xGo("victoryCheck", illegal(sample("CHECK_NONE"), "idle")), "victoryCheck");
  assert.equal(xGo("actMenu", illegal(sample("CHOOSE_ACTION"), "moving")), "actMenu");
});
