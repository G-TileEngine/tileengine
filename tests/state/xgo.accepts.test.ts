import assert from "node:assert/strict";
import { test } from "node:test";
import { TABLES, xGo } from "../../src/state/xgo.ts";
import { sample } from "./helpers.ts";

test("every row of every table is accepted", () => {
  let edges = 0;
  const keys = new Set<string>();
  for (const table of TABLES) {
    for (const row of table.rows) {
      const dests = typeof row.to === "string" ? [row.to] : row.to;
      for (const from of row.from) {
        keys.add(`${from}|${row.event}`);
        for (const to of dests) {
          edges += 1;
          assert.equal(xGo(from, sample(row.event, to)), to);
        }
      }
    }
  }
  assert.equal(edges, 38);
  assert.equal(keys.size, 34);
});

test("CHOOSE_ACTION with next resolving skips targeting", () => {
  assert.equal(
    xGo("actMenu", { type: "CHOOSE_ACTION", actionId: "rally", next: "resolving" }),
    "resolving",
  );
  assert.equal(
    xGo("actMenu", { type: "CHOOSE_ACTION", actionId: "rally", next: "targeting" }),
    "targeting",
  );
});
