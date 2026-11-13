import { px } from "./camera.ts";
import type { Clip } from "./types.ts";

export const badMs = (ms: readonly unknown[] | undefined): boolean => ms !== undefined && ms.some((v) => !(Number.isInteger(v) && (v as number) >= 1));

export function clipMs(clip: Clip, stepMs: number): number[] {
  const fps = typeof clip.fps === "number" && Number.isFinite(clip.fps) && clip.fps > 0 ? clip.fps : 8, ms = clip.ms !== undefined && clip.ms.length > 0 && !badMs(clip.ms) ? clip.ms : null;
  return clip.frames.map((_, i) => Math.max(1, px((ms === null ? 1000 / fps : ms[Math.min(i, ms.length - 1)] ?? 0) / stepMs)) * stepMs);
}

export function frameAt(clip: Clip | undefined, tMs: number, stepMs: number, offsetMs = 0): { frame: number; nextMs: number } {
  if (clip === undefined || clip.frames.length === 0) return { frame: 0, nextMs: Infinity };
  const ms = clipMs(clip, stepMs);
  if (clip.frames.length === 1) return { frame: clip.frames[0] ?? 0, nextMs: Infinity };
  const total = ms.reduce((sum, n) => sum + n, 0);
  let t = tMs + offsetMs;
  const loop = clip.loop !== false;
  if (loop) {
    t = ((t % total) + total) % total;
  } else if (t >= total) return { frame: clip.frames[clip.frames.length - 1] ?? 0, nextMs: Infinity };
  let at = 0;
  for (let i = 0; i < ms.length; i += 1) {
    const n = ms[i] ?? 0;
    if (t < at + n) return { frame: clip.frames[i] ?? 0, nextMs: tMs + at + n - t };
    at += n;
  }
  return { frame: clip.frames[ms.length - 1] ?? 0, nextMs: Infinity };
}

export function hash32(mapSeed: number, assetId: string, c: number, r: number): number {
  let hash = 2166136261;
  for (const n of [mapSeed, c, r]) {
    for (let i = 0; i < 4; i += 1) hash = Math.imul(hash ^ (((n >>> 0) >>> (8 * i)) & 255), 16777619) >>> 0;
  }
  for (let i = 0; i < assetId.length; i += 1) {
    const u = assetId.charCodeAt(i);
    hash = Math.imul(hash ^ (u & 255), 16777619) >>> 0;
    hash = Math.imul(hash ^ ((u >>> 8) & 255), 16777619) >>> 0;
  }
  return hash;
}

export function instanceOffset(clip: Clip | undefined, stepMs: number, mapSeed: number, assetId: string, c: number, r: number): number {
  const loopMs = clip !== undefined && clip.frames.length > 0 ? clipMs(clip, stepMs).reduce((sum, n) => sum + n, 0) : 0;
  return loopMs > 0 ? hash32(mapSeed, assetId, c, r) % loopMs : 0;
}
