import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { createWorld, runMatch } from "../src/sim/index.ts";
import { bot, reachFarRow, seedless } from "../tests/sim/ai.ts";
import { input } from "../tests/sim/input.ts";
import { seatAll } from "../tests/sim/seats.ts";

/** BTF preset turn timer. User-adjustable; not a sim default. */
const btfPresetTurnFuseMs = 60000;
/** Test value for the bot's move time, named like btfPresetTurnFuseMs. Not a sim default. */
const botMoveMs = 200;

export function report(n: number, fuse: number): string[] {
  if (!Number.isInteger(n) || n < 1) throw new RangeError("report: n must be an integer >= 1");
  const stages = [["stage-fixed", ["player", "wolves"]], ["stage-weighted", ["player", "rival"]]] as const;
  const lines: string[] = [];
  for (const [stage, sides] of stages) {
    const count = { win: 0, lose: 0, draw: 0, timeout: 0 };
    const histories = [];
    for (let seed = 1; seed <= n; seed += 1) {
      const world = createWorld(seedless(input(stage, seed)));
      const result = runMatch(world, { sides: [...sides], victory: reachFarRow, fuse, maxRounds: 40, maxSimMs: 600000, seats: seatAll(world, sides, bot(seed), botMoveMs) });
      count[result.outcome] += 1;
      histories.push(world.bus.history());
    }
    const history = createHash("sha256").update(JSON.stringify(histories)).digest("hex");
    lines.push(`${stage} seeds 1-${n}: win ${count.win} lose ${count.lose} draw ${count.draw} timeout ${count.timeout} history ${history}`);
  }
  return lines;
}

const invoked = process.argv[1];
if (invoked !== undefined && import.meta.url === pathToFileURL(invoked).href) {
  for (const line of report(Number(process.argv[2] ?? "50"), btfPresetTurnFuseMs)) console.log(line);
}
