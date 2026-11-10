import { SHARED_TABLE } from "./shared.table.ts";
import { TACTICS_FLOW_TABLE } from "./tactics.flow.table.ts";
import { TACTICS_INPUT_TABLE } from "./tactics.input.table.ts";
import type { Event, Phase, Row, Table } from "./types.ts";

export function mergeTables(tables: readonly Table[]): ReadonlyMap<string, Row> {
  const index = new Map<string, Row>();
  for (const table of tables) {
    for (const row of table.rows) {
      for (const from of row.from) {
        const key = `${from}|${row.event}`;
        if (index.has(key)) {
          throw new Error(`duplicate state edge ${from}|${row.event} in table ${table.id}`);
        }
        index.set(key, row);
      }
    }
  }
  return index;
}

export const TABLES: readonly Table[] = Object.freeze([
  SHARED_TABLE,
  TACTICS_FLOW_TABLE,
  TACTICS_INPUT_TABLE,
]);

const INDEX: ReadonlyMap<string, Row> = mergeTables(TABLES);

export function xGo(from: Phase, event: Event): Phase {
  const row = INDEX.get(`${from}|${event.type}`);
  if (row === undefined) return from;
  if (typeof row.to === "string") return row.to;
  if ("next" in event && row.to.includes(event.next)) return event.next;
  return from;
}
