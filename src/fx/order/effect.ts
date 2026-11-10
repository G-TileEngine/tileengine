import type { Notice } from "../../core/notice.ts";
import type { FxBody, FxCue, FxEffectPlan, FxFlight, FxOptions, FxOrder, FxShot } from "./types.ts";
import { FX_FORMAT } from "./read.ts";
import { planFx } from "./timeline.ts";

const gap = (shot: FxShot, body: FxBody): number => Math.max(Math.abs(body.at.c - shot.from.c), Math.abs(body.at.r - shot.from.r));
const badLen = (len: number | null): boolean => typeof len !== "number" || !Number.isInteger(len) || len < 1;
function outOfRange(shot: FxShot, options: FxOptions, flight: FxFlight): boolean {
  for (const delay of shot.layerDelay) {
    if (delay !== null && delay !== undefined && (typeof delay !== "number" || !Number.isFinite(delay) || delay < 0 || delay > 1)) return true;
  }
  if ((shot.path === "yank") !== (shot.land !== null)) return true;
  if (shot.path !== "pierce") return shot.flightTiles !== null;
  const tiles = shot.flightTiles;
  if (badLen(typeof tiles === "number" ? tiles : null)) return true;
  for (const body of shot.bodies) { const away = gap(shot, body); if (typeof tiles !== "number" || !Number.isInteger(away) || away < 1 || away > tiles) return true; }
  if (options.pierce_hit_timing !== "per_tile_on_pass") return false;
  return badLen(options.pierce_flight === "fixed_total" ? flight.totalMs : flight.msPerTile);
}
export function planEffect(order: FxOrder, shot: FxShot, options: FxOptions, flight: FxFlight): FxEffectPlan {
  if (outOfRange(shot, options, flight)) throw new RangeError("planEffect: shot out of range");
  const base = planFx(order);
  const cues: FxCue[] = [{ kind: "spawn", at: 0, spawn: shot.spawn, trail: shot.trail }, ...base.cues];
  let start = 0;
  for (let index = 0; index < order.steps.length; index += 1) {
    const step = order.steps[index];
    const delay = shot.layerDelay[index];
    if (step === undefined) continue;
    if (typeof delay === "number") cues.push({ kind: "layer", at: start + Math.round(delay * step.ms), index });
    start += step.ms;
  }
  let hitAt = 0;
  for (const cue of base.cues) if (cue.kind === "hit") hitAt = cue.at;
  const notices: Notice[] = [];
  let list: FxBody[] = shot.bodies.slice();
  if (shot.path === "single" || shot.path === "yank") list = list.slice(0, 1);
  else if (shot.path === "bounce" && list.length > FX_FORMAT.maxTaps) {
    list = list.slice(0, FX_FORMAT.maxTaps);
    notices.push({ code: "fxOverCap", message: "Taps past the cap are dropped and not played." });
  } else if (shot.path !== "bounce") {
    list = list.map((body, i) => ({ body, i })).sort((a, b) => gap(shot, a.body) - gap(shot, b.body) || a.i - b.i).map((row) => row.body);
  }
  const kept: FxBody[] = [];
  const seen = new Set<string>();
  for (const body of list) if (!seen.has(body.id)) { seen.add(body.id); kept.push(body); }
  const reel = shot.path === "chain" || shot.path === "yank";
  const react = reel && shot.react === "knock1" ? "none" : shot.react;
  const targets: (FxBody | null)[] = shot.path === "single" && kept.length < 1 ? [null] : kept;
  let prev = shot.from;
  let first = true;
  for (const body of targets) {
    const n = shot.flightTiles;
    const away = body === null ? 0 : gap(shot, body);
    const len = options.pierce_flight === "per_tile" ? flight.msPerTile : flight.totalMs;
    const pierce = body !== null && shot.path === "pierce" && options.pierce_hit_timing !== "all_at_connect" && typeof n === "number" && typeof len === "number";
    const at = pierce && typeof n === "number" && typeof len === "number"
      ? options.pierce_flight === "per_tile" ? hitAt + away * len : hitAt + Math.round(len * away / n) : hitAt;
    const id = body === null ? null : body.id;
    cues.push({ kind: "strike", at, body: id, react });
    if (shot.impact && (options.impact_burst === "per_body" || first)) cues.push({ kind: "impact", at, body: id });
    first = false;
    if (body === null || !reel) continue;
    const toward = shot.path === "yank" ? shot.land : prev;
    if (toward !== null) cues.push({ kind: "pull", at, body: body.id, toward, all: shot.path === "yank" });
    if (shot.path === "chain") prev = body.at;
    if (shot.react === "knock1" && options.reel_knock === "pull_then_knock1") cues.push({ kind: "knock", at, body: body.id });
  }
  const sorted = cues.map((cue, i) => ({ cue, i })).sort((a, b) => a.cue.at - b.cue.at || a.i - b.i).map((row) => row.cue);
  let endMs = base.endMs;
  for (const cue of sorted) if (cue.at > endMs) endMs = cue.at;
  return { cues: sorted, endMs, notices };
}
