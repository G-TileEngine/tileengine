import type { Clip, Sheet } from "./types.ts";
import type { FxNote, FxPiece } from "./fx-player.ts";
import type { LiveFx } from "./fx-live.ts";
export type DocStep = Readonly<Record<string, unknown>>;
export type FxDocValues = Readonly<Record<string, unknown>>;
export type DocHost = { readonly id: string; readonly castMs: number; readonly caster: string; readonly target?: string; readonly at?: { readonly c: number; readonly r: number }; readonly loopMs?: number; readonly sheetOf: (step: DocStep, i: number) => Sheet | null; readonly clipOf?: (step: DocStep, i: number) => Clip | undefined };
export const DOC = { steps: 12, secMin: 0.15, secMax: 3, secDefault: 0.48, msMax: 20000, fadeMax: 5000, minHitLen: 50, connect: 0.92 } as const;
export const stepsOf = (doc: FxDocValues): DocStep[] => Array.isArray(doc["steps"]) ? (doc["steps"] as unknown[]).filter((s): s is DocStep => s !== null && typeof s === "object" && !Array.isArray(s)) : [];
const STEP_KEYS = ["kind", "anchor", "anchor_point", "attach", "detach", "draw_layer", "depth_by_facing", "lit", "light_mode", "light", "light_radius", "light_ramp", "tint_ramp", "tint_snap", "outline", "blend", "angle", "particle_life", "particle_motion", "particle_count", "particle_life_ms", "particle_pull", "jitter", "start_spread", "size_spread"] as const;
const KNOBS = ["hit_stop_ms", "shake", "shake_ms", "shake_dir", "squash", "tint_ramp", "pixel_scale", "hit_white_ms", "hit_white_target", "hit_white_mode", "impact_colour", "variant_seed", "start_on", "commitMs", "lungePeakMs"] as const;
const MODES = new Set(["after-last", "with-last", "at-time", "at-hit"]);
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const clampMs = (n: number): number => Math.max(0, Math.min(DOC.msMax, n));
export type Timing = { readonly starts: readonly number[]; readonly lens: readonly number[]; readonly ends: readonly number[]; readonly hitIndex: number; readonly hitMs: number; readonly endMs: number; readonly notes: readonly FxNote[] };
export function stepTimes(doc: FxDocValues): Timing {
  const all = stepsOf(doc), notes: FxNote[] = [], n = Math.min(all.length, DOC.steps);
  if (all.length > DOC.steps) notes.push({ code: "overCap", message: "Steps 13+ are saved but won't play" });
  const lens: number[] = [], fades: number[] = [], holds: number[] = [], mode: string[] = [], at: number[] = [];
  for (let i = 0; i < n; i += 1) {
    const s = all[i] ?? {}, raw = s["seconds"], known = num(raw);
    let sec = known ?? DOC.secDefault;
    if (raw !== undefined && (known === null || known < DOC.secMin || known > DOC.secMax)) { notes.push({ code: "outOfRange", message: `steps[${i}].seconds` }); sec = known === null ? DOC.secDefault : Math.min(DOC.secMax, Math.max(DOC.secMin, known)); }
    lens.push(Math.round(sec * 1000)); const kind = s["kind"];
    fades.push(kind === "stamp" || kind === "dim" ? Math.min(DOC.fadeMax, Math.max(0, Math.round(num(s["fade_out_ms"]) ?? 0))) : 0); holds.push(clampMs(num(s["hold_ms"]) ?? 0));
    const m = s["start_mode"];
    if (m !== undefined && (typeof m !== "string" || !MODES.has(m))) { notes.push({ code: "outOfRange", message: `steps[${i}].start_mode` }); mode.push("after-last"); } else mode.push(typeof m === "string" ? m : "after-last");
    at.push(num(s["start_at_ms"]) ?? 0);
  }
  const named = doc["connect_step"]; let hitIndex = Math.max(0, n - 1);
  if (typeof named === "string" && named !== "") { const idx = all.slice(0, n).findIndex((s) => s["id"] === named); if (idx < 0) notes.push({ code: "unknownRef", message: `connect_step ${named}` }); else hitIndex = idx; }
  const cRaw = num(doc["connect"]); let connect: number = DOC.connect;
  if (doc["connect"] !== undefined && (cRaw === null || cRaw < 0.02 || cRaw > 1)) { notes.push({ code: "outOfRange", message: "connect" }); connect = cRaw === null ? DOC.connect : Math.min(1, Math.max(0.02, cRaw)); } else if (cRaw !== null) connect = cRaw;
  const resolved = mode.map((m, i) => (m === "at-hit" && i <= hitIndex ? (notes.push({ code: "atHitBeforeHit", message: `steps[${i}]` }), "after-last") : m)), starts: number[] = [];
  let hitMs = 0;
  for (let i = 0; i < n; i += 1) {
    const m = resolved[i] ?? "after-last", prev = starts[i - 1] ?? 0;
    const st = i === 0 && m !== "at-time" ? 0 : m === "at-hit" ? clampMs(hitMs + (at[i] ?? 0)) : m === "with-last" ? prev : m === "at-time" ? clampMs(at[i] ?? 0) : prev + (lens[i - 1] ?? 0) + (holds[i - 1] ?? 0);
    starts.push(st); if (i === hitIndex) hitMs = Math.ceil(st + Math.max(DOC.minHitLen, lens[i] ?? 0) * connect);
  }
  const ends = starts.map((st, i) => st + (lens[i] ?? 0) + (fades[i] ?? 0) + (holds[i] ?? 0));
  return { starts, lens, ends, hitIndex, hitMs, endMs: ends.reduce((m, e) => (e > m ? e : m), 0), notes };
}
export function docToLiveFx(doc: FxDocValues, host: DocHost): { fx: LiveFx; notes: FxNote[] } {
  const timing = stepTimes(doc), steps = stepsOf(doc).slice(0, DOC.steps), notes = [...timing.notes], pieces: FxPiece[] = [];
  for (let i = 0; i < steps.length; i += 1) {
    const s = steps[i] ?? {}; if (s["enabled"] === false) continue;
    const sheet = host.sheetOf(s, i); if (sheet === null) { notes.push({ code: "noPicture", message: `steps[${i}]` }); continue; }
    const clip = host.clipOf?.(s, i);
    const piece: Record<string, unknown> = { at: timing.starts[i] ?? 0, ms: (timing.ends[i] ?? 0) - (timing.starts[i] ?? 0), sheet, ...(clip === undefined ? {} : { clip }) };
    for (const k of STEP_KEYS) if (s[k] !== undefined) piece[k] = s[k];
    pieces.push(piece as FxPiece);
  }
  const knobs: Record<string, unknown> = {}; for (const k of KNOBS) if (doc[k] !== undefined) knobs[k] = doc[k];
  const fx = { id: host.id, castMs: host.castMs, caster: host.caster, pieces, hitOffsetMs: timing.hitMs, ...(host.target === undefined ? {} : { target: host.target }), ...(host.at === undefined ? {} : { at: host.at }), ...(host.loopMs === undefined ? {} : { loopMs: host.loopMs }), ...knobs } as LiveFx;
  return { fx, notes };
}
