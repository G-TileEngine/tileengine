import type { Notice } from "../../core/notice.ts";
import { readDoc } from "./fields.ts";
import { checkLimits, type SpriteRecipeLimits } from "./limits.ts";
import type { RecipeRead } from "./types.ts";

export const SPRITE_RECIPE_FORMAT = 1;
export const SPRITE_RASTER = 1;
const DROP = new Set(["__proto__", "constructor", "prototype"]);
const FAIL = Symbol();
const fail = (error: string): RecipeRead => ({ ok: false, needsMigration: false, error });

function copy(v: unknown, ns: Notice[], d: number): unknown {
  if (d > 10000) return FAIL;
  if (v === null || typeof v === "boolean" || typeof v === "string") return v;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "undefined" || typeof v === "function" || typeof v === "symbol") return undefined;
  if (typeof v !== "object") return FAIL;
  const box = v as { toJSON?: () => unknown };
  if (typeof box.toJSON === "function") return copy(box.toJSON(), ns, d);
  if (Array.isArray(v)) { const out: unknown[] = []; for (const item of v) { const c = copy(item, ns, d + 1); if (c === FAIL) return FAIL; out.push(c === undefined ? null : c); } return out; }
  const out: Record<string, unknown> = {}; const recIn = v as Record<string, unknown>;
  for (const k of Object.keys(recIn)) {
    if (DROP.has(k)) { ns.push({ code: "droppedKey", message: "droppedKey " + k }); continue; }
    const c = copy(recIn[k], ns, d + 1); if (c === FAIL) return FAIL; if (c !== undefined) out[k] = c;
  }
  return out;
}

export function readSpriteRecipe(json: unknown, limits: SpriteRecipeLimits): RecipeRead {
  checkLimits(limits);
  try {
    if (json === null || typeof json !== "object") return fail("not an object");
    const dropped: Notice[] = []; const stored = copy(json, dropped, 0);
    if (stored === FAIL) return fail("not plain JSON");
    if (stored === null || typeof stored !== "object" || Array.isArray(stored)) return fail("not an object");
    const rec = stored as Record<string, unknown>;
    if (rec.kind !== "sprite-recipe") return fail("wrong kind " + (rec.kind !== null && typeof rec.kind === "object" ? "object" : String(rec.kind)));
    const fv = rec.formatVersion;
    if (typeof fv !== "number" || !Number.isInteger(fv)) return fail("bad field formatVersion");
    if (fv < 1) return { ok: false, needsMigration: true, kind: "sprite-recipe", found: fv };
    const readOnly = fv > SPRITE_RECIPE_FORMAT;
    const notices: Notice[] = readOnly ? [{ code: "newerFormat", message: "newerFormat formatVersion" }, ...dropped] : dropped;
    const doc = readDoc(rec, fv, limits, notices);
    if (doc.raster > SPRITE_RASTER) notices.push({ code: "rasterTooNew", message: "rasterTooNew raster" });
    return { ok: true, doc, stored: rec, notices, readOnly };
  } catch { return fail("not plain JSON"); }
}
