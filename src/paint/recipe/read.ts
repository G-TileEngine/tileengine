import type { Notice } from "../../core/notice.ts";
import { readDoc } from "./fields.ts";
import { checkLimits, type SpriteRecipeLimits } from "./limits.ts";
import type { RecipeRead } from "./types.ts";

export const SPRITE_RECIPE_FORMAT = 1;
export const SPRITE_RASTER = 1;
const DROP = new Set(["__proto__", "constructor", "prototype"]);
const FAIL = Symbol();
const BYTES = Symbol();
const fail = (error: string): RecipeRead => ({ ok: false, needsMigration: false, error });
const arr = (v: unknown): unknown[] | null => Array.isArray(v) ? v : null; const recOf = (v: unknown): Record<string, unknown> | null => v !== null && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : null;
const lenOf = (v: unknown, n: number): number => { const a = arr(v); return a === null ? 0 : Math.min(a.length, n); }; const cut = (v: unknown, n: number): void => { const a = arr(v); if (a !== null && a.length > n) a.length = n; };
function overTotals(rec: Record<string, unknown>, lim: ReturnType<typeof checkLimits>): string | null {
  let runs = 0, points = 0, tweaks = 0;
  for (const p of (arr(rec.parts) ?? []).slice(0, lim.parts)) { const o = recOf(p); if (o === null) continue; runs += lenOf(o.runs, lim.runs); const pf = recOf(o.promotedFrom); if (pf !== null) runs += lenOf(pf.runs, lim.runs); const g = recOf(o.geom); if (g !== null) points += lenOf(g.pts, lim.points); }
  for (const a of (arr(rec.anims) ?? []).slice(0, lim.anims)) { const frames = arr(recOf(a)?.frames); if (frames === null) continue; for (const f of frames.slice(0, lim.frames)) { const fr = recOf(f); if (fr === null) continue; const pose = recOf(fr.pose), parts = recOf(fr.parts), rs = recOf(fr.runs); tweaks += (pose === null ? 0 : Object.keys(pose).length) + (parts === null ? 0 : Object.keys(parts).length) + (rs === null ? 0 : Object.keys(rs).length); if (rs !== null) for (const k of Object.keys(rs)) runs += lenOf(rs[k], lim.runs); } }
  return runs > lim.totalRuns ? "totalRuns" : points > lim.totalPoints ? "totalPoints" : tweaks > lim.totalTweaks ? "totalTweaks" : null;
}
function cutStored(rec: Record<string, unknown>, lim: ReturnType<typeof checkLimits>): void {
  cut(rec.parts, lim.parts); cut(rec.anims, lim.anims); cut(rec.variants, lim.variants); const sk = recOf(rec.skeleton); if (sk !== null) cut(sk.joints, lim.joints); const hist = recOf(rec.history); if (hist !== null) cut(hist.ops, lim.historyBatches);
  for (const p of arr(rec.parts) ?? []) { const o = recOf(p); if (o === null) continue; cut(o.runs, lim.runs); const pf = recOf(o.promotedFrom); if (pf !== null) cut(pf.runs, lim.runs); const g = recOf(o.geom); if (g !== null) cut(g.pts, lim.points); }
  for (const a of arr(rec.anims) ?? []) { const frames = arr(recOf(a)?.frames); cut(frames, lim.frames); if (frames === null) continue; for (const f of frames) { const rs = recOf(recOf(f)?.runs); if (rs !== null) for (const k of Object.keys(rs)) cut(rs[k], lim.runs); } }
}
const capNotes = (list: Notice[], cap: number): Notice[] => (list.length <= cap ? list : [...list.slice(0, cap), { code: "noticesCapped", message: `and ${list.length - cap} more` }]);

function measure(v: unknown, d: number, b: { n: number; cap: number }): "bytes" | "plain" | null {
  if ((b.n += 1) > b.cap || d > 10000) return b.n > b.cap ? "bytes" : "plain";
  if (typeof v === "string") { b.n += v.length; return b.n > b.cap ? "bytes" : null; }
  if (v === null || typeof v !== "object") return typeof v === "bigint" ? "plain" : null;
  if (Array.isArray(v)) { for (const item of v) { const hit = measure(item, d + 1, b); if (hit !== null) return hit; } return null; }
  for (const k of Object.keys(v)) { if ((b.n += k.length) > b.cap) return "bytes"; if (DROP.has(k)) continue; const hit = measure((v as Record<string, unknown>)[k], d + 1, b); if (hit !== null) return hit; }
  return null;
}

function copy(v: unknown, ns: Notice[], d: number, b: { n: number; cap: number }): unknown {
  if ((b.n += 1) > b.cap || d > 10000) return b.n > b.cap ? BYTES : FAIL;
  if (v === null || typeof v === "boolean") return v;
  if (typeof v === "string") { b.n += v.length; return b.n > b.cap ? BYTES : v; }
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "undefined" || typeof v === "function" || typeof v === "symbol") return undefined;
  if (typeof v !== "object") return FAIL;
  if (Array.isArray(v)) { const out: unknown[] = []; for (const item of v) { const c = copy(item, ns, d + 1, b); if (c === FAIL || c === BYTES) return c; out.push(c === undefined ? null : c); } return out; }
  const out: Record<string, unknown> = {}; const recIn = v as Record<string, unknown>;
  for (const k of Object.keys(recIn)) {
    if ((b.n += k.length) > b.cap) return BYTES;
    if (DROP.has(k)) { ns.push({ code: "droppedKey", message: "droppedKey " + k }); continue; }
    const c = copy(recIn[k], ns, d + 1, b); if (c === FAIL || c === BYTES) return c; if (c !== undefined) out[k] = c;
  }
  return out;
}

export function readSpriteRecipe(json: unknown, limits: SpriteRecipeLimits): RecipeRead {
  const lim = checkLimits(limits);
  try {
    if (json === null || typeof json !== "object") return fail("not an object");
    const weighed = measure(json, 0, { n: 0, cap: lim.bytes }); if (weighed !== null) return fail(weighed === "bytes" ? "over cap bytes" : "not plain JSON");
    const dropped: Notice[] = [], stored = copy(json, dropped, 0, { n: 0, cap: lim.bytes }); if (stored === BYTES) return fail("over cap bytes");
    if (stored === FAIL) return fail("not plain JSON");
    if (stored === null || typeof stored !== "object" || Array.isArray(stored)) return fail("not an object");
    const rec = stored as Record<string, unknown>;
    if (rec.kind !== "sprite-recipe") return fail("wrong kind " + (rec.kind !== null && typeof rec.kind === "object" ? "object" : String(rec.kind)));
    const fv = rec.formatVersion;
    if (typeof fv !== "number" || !Number.isInteger(fv)) return fail("bad field formatVersion");
    if (fv < SPRITE_RECIPE_FORMAT) return { ok: false, needsMigration: true, kind: "sprite-recipe", found: fv }; const hit = overTotals(rec, lim); if (hit !== null) return fail("over cap " + hit);
    const readOnly = fv > SPRITE_RECIPE_FORMAT;
    const notices: Notice[] = readOnly ? [{ code: "newerFormat", message: "newerFormat formatVersion" }, ...dropped] : dropped;
    const doc = readDoc(rec, fv, lim, notices);
    if (doc.raster > SPRITE_RASTER) notices.push({ code: "rasterTooNew", message: "rasterTooNew raster" });
    cutStored(rec, lim); return { ok: true, doc, stored: rec, notices: capNotes(notices, lim.notices), readOnly };
  } catch { return fail("not plain JSON"); }
}
