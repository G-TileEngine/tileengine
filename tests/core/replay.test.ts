import { test } from "node:test";
import assert from "node:assert/strict";
import type { CoreMap } from "../../src/types/core-types.ts";
import type { Dir } from "../../src/core/grid/types.ts";
import { createGrid } from "../../src/core/grid/index.ts";
import { createUnits, type Units } from "../../src/core/unit/index.ts";
import { createClock } from "../../src/core/clock/index.ts";
import { createBus, logEvents, unitEvents } from "../../src/core/events/index.ts";
import { ENGINE_VERSION } from "../../src/index.ts";
import { LOG_FORMAT_VERSION, createLog, parseLog, type Action } from "../../src/core/log/index.ts";
import { aimTile } from "../../src/core/targeting/index.ts";

const doc: CoreMap = { kind: "map", formatVersion: 5, id: "r", rev: 1, cols: 5, rows: 5,
  logic: { terrain: Array.from({ length: 25 }, () => 0), palette: { "0": "floor" }, edges: [] } };
const move = (c: number, r: number): Action => ({ id: `${c}${r}`, kind: "move", actor: "u#1", target: aimTile({ c, r }), durationMs: 10, turns: null, effects: [] });
const push = (dir: Dir, n: number): Action => ({ id: `p${dir}`, kind: "push", actor: "u#1", target: null, durationMs: 0, turns: null, effects: [dir, String(n)] });
const live = [move(1, 0), move(2, 0), move(2, 1), move(3, 1), push("e", 1), push("w", 2)];
function apply(units: Units, a: Action): void {
  const dir = a.effects[0];
  if (a.kind === "move" && a.target?.pipe === "tile") units.moveTo(a.actor, a.target.at);
  else if (a.kind === "push" && (dir === "n" || dir === "e" || dir === "s" || dir === "w")) units.push(a.actor, dir, Number(a.effects[1]));
}
function run(actions: readonly Action[]) {
  const bus = createBus(createClock());
  const units = createUnits(createGrid(doc, [{ id: "floor", open: true, push_can_enter: true }]), { hooks: unitEvents(bus) });
  units.place({ unitId: "u", side: "player", at: { c: 0, r: 0 }, facing: null });
  const log = createLog({ seed: 1, formatVersion: LOG_FORMAT_VERSION, engineVersion: ENGINE_VERSION, projectHash: "p" }, logEvents(bus));
  for (const a of actions) { log.append(0, a); apply(units, a); }
  return { history: bus.history(), json: log.toJSON(), at: units.get("u#1")?.at };
}
test("replaying a log reproduces the event history", () => {
  const first = run(live);
  const parsed = parseLog(first.json);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  const again = run(parsed.log.entries().map((e) => e.action));
  assert.deepEqual([live.length, again.at, again.history], [6, { c: 2, r: 1 }, first.history]);
});
