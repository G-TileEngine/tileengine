import assert from "node:assert/strict";
import { test } from "node:test";
import { TABLES, mergeTables } from "../../src/state/xgo.ts";
import type { Table } from "../../src/state/types.ts";

test("the three tables merge with no duplicate key", () => {
  const keys = mergeTables(TABLES).size;
  const slots = TABLES.reduce((n, table) => n + table.rows.reduce((m, row) => m + row.from.length, 0), 0);
  assert.equal(keys, slots);
});

test("a duplicate (from, event) throws", () => {
  const dup: Table = { id: "dup", rows: [{ from: ["actMenu"], event: "WAIT", to: "idle" }] };
  assert.throws(() => mergeTables([...TABLES, dup]), /duplicate state edge actMenu\|WAIT in table dup/);
});
