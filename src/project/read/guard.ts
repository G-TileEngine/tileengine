import type { CoreDocKind, CurrentFormatVersions } from "../../types/core-types.ts";
import type { Notice } from "../../core/notice.ts";

/** Hard failures. needsMigration: an integer formatVersion that is not the current one (never patched here). */
export type ReadFail =
  | { readonly ok: false; readonly needsMigration: true; readonly kind: CoreDocKind; readonly found: unknown }
  | { readonly ok: false; readonly needsMigration: false; readonly error: string };
export type ReadResult<T> = { readonly ok: true; readonly doc: T; readonly notices: readonly Notice[] } | ReadFail;

/** Runtime copy of DSK's CurrentFormatVersions; `satisfies` keeps the two equal. */
export const CURRENT_FORMAT_VERSIONS = {
  "tile-project": 6, map: 5, stage: 2, unit: 2, "behaviour-setup": 3, deck: 1, audio: 1,
} as const satisfies CurrentFormatVersions;

export const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export const isInt = (v: unknown, min = Number.NEGATIVE_INFINITY): v is number => typeof v === "number" && Number.isInteger(v) && v >= min;
export const isStr = (v: unknown): v is string => typeof v === "string";
export function strs(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const out: string[] = [];
  for (const x of v) { if (!isStr(x)) return null; out.push(x); }
  return out;
}
export const bad = (key: string): ReadFail => ({ ok: false, needsMigration: false, error: `bad field ${key}` });
export function guarded<T>(read: () => ReadResult<T>): ReadResult<T> {
  try { return read(); } catch { return { ok: false, needsMigration: false, error: "unreadable document" }; }
}

/** null = the version guard passes. */
export function checkVersion(json: unknown, kind: CoreDocKind): ReadFail | null {
  if (!isObj(json)) return { ok: false, needsMigration: false, error: "not an object" };
  if (json.kind !== kind) return { ok: false, needsMigration: false, error: `wrong kind ${typeof json.kind === "object" && json.kind !== null ? "object" : String(json.kind)}` };
  if (!isInt(json.formatVersion)) return bad("formatVersion");
  if (json.formatVersion !== CURRENT_FORMAT_VERSIONS[kind]) return { ok: false, needsMigration: true, kind, found: json.formatVersion };
  return null;
}
