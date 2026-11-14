import type { Pixels } from "./bakes.ts";
import { hash32 } from "./frames.ts";
import type { Cam, DrawList, Fit } from "./types.ts";
export const FEEL = { stopMaxMs: 150, stopFlashMs: 50, squashMs: 60, shakeGridMs: 30, shakeMax: 3, shakeMs: [0, 120, 200, 300], shakeMsMin: 80, shakeMsMax: 400 } as const;
export type ShakeSetting = "off" | "low" | "full";
export type Hold = { readonly from: number; readonly to: number };
export type Kick = { readonly at: number; readonly px: number; readonly ms: number; readonly dx: number; readonly dy: number; readonly seed: number };
export type Shake = { readonly x: number; readonly y: number; readonly nextMs: number };
export function stopMs(stored: unknown, stepMs: number, reduce: boolean, flashes: boolean): number {
  if (reduce || typeof stored !== "number" || !Number.isFinite(stored) || stored <= 0) return 0;
  const step = stepMs > 0 && Number.isFinite(stepMs) ? stepMs : 1;
  return Math.min(Math.ceil(stored / step) * step, flashes ? FEEL.stopFlashMs : FEEL.stopMaxMs);
}
export function mergeHolds(rows: readonly Hold[]): Hold[] {
  const out: Hold[] = [];
  for (const h of rows.filter((row) => row.to > row.from).sort((a, b) => a.from - b.from || a.to - b.to)) {
    const last = out[out.length - 1];
    if (last !== undefined && h.from < last.to) out[out.length - 1] = { from: last.from, to: Math.min(Math.max(last.to, h.to), last.from + FEEL.stopMaxMs) };
    else out.push({ from: h.from, to: Math.min(h.to, h.from + FEEL.stopMaxMs) });
  }
  return out;
}
export const warp = (tMs: number, hold: Hold | null): number => (hold === null || tMs < hold.from ? tMs : tMs < hold.to ? hold.from : tMs - (hold.to - hold.from));
export const shiver = (pose: number, fromMs: number, gridMs: number): number => (Math.floor((pose - fromMs) / (gridMs > 0 ? gridMs : 1)) % 2 === 0 ? -1 : 1);
export function shakePx(stored: unknown): { px: number; bad: boolean } {
  if (stored === undefined) return { px: 0, bad: false };
  if (typeof stored !== "number" || !Number.isFinite(stored)) return { px: 0, bad: true };
  const whole = Math.trunc(stored), px = Math.min(FEEL.shakeMax, Math.max(0, whole));
  return { px, bad: whole !== stored || whole !== px };
}
export function shakeLen(stored: unknown, px: number): { ms: number; bad: boolean } {
  const fallback = FEEL.shakeMs[Math.min(FEEL.shakeMax, Math.max(0, Math.trunc(px)))] ?? 0;
  if (stored === undefined) return { ms: fallback, bad: false };
  if (typeof stored !== "number" || !Number.isFinite(stored)) return { ms: fallback, bad: true }; // EA fold Q4: not a number plays as absent (the strength default), with outOfRange
  const whole = Math.trunc(stored), ms = Math.min(FEEL.shakeMsMax, Math.max(FEEL.shakeMsMin, whole));
  return { ms, bad: whole !== stored || whole !== ms };
}
export const playerPx = (px: number, setting: string | undefined, reduce: boolean): number => (reduce || setting === "off" ? 0 : setting === "low" ? (px > 0 ? Math.max(1, Math.floor(px / 2)) : 0) : px);
export function shakeAt(kicks: readonly Kick[], tMs: number): Shake {
  let best: { amp: number; kick: Kick; step: number } | undefined, next = Infinity;
  for (const kick of kicks) {
    if (!(kick.ms > 0) || !(kick.px > 0)) continue;
    if (tMs < kick.at) { if (kick.at < next) next = kick.at; continue; }
    if (tMs >= kick.at + kick.ms) continue;
    const step = Math.floor((tMs - kick.at) / FEEL.shakeGridMs), u = (step * FEEL.shakeGridMs) / kick.ms, amp = kick.px * (1 - u) * (1 - u), boundary = Math.min(kick.at + (step + 1) * FEEL.shakeGridMs, kick.at + kick.ms);
    if (boundary < next) next = boundary;
    if (best === undefined || amp > best.amp) best = { amp, kick, step };
  }
  if (best === undefined) return { x: 0, y: 0, nextMs: next };
  const mag = Math.min(FEEL.shakeMax, Math.round(Math.min(FEEL.shakeMax, best.amp))), won = best;
  const noise = (axis: number): number => (mag === 0 ? 0 : (hash32(won.kick.seed, "shake", won.step, axis) % (mag * 2 + 1)) - mag);
  const kick = won.step === 0 && (won.kick.dx !== 0 || won.kick.dy !== 0); // ruling 4: "none" (or no aim) is noise from the first step
  return { x: kick ? Math.sign(won.kick.dx) * mag : noise(0), y: kick ? Math.sign(won.kick.dy) * mag : noise(1), nextMs: next };
}
export const shakeCam = (cam: Cam, dx: number, dy: number, mapW: number, mapH: number, fit: Fit): Cam => {
  const axis = (dev: number, delta: number, map: number, art: number): number => { const moved = dev - delta, hi = Math.max((map - art) * fit.s, dev), lo = Math.min(0, dev); return Math.min(hi, Math.max(lo, moved)); };
  const devX = axis(cam.devX, dx, mapW, fit.artW), devY = axis(cam.devY, dy, mapH, fit.artH);
  return devX === cam.devX && devY === cam.devY ? cam : { ...cam, devX, devY };
};
export const steadyUi = (list: DrawList, dx: number, dy: number): DrawList => (dx === 0 && dy === 0 ? list : { dueMs: list.dueMs, cmds: list.cmds.map((cmd) => (cmd.band === "ui" ? { ...cmd, dx: cmd.dx + dx, dy: cmd.dy + dy } : cmd)) });
export function squashed(id: string, source: (sheetId: string, frame: number, fw: number, fh: number) => Pixels | undefined): Pixels | undefined {
  const m = /^(.*)~sq(\d+)~(\d+)x(\d+)$/.exec(id); if (m === null) return undefined;
  const fw = Number(m[3]), fh = Number(m[4]); if (!(fw >= 1) || !(fh > 2)) return undefined;
  const src = source(m[1] ?? "", Number(m[2]), fw, fh); if (src === undefined || src.w !== fw || src.h !== fh) return undefined;
  const dw = fw + 2, dh = fh - 2, data = new Uint8ClampedArray(dw * dh * 4);
  for (let y = 0; y < dh; y += 1) for (let x = 0; x < dw; x += 1) { const sx = Math.min(fw - 1, Math.max(0, Math.round((x * fw) / dw))), sy = Math.min(fh - 1, Math.max(0, fh - 1 - Math.round(((dh - 1 - y) * fh) / dh))), i = (y * dw + x) * 4, j = (sy * fw + sx) * 4; data[i] = src.data[j] ?? 0; data[i + 1] = src.data[j + 1] ?? 0; data[i + 2] = src.data[j + 2] ?? 0; data[i + 3] = src.data[j + 3] ?? 0; }
  return { w: dw, h: dh, data };
}
