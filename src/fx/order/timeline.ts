import type { Clock, SimTimer } from "../../core/clock/index.ts";
import type { FxCue, FxOrder, FxPlan } from "./types.ts";

export function planFx(order: FxOrder): FxPlan {
  const cues: FxCue[] = [];
  let at = 0;
  for (let index = 0; index < order.steps.length; index += 1) {
    const step = order.steps[index];
    if (step === undefined) continue;
    cues.push({ kind: "step", at, index });
    at += step.ms;
  }
  const last = order.steps[order.steps.length - 1];
  if (last !== undefined) cues.push({ kind: "hit", at: at - last.ms + Math.round(order.connect * last.ms) });
  const sorted = cues.map((cue, i) => ({ cue, i })).sort((a, b) => a.cue.at - b.cue.at || a.i - b.i);
  return { cues: sorted.map((row) => row.cue), endMs: at };
}
export function playFx(clock: Clock, plan: FxPlan, onCue: (cue: FxCue) => void): () => void {
  const pending: SimTimer[] = [];
  for (const cue of plan.cues) {
    if (cue.at === 0) onCue(cue);
    else pending.push(clock.after(cue.at, () => { onCue(cue); }));
  }
  return () => { for (const timer of pending) timer.cancel(); };
}
