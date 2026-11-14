import type { Pixels } from "./bakes.ts";
import { CHUNK } from "./chunk-plan.ts";
import { hash32 } from "./frames.ts";
import { ANIM_HINT, bakeMotion, shoreSettings, type Motion, type ShoreStyle } from "./motion.ts";
import type { Overlay, TileMotion } from "./types.ts";
import { SHORE_MAX, shoreDistance, shoreFrames } from "./water.ts";

export const BAKE_BUDGET = 32 * 1024 * 1024, PLANS_MAX = 1024;
export type FrameSource = (sheetId: string, frame: number, fw: number, fh: number) => Pixels | undefined;
export type WorldNote = { readonly code: string; readonly message: string };
export type ShoreMap = { readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number; readonly water: Uint8Array };
export type WorldMotion = { plan(m: Motion | null, ramps: ShoreStyle["ramps"], animated: boolean, fw: number, fh: number, owner: string): TileMotion | null; shore(map: ShoreMap | null, style: ShoreStyle | undefined, reduce: boolean): Overlay[]; pixels(id: string): Pixels | undefined; readonly notes: WorldNote[]; readonly bytes: () => number };
type Plan = { readonly tile: TileMotion; readonly m: Motion; readonly ramps: ShoreStyle["ramps"]; readonly fw: number; readonly fh: number };
const pack = (frames: readonly Pixels[]): Pixels => {
  const fw = frames[0]?.w ?? 0, fh = frames[0]?.h ?? 0, n = frames.length, data = new Uint8ClampedArray(fw * n * fh * 4);
  for (let f = 0; f < n; f += 1) { const src = frames[f]?.data; if (src === undefined) continue; for (let y = 0; y < fh; y += 1) data.set(src.subarray(y * fw * 4, (y + 1) * fw * 4), (y * fw * n + f * fw) * 4); }
  return { w: fw * n, h: fh, data };
};
export function createWorldMotion(source: FrameSource): WorldMotion {
  const notes: WorldNote[] = [], warned = new Set<string>(), plans = new Map<string, Plan>(), pics = new Map<string, { px: Pixels; bytes: number }>();
  let used = 0, rev = 0, shoreMap: ShoreMap | null = null, shoreKey = "", shoreOn: ReturnType<typeof shoreSettings>["on"] = null;
  const warn = (owner: string, code: string, message: string): void => { if (notes.length >= PLANS_MAX) return; const k = `${owner}\0${code}\0${message}`; if (warned.has(k)) return; warned.add(k); notes.push({ code, message }); };
  const touch = <T,>(map: Map<string, T>, key: string): T | undefined => { const got = map.get(key); if (got === undefined) return undefined; map.delete(key); map.set(key, got); return got; };
  const keep = (id: string, px: Pixels): Pixels => {
    const prev = pics.get(id); if (prev !== undefined) { used -= prev.bytes; pics.delete(id); }
    const bytes = px.w * px.h * 4; while (pics.size > 0 && used + bytes > BAKE_BUDGET) { const k = pics.keys().next().value; if (k === undefined) break; used -= pics.get(k)?.bytes ?? 0; pics.delete(k); } if (used + bytes <= BAKE_BUDGET) { pics.set(id, { px, bytes }); used += bytes; }
    return px;
  };
  const plan: WorldMotion["plan"] = (m, ramps, animated, fw, fh, owner) => {
    if (m === null) return null; if (animated) { warn(owner, "motionInvalid", ANIM_HINT); return null; }
    const key = `${hash32(0, JSON.stringify([m, ramps ?? null]), 0, 0)}s${fw}x${fh}`, got = touch(plans, key);
    if (got !== undefined) return got.tile;
    const baked = bakeMotion({ w: fw, h: fh, data: new Uint8ClampedArray(fw * fh * 4) }, m, ramps === undefined ? { animated } : { ramps, animated });
    for (const code of baked.notices) warn(owner, code, code === "motionInvalid" && baked.message !== undefined ? baked.message : code);
    if (baked.parts.length === 0) return null;
    const row: Plan = { tile: { key, n: baked.frames.length, parts: baked.parts }, m, ramps, fw, fh };
    plans.set(key, row); while (plans.size > PLANS_MAX) { const k = plans.keys().next().value; if (k === undefined) break; plans.delete(k); }
    return row.tile;
  };
  const shore: WorldMotion["shore"] = (map, style, reduce) => {
    const set = style === undefined ? null : shoreSettings(style);
    if (set !== null) for (const n of set.notices) warn("shore", n.code, n.message);
    shoreOn = set?.on ?? null;
    if (map === null || shoreOn === null || map.water.length !== map.cols * map.rows || map.tileW < 1 || map.tileH < 1) { shoreMap = null; return []; }
    const on = shoreOn, sig = `${map.cols},${map.rows},${map.tileW},${map.tileH},${map.mapSeed},${on.opts.foamPx},${on.opts.frames},${on.colours.foam},${on.colours.shallow},${on.colours.wave}:${map.water}`;
    if (sig !== shoreKey) { shoreKey = sig; rev += 1; } shoreMap = map;
    const out: Overlay[] = [], n = on.opts.frames, ms = on.opts.ms, clip = reduce ? undefined : { name: "shore", frames: Array.from({ length: n }, (_, i) => i), ms: Array.from({ length: n }, () => ms) };
    for (let cy = 0; cy * CHUNK < map.rows; cy += 1) for (let cx = 0; cx * CHUNK < map.cols; cx += 1) {
      const c0 = cx * CHUNK, r0 = cy * CHUNK, c1 = Math.min(map.cols, c0 + CHUNK), r1 = Math.min(map.rows, r0 + CHUNK);
      let wet = false; for (let r = r0; r < r1 && !wet; r += 1) for (let c = c0; c < c1 && !wet; c += 1) wet = map.water[r * map.cols + c] === 1;
      if (!wet) continue;
      out.push({ band: "fxGround", sheet: { id: `shore~${rev}~${cx},${cy}`, columns: n, fw: (c1 - c0) * map.tileW, fh: (r1 - r0) * map.tileH }, x: c0 * map.tileW, y: r0 * map.tileH, ...(clip === undefined ? { frame: 0 } : { clip }) });
    }
    return out;
  };
  const bakeShore = (cx: number, cy: number): Pixels | undefined => {
    const map = shoreMap, on = shoreOn; if (map === null || on === null || cx < 0 || cy < 0 || cx * CHUNK >= map.cols || cy * CHUNK >= map.rows) return undefined;
    const tw = map.tileW, th = map.tileH, c0 = cx * CHUNK, r0 = cy * CHUNK, c1 = Math.min(map.cols, c0 + CHUNK), r1 = Math.min(map.rows, r0 + CHUNK);
    const x0 = c0 * tw, y0 = r0 * th, cw = (c1 - c0) * tw, ch = (r1 - r0) * th, wx0 = Math.max(0, x0 - SHORE_MAX), wy0 = Math.max(0, y0 - SHORE_MAX), wx1 = Math.min(map.cols * tw, x0 + cw + SHORE_MAX), wy1 = Math.min(map.rows * th, y0 + ch + SHORE_MAX), ww = wx1 - wx0, wh = wy1 - wy0, land = new Uint8Array(ww * wh);
    for (let y = 0; y < wh; y += 1) for (let x = 0; x < ww; x += 1) land[y * ww + x] = map.water[Math.floor((wy0 + y) / th) * map.cols + Math.floor((wx0 + x) / tw)] === 1 ? 0 : 1;
    const dist = shoreDistance(land, ww, wh, map.mapSeed, SHORE_MAX, on.opts.foamPx, wx0, wy0), crop = new Uint8Array(cw * ch), ox = x0 - wx0, oy = y0 - wy0;
    for (let y = 0; y < ch; y += 1) crop.set(dist.subarray((y + oy) * ww + ox, (y + oy) * ww + ox + cw), y * cw);
    return pack(shoreFrames(crop, cw, ch, on.colours, on.opts));
  };
  const pixels = (id: string): Pixels | undefined => {
    const shoreId = /^shore~(\d+)~(\d+),(\d+)$/.exec(id);
    if (shoreId !== null) { if (Number(shoreId[1]) !== rev || shoreMap === null) return undefined; const cached = touch(pics, id); if (cached !== undefined) return cached.px; const px = bakeShore(Number(shoreId[2]), Number(shoreId[3])); return px === undefined ? undefined : keep(id, px); }
    const cached = touch(pics, id); if (cached !== undefined) return cached.px;
    const mot = /^(.*)~m(\d+)~([^~]+)$/.exec(id), row = mot === null ? undefined : touch(plans, mot[3] ?? ""); if (mot === null || row === undefined) return undefined;
    const img = source(mot[1] ?? "", Number(mot[2]), row.fw, row.fh); if (img === undefined) return undefined;
    const baked = bakeMotion(img, row.m, row.ramps === undefined ? { animated: false } : { ramps: row.ramps, animated: false }); return baked.frames.length === 0 ? undefined : keep(id, pack(baked.frames));
  };
  return { plan, shore, pixels, notes, bytes: () => used };
}
