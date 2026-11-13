import { cycleFrames, scrollFrames, swayFrames, type Pixels } from "./bakes.ts";
import { SHORE_DEFAULTS, type ShoreColours, type ShoreOpts } from "./water.ts";

export type Ramp = readonly string[] | { readonly name: string; readonly steps: readonly number[] };
export type Motion = { readonly cycle?: { readonly ramp: Ramp; readonly ms?: number }; readonly scroll?: { readonly step: number; readonly axis?: "x" | "y"; readonly ms?: number }; readonly sway?: { readonly trunkFrom: number; readonly edge?: number; readonly ms?: number } };
export type MotionCtx = { readonly ramps?: Readonly<Record<string, readonly string[]>>; readonly animated: boolean };
export type MotionPart = { readonly kind: "cycle" | "scroll" | "sway" | "shore"; readonly n: number; readonly ms: number };
export type MotionBake = { readonly frames: readonly Pixels[]; readonly parts: readonly MotionPart[]; readonly notices: readonly ("motionInvalid" | "motionTooLarge")[]; readonly message?: string };
export const MOTION_CAP = 64, SHORE_MS = SHORE_DEFAULTS.ms, ANIM_HINT = "motionInvalid: this cell already plays a clip, so its motion is ignored; set anim: null to use motion";
export const pickMotion = (asset?: Motion | null, tile?: Motion | null, placement?: Motion | null): Motion | null => placement !== undefined ? placement : tile !== undefined ? tile : asset ?? null;

const hexOf = (s: string): number | null => /^#[0-9a-fA-F]{6}$/.test(s) ? Number.parseInt(s.slice(1), 16) : null;
const uniqueHex = (list: readonly string[]): number[] | null => { if (list.length < 2 || list.length > 8) return null; const out: number[] = []; for (const s of list) { const n = hexOf(s); if (n === null || out.includes(n)) return null; out.push(n); } return out; };
const msOk = (ms: number | undefined, lo: number, hi: number, dflt: number): number | null => ms === undefined ? dflt : Number.isInteger(ms) && ms >= lo && ms <= hi ? ms : null;
const coloursOf = (ramp: Ramp, ramps: MotionCtx["ramps"]): number[] | null => {
  if (ramps !== undefined) {
    if (!("name" in ramp) || !("steps" in ramp)) return null;
    const src = ramps[ramp.name], steps = ramp.steps, picked: string[] = [];
    if (src === undefined || steps.length < 2 || steps.length > 8 || new Set(steps).size !== steps.length) return null;
    for (const s of steps) { if (!Number.isInteger(s) || s < 0 || s >= src.length) return null; picked.push(src[s] ?? ""); }
    return uniqueHex(picked);
  }
  return Array.isArray(ramp) && ramp.every((c) => typeof c === "string") ? uniqueHex(ramp) : null;
};

export function bakeMotion(img: Pixels, m: Motion | null, ctx: MotionCtx): MotionBake {
  if (m === null) return { frames: [img], parts: [], notices: [] };
  if (ctx.animated) return { frames: [img], parts: [], notices: ["motionInvalid"], message: ANIM_HINT };
  const notices: ("motionInvalid" | "motionTooLarge")[] = [], bad = (): void => { if (!notices.includes("motionInvalid")) notices.push("motionInvalid"); };
  let colours: number[] | null = null, cycMs = 0, scrStep = 0, scrAxis: "x" | "y" = "x", scrMs = 0, trunk = 0, edge = 0, swayMs = 0, doC = false, doS = false, doW = false;
  if (m.cycle !== undefined) { const ms = msOk(m.cycle.ms, 50, 1000, 150), cols = coloursOf(m.cycle.ramp, ctx.ramps); if (ms === null || cols === null) bad(); else { doC = true; colours = cols; cycMs = ms; } }
  if (m.scroll !== undefined) {
    const axis = m.scroll.axis ?? "x", ms = msOk(m.scroll.ms, 50, 1000, 200), size = axis === "y" ? img.h : img.w;
    if (ms === null || (axis !== "x" && axis !== "y") || !Number.isInteger(m.scroll.step) || m.scroll.step < 1 || m.scroll.step > size || size % m.scroll.step !== 0) bad(); else { doS = true; scrStep = m.scroll.step; scrAxis = axis; scrMs = ms; }
  }
  if (m.sway !== undefined) { const ms = msOk(m.sway.ms, 100, 1000, 400), e = m.sway.edge ?? 2; if (ms === null || !Number.isInteger(m.sway.trunkFrom) || m.sway.trunkFrom < 0 || !Number.isInteger(e) || e < 1 || e > 4) bad(); else { doW = true; trunk = m.sway.trunkFrom; edge = e; swayMs = ms; } }
  const nC = doC ? colours?.length ?? 1 : 1, nS = doS ? (scrAxis === "y" ? img.h : img.w) / scrStep : 1, nW = doW ? 4 : 1;
  if (!doC && !doS && !doW) return { frames: [img], parts: [], notices };
  if (nC * nS * nW > MOTION_CAP) return { frames: [img], parts: [], notices: notices.includes("motionInvalid") ? ["motionInvalid", "motionTooLarge"] : ["motionTooLarge"] };
  let frames: Pixels[] = [img]; const parts: MotionPart[] = [];
  if (doC && colours !== null) { frames = cycleFrames(img, colours); parts.push({ kind: "cycle", n: frames.length, ms: cycMs }); }
  if (doS) { const next: Pixels[] = []; for (const fr of frames) next.push(...scrollFrames(fr, scrStep, scrAxis)); frames = next; parts.push({ kind: "scroll", n: nS, ms: scrMs }); }
  if (doW) { const next: Pixels[] = []; for (const fr of frames) next.push(...swayFrames(fr, trunk, edge)); frames = next; parts.push({ kind: "sway", n: 4, ms: swayMs }); }
  return { frames, parts, notices };
}

export function motionCell(parts: readonly MotionPart[], tMs: number, reduce = false, offsets?: readonly number[]): number {
  if (reduce) return 0;
  let cell = 0, stride = 1;
  for (let i = parts.length - 1; i >= 0; i -= 1) { const part = parts[i]; if (part === undefined || !(part.ms > 0) || !(part.n > 0)) continue; const pose = ((Math.floor((tMs + (offsets?.[i] ?? 0)) / part.ms) % part.n) + part.n) % part.n; cell += pose * stride; stride *= part.n; }
  return cell;
}

export type ShoreStyle = { readonly liquidEdge?: string; readonly shore?: unknown; readonly ramps?: Readonly<Record<string, readonly string[]>> };
export type ShoreNotice = { readonly code: "shoreInvalid"; readonly field: string; readonly message: string };
export type ShorePlan = { readonly on: { readonly opts: Required<ShoreOpts>; readonly colours: ShoreColours; readonly part: MotionPart } | null; readonly notices: readonly ShoreNotice[] };
const inRange = (v: unknown, lo: number, hi: number): v is number => typeof v === "number" && Number.isInteger(v) && v >= lo && v <= hi;

export function shoreSettings(style: ShoreStyle): ShorePlan {
  if ((style.liquidEdge ?? "foam") !== "foam" || style.shore === false) return { on: null, notices: [] };
  const notices: ShoreNotice[] = [], raw = style.shore, plain = raw !== null && raw !== undefined && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : null;
  if (raw !== null && raw !== undefined && plain === null) notices.push({ code: "shoreInvalid", field: "shore", message: "shoreInvalid: shore" });
  const body = plain ?? {}, take = (field: string, lo: number, hi: number, dflt: number): number => { const v = body[field]; if (v === undefined) return dflt; if (!inRange(v, lo, hi)) { notices.push({ code: "shoreInvalid", field, message: `shoreInvalid: ${field}` }); return dflt; } return v; };
  let waveGap = take("waveGap", 4, 16, SHORE_DEFAULTS.waveGap), frames = take("frames", 2, 8, SHORE_DEFAULTS.frames);
  const foamPx = take("foamPx", 1, 4, SHORE_DEFAULTS.foamPx), shallowPx = take("shallowPx", 2, 12, SHORE_DEFAULTS.shallowPx), ms = take("ms", 50, 1000, SHORE_DEFAULTS.ms);
  if (waveGap % frames !== 0) { if (!notices.some((n) => n.field === "waveGap")) notices.push({ code: "shoreInvalid", field: "waveGap", message: "shoreInvalid: waveGap" }); waveGap = SHORE_DEFAULTS.waveGap; frames = SHORE_DEFAULTS.frames; }
  const ramp = style.ramps?.water, cols: number[] = [];
  if (ramp === undefined || ramp.length === 0 || ramp.some((s) => { const n = hexOf(s); if (n === null) return true; cols.push(n); return false; })) return { on: null, notices: [...notices, { code: "shoreInvalid", field: "ramps.water", message: "no water ramp: the shore is off" }] };
  const light = cols[cols.length - 1] ?? 0, wave = cols.length >= 3 ? cols[cols.length - 2] ?? light : light, shallow = cols.length >= 3 ? cols[cols.length - 3] ?? light : light;
  return { on: { opts: { foamPx, shallowPx, waveGap, frames, ms }, colours: { foam: light, shallow, wave }, part: { kind: "shore", n: frames, ms } }, notices };
}
