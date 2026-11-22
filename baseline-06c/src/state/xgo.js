import { SHARED_TABLE } from "./shared.table.js";
import { TACTICS_FLOW_TABLE } from "./tactics.flow.table.js";
import { TACTICS_INPUT_TABLE } from "./tactics.input.table.js";
                                                           

export function mergeTables(tables                  )                           {
  const index = new Map             ();
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

export const TABLES                   = Object.freeze([
  SHARED_TABLE,
  TACTICS_FLOW_TABLE,
  TACTICS_INPUT_TABLE,
]);

const INDEX                           = mergeTables(TABLES);

export function xGo(from       , event       )        {
  const row = INDEX.get(`${from}|${event.type}`);
  if (row === undefined) return from;
  if (typeof row.to === "string") return row.to;
  if ("next" in event && row.to.includes(event.next)) return event.next;
  return from;
}
