import type { Notice } from "../../core/notice.ts";
import type { FxCopy, FxCopySample, FxEase, FxLook, FxLookPlan, FxLookSample, FxLookTune, FxOrder, FxRamp, FxSpread, FxStepLook, FxStyle } from "./types.ts";
import { FX_FORMAT } from "./read.ts";

const note = (code: string, message: string): Notice => ({ code, message });
const clamp = (value: number, lo: number, hi: number): number => (value < lo ? lo : value > hi ? hi : value);
const between = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);

function tuneOk(tune: FxLookTune): boolean {
  const fields = [
    tune.jitterMax, tune.delayMax, tune.spreadScaleMax, tune.lookScaleMin, tune.lookScaleMax, tune.lookGlowMax,
    tune.copyScaleMin, tune.copyScaleMax, tune.fillCount, tune.unitA, tune.unitB, tune.unitC, tune.scaleLane, tune.inOut,
  ];
  if (!fields.every((field) => typeof field === "number" && Number.isFinite(field))) return false;
  const spans = tune.jitterMax >= 0 && tune.spreadScaleMax >= 0 && tune.lookGlowMax >= 0 && tune.delayMax >= 0 && tune.delayMax <= 1;
  const ordered = tune.lookScaleMin <= tune.lookScaleMax && tune.copyScaleMin <= tune.copyScaleMax;
  return spans && ordered && Number.isInteger(tune.fillCount) && tune.fillCount >= 2 && tune.fillCount <= FX_FORMAT.maxTaps;
}
function unit(index: number, lane: number, tune: FxLookTune): number {
  const frac = (Math.sin(index * tune.unitA + lane * tune.unitB) * tune.unitC) % 1;
  return frac < 0 ? frac + 1 : frac;
}
export function easeAt(u: number, ease: FxEase, tune: FxLookTune): number {
  const t = between(u);
  if (ease === "out") return 1 - (1 - t) * (1 - t);
  if (ease === "in-out") return t * t * (tune.inOut - 2 * t);
  return t;
}
const mix = (ramp: FxRamp | null, k: number): number | null => (ramp === null ? null : ramp.from + (ramp.to - ramp.from) * k);
export function lookAt(look: FxLook, u: number, tune: FxLookTune): FxLookSample {
  const k = easeAt(u, look.ease, tune);
  return { k, tint: look.tint, scale: mix(look.scale, k), glow: mix(look.glow, k), fade: mix(look.fade, k) };
}
type SpreadUse = { readonly jitter: number; readonly delay: number; readonly size: number; readonly changed: boolean };
function spreadUse(spread: FxSpread, tune: FxLookTune): SpreadUse {
  const jitter = clamp(spread.jitter, 0, tune.jitterMax);
  const delay = clamp(spread.delay, 0, tune.delayMax);
  const size = clamp(spread.scale, 0, tune.spreadScaleMax);
  const changed = jitter !== spread.jitter || delay !== spread.delay || size !== spread.scale;
  return { jitter, delay, size, changed };
}
function placed(use: SpreadUse, index: number, tune: FxLookTune): { dc: number; dr: number; scale: number; lag: number } {
  const lag = use.delay === 0 ? 0 : unit(index, 2, tune) * use.delay;
  const dc = use.jitter === 0 ? 0 : (unit(index, 0, tune) * 2 - 1) * use.jitter;
  const dr = use.jitter === 0 ? 0 : (unit(index, 1, tune) * 2 - 1) * use.jitter;
  const scale = clamp(1 + (unit(index, tune.scaleLane, tune) * 2 - 1) * use.size, tune.copyScaleMin, tune.copyScaleMax);
  return { dc, dr, scale, lag };
}
function localU(delay: number, lag: number, raw: number): number {
  if (delay === 0) return raw;
  const span = 1 - delay;
  if (span === 0) return raw > lag || raw >= 1 ? 1 : 0;
  return between((raw - lag) / span);
}
export function copyAt(spread: FxSpread, index: number, raw: number, tune: FxLookTune): FxCopySample {
  const use = spreadUse(spread, tune);
  const body = placed(use, index, tune);
  return { u: localU(use.delay, body.lag, raw), hidden: raw < body.lag, scale: body.scale, dc: body.dc, dr: body.dr };
}
function clampRamp(ramp: FxRamp | null, lo: number, hi: number): { readonly ramp: FxRamp | null; readonly changed: boolean } {
  if (ramp === null) return { ramp: null, changed: false };
  const from = clamp(ramp.from, lo, hi);
  const to = clamp(ramp.to, lo, hi);
  return { ramp: { from, to }, changed: from !== ramp.from || to !== ramp.to };
}
function clampLook(look: FxLook, tune: FxLookTune, notices: Notice[]): FxLook {
  const scale = clampRamp(look.scale, tune.lookScaleMin, tune.lookScaleMax);
  const glow = clampRamp(look.glow, 0, tune.lookGlowMax);
  const fade = clampRamp(look.fade, 0, 1);
  if (scale.changed) notices.push(note("fxClamped", "A look scale was clamped."));
  if (glow.changed) notices.push(note("fxClamped", "A look glow was clamped."));
  if (fade.changed) notices.push(note("fxClamped", "A look fade was clamped."));
  return { ease: look.ease, tint: look.tint, scale: scale.ramp, glow: glow.ramp, fade: fade.ramp };
}
function countCopies(style: FxStyle, index: number, carried: number, tune: FxLookTune, notices: Notice[]): { readonly n: number; readonly carried: number; readonly spread: boolean } {
  if (style.volley && style.lock !== "free") {
    let n = tune.fillCount;
    if (style.count !== null && Number.isInteger(style.count)) n = style.count;
    else notices.push(note("fxFilled", "A copy count was filled in."));
    const next = clamp(n, 2, FX_FORMAT.maxTaps);
    if (next !== n) notices.push(note("fxClamped", "A copy count was clamped."));
    return { n: next, carried: next, spread: true };
  }
  if (style.volley) {
    if (index === 0) return { n: 1, carried, spread: true };
    if (style.carry) return { n: carried, carried, spread: true };
    return { n: 1, carried: 1, spread: true };
  }
  if (style.carry) return { n: carried, carried, spread: false };
  return { n: 1, carried: 1, spread: false };
}
export function planLook(order: FxOrder, tune: FxLookTune): FxLookPlan {
  if (!tuneOk(tune)) throw new RangeError("planLook: tune out of range");
  const notices: Notice[] = [];
  const steps: FxStepLook[] = [];
  let carried = 1;
  let at = 0;
  for (let index = 0; index < order.steps.length; index += 1) {
    const step = order.steps[index];
    const style = order.styles[index];
    if (step === undefined || style === undefined) throw new RangeError("planLook: style missing");
    const counted = countCopies(style, index, carried, tune, notices);
    carried = counted.carried;
    const use = spreadUse(style.spread, tune);
    if (use.changed) notices.push(note("fxClamped", "A copy spread was clamped."));
    const look = clampLook(style.look, tune, notices);
    const release = index >= 1 && style.carry ? style.release : "together";
    const copies: FxCopy[] = [];
    for (let copy = 0; copy < counted.n; copy += 1) {
      const body = counted.spread ? placed(use, copy, tune) : { dc: 0, dr: 0, scale: 1, lag: 0 };
      copies.push({ index: copy, dc: body.dc, dr: body.dr, scale: body.scale, lag: body.lag, startMs: at + Math.round(body.lag * step.ms) });
    }
    steps.push({ index, at, ms: step.ms, look, release, copies });
    at += step.ms;
  }
  return { steps, endMs: at, notices };
}
