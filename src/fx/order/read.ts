import type { Notice } from "../../core/notice.ts";
import type { FxRead, FxReadLimits, FxStep } from "./types.ts";

/** Format limits and fill-ins the docs state, each cited. The only numbers in src/fx; the rest come in FxReadLimits. */
export const FX_FORMAT = {
  maxMs: 3000,                       // seconds up to 3.00 (SKILLRIG.md:86)
  maxSteps: 6,                       // six steps at most (SKILLRIG.md:36); 7+ kept inactive (project-format §6.7 K-4)
  connect: 0.92, reelConnect: 0.42,  // missing connect: 0.92, an old reel 0.42 (SKILLRIG.md:178, :165)
  msPerSecond: 1000,
  maxTaps: 8,                        // a bounce hits at most eight tapped squares (SKILLRIG.md:94)
} as const;

const note = (code: string, message: string): Notice => ({ code, message });
const plain = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
function limitsOk(limits: FxReadLimits): boolean {
  const step = Number.isInteger(limits.minStepMs) && limits.minStepMs >= 1 && limits.minStepMs <= FX_FORMAT.maxMs;
  const fill = Number.isInteger(limits.fillStepMs) && limits.fillStepMs >= limits.minStepMs && limits.fillStepMs <= FX_FORMAT.maxMs;
  const span = limits.minConnect >= 0 && limits.maxConnect <= 1 && limits.minConnect <= limits.maxConnect;
  return step && fill && span;
}
export function readFxOrder(text: string, limits: FxReadLimits): FxRead {
  if (!limitsOk(limits)) throw new RangeError("readFxOrder: limits out of range");
  const open = text.indexOf("{"), close = text.lastIndexOf("}");
  const bad = (): FxRead => ({ order: null, notices: [note("fxBadBlock", "Effect order block is not usable.")] });
  if (open < 0 || close < open) return bad();
  let parsed: unknown;
  try { parsed = JSON.parse(text.slice(open, close + 1)); } catch { return bad(); }
  if (!plain(parsed) || !Array.isArray(parsed.frames) || parsed.frames.length < 1) return bad();
  const notices: Notice[] = [];
  const all: FxStep[] = parsed.frames.map((frame) => {
    const row = plain(frame) ? frame : {};
    const kind = typeof row.kind === "string" ? row.kind : null;
    const seconds = row.seconds;
    if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
      notices.push(note("fxFilled", "A step with no length was filled in."));
      return { kind, ms: limits.fillStepMs };
    }
    const rawMs = Math.round(seconds * FX_FORMAT.msPerSecond);
    const ms = Math.min(FX_FORMAT.maxMs, Math.max(limits.minStepMs, rawMs));
    if (ms !== rawMs) notices.push(note("fxClamped", "A step length was clamped."));
    return { kind, ms };
  });
  const steps = all.slice(0, FX_FORMAT.maxSteps);
  const inactive = all.slice(FX_FORMAT.maxSteps);
  if (inactive.length > 0) notices.push(note("fxOverCap", "Steps past the cap are kept and not played."));
  let reel = false;
  for (const step of steps) reel = step.kind === "reel";
  const givenConnect = parsed.connect;
  const connect = typeof givenConnect === "number" && Number.isFinite(givenConnect)
    ? Math.min(limits.maxConnect, Math.max(limits.minConnect, givenConnect))
    : reel ? FX_FORMAT.reelConnect : FX_FORMAT.connect;
  if (typeof givenConnect !== "number" || !Number.isFinite(givenConnect)) notices.push(note("fxFilled", "A missing connect was filled in."));
  else if (givenConnect !== connect) notices.push(note("fxClamped", "Connect was clamped."));
  const given = parsed.damage;
  const damage = typeof given === "number" && Number.isFinite(given) ? given : null;
  if (given !== undefined && given !== null && damage === null) notices.push(note("fxNotNumber", "The hit amount is not a number."));
  return { order: { steps, inactive, connect, damage, raw: parsed }, notices };
}
