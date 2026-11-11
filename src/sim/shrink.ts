import { replayChaos, runChaos } from "./chaos.ts";
import type { ChaosMove, ChaosRecord, ChaosShrink, ChaosTools, IntentHook, SimInput } from "./types.ts";

const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);
const half = (n: number): number => Math.ceil(n / (1 + 1));
function serve(kept: readonly ChaosMove[]): IntentHook {
  let i = 0;
  return (_world, side) => {
    const next = kept[i];
    if (next === undefined || next.side !== side) return [];
    const call = next.call, out: { intent: ChaosMove["intent"]; aim: ChaosMove["aim"] }[] = [];
    while (i < kept.length) {
      const row = kept[i];
      if (row === undefined || row.call !== call) break;
      out.push({ intent: row.intent, aim: row.aim });
      i += 1;
    }
    return out;
  };
}
export function shrinkChaos(input: SimInput, record: ChaosRecord, tools: ChaosTools): ChaosShrink {
  if (!same(replayChaos(input, record, tools).failure, record)) throw new Error("chaos: record does not replay");
  let current = record, tries = 0, size = half(current.moves.length);
  while (size >= 1) {
    const moves = current.moves;
    let hit: ChaosRecord | null = null;
    for (let start = 0; start < moves.length; start += size) {
      const kept = moves.filter((_row, at) => at < start || at >= start + size);
      if (kept.length === 0) continue;
      tries += 1;
      const o = current.options;
      const failure = runChaos({ ...input, hostSeed: record.seed }, { ...tools, ruleset: current.ruleset, sides: o.sides, fuse: o.fuse, maxRounds: o.maxRounds, maxSimMs: o.maxSimMs, moveMs: o.moveMs, idPrefix: o.idPrefix, presets: o.presets, intents: serve(kept) }).failure;
      if (failure !== null && failure.invariant === record.invariant && failure.firstDivergentSnapshotKey === record.firstDivergentSnapshotKey) { hit = failure; break; }
    }
    if (hit !== null) { current = hit; size = Math.min(size, half(current.moves.length)); continue; }
    if (size <= 1) break;
    size = half(size);
  }
  if (!same(replayChaos(input, current, tools).failure, current)) throw new Error("chaos: shrunk record does not replay");
  return { record: current, tries };
}
