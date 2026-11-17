import type { Action } from "../../core/log/types.ts";
import type { Notice } from "../../core/notice.ts";
import { NOT_PLAIN, isRecord, plainCopy } from "../../core/plain.ts";
import { docToLiveFx, stepTimes, type DocHost, type FxDocValues } from "../render/fx-doc.ts";
import type { LiveFx } from "../render/fx-live.ts";

export const CAST = { live: 8, cache: 64, notes: 64 } as const;
export type CastCue = { readonly id: string; readonly atMs: number; readonly caster: string; readonly target?: string; readonly at?: { readonly c: number; readonly r: number }; readonly ref: string };
export type EffectValues = { readonly rev: number; readonly values: FxDocValues };
export type CastFxHost = { readonly sheetOf: DocHost["sheetOf"]; readonly clipOf?: DocHost["clipOf"]; readonly values: (ref: string) => EffectValues | null };
export type CastFx = { prewarm(refs: readonly string[]): void; cast(cue: unknown): void; effects(nowMs: number): readonly LiveFx[]; reset(nowMs: number, logSeq: number): void; readonly notes: readonly Notice[]; readonly compiles: number };

const BAD_REF = new Set(["__proto__", "constructor", "toString", "valueOf"]);
type Cached = { readonly fx: LiveFx; readonly end: number };
type Held = { readonly fx: LiveFx; readonly atMs: number; readonly end: number };
const cell = (v: unknown): { readonly c: number; readonly r: number } | undefined => (isRecord(v) && typeof v.c === "number" && typeof v.r === "number" ? { c: v.c, r: v.r } : undefined);

export function cueFromEntry(entry: unknown, stepMs: number, refOf: (action: Action) => string | undefined): CastCue | null {
  const copy = plainCopy(entry, 4);
  if (copy === NOT_PLAIN || !isRecord(copy) || !isRecord(copy.action)) return null;
  const action = copy.action;
  let ref: string | undefined;
  try { ref = refOf(action as Action); } catch { return null; }
  if (typeof ref !== "string" || ref === "" || typeof copy.seq !== "number" || typeof copy.tick !== "number" || typeof action.actor !== "string" || action.actor === "") return null;
  const cue: { id: string; atMs: number; caster: string; ref: string; target?: string; at?: { c: number; r: number } } = { id: `cast:${copy.seq}`, atMs: copy.tick * stepMs, caster: action.actor, ref };
  const aim = action.target;
  if (isRecord(aim) && aim.pipe === "unit" && typeof aim.unitId === "string") {
    cue.target = aim.unitId;
    const at = cell(aim.fallbackAt);
    if (at !== undefined) cue.at = at;
  } else if (isRecord(aim) && aim.pipe === "tile") {
    const at = cell(aim.at);
    if (at !== undefined) cue.at = at;
  }
  return cue;
}

export function createCastFx(host: CastFxHost): CastFx {
  const cache = new Map<string, Cached>(), notes: Notice[] = [];
  let held: Held[] = [], shown: LiveFx[] | undefined, compiles = 0, extra = 0, capped = false, mark = 0;
  const note = (code: string, message: string): void => { if (notes.length >= CAST.notes) { extra += 1; return; } notes.push({ code, message }); };
  const touch = (key: string): Cached | undefined => { const hit = cache.get(key); if (hit === undefined) return undefined; cache.delete(key); cache.set(key, hit); return hit; };
  const store = (key: string, row: Cached): void => { cache.delete(key); cache.set(key, row); if (cache.size <= CAST.cache) return; const oldest = cache.keys().next().value; if (oldest !== undefined) cache.delete(oldest); };
  const load = (ref: string): Cached | null => {
    if (ref === "none") return null;
    if (BAD_REF.has(ref)) { note("unknownRef", ref); return null; }
    let got: EffectValues | null;
    try { got = host.values(ref); } catch { note("invalidValue", ref); return null; }
    if (got === null) { note("unknownRef", ref); return null; }
    if (!isRecord(got) || typeof got.rev !== "number" || !Number.isFinite(got.rev) || !isRecord(got.values)) { note("invalidValue", ref); return null; }
    const key = `${ref}@${got.rev}`, hit = touch(key);
    if (hit !== undefined) return hit.fx.pieces.length === 0 ? null : hit;
    const made = docToLiveFx(got.values, { id: ref, castMs: 0, caster: "", sheetOf: host.sheetOf, ...(host.clipOf === undefined ? {} : { clipOf: host.clipOf }) });
    compiles += 1;
    for (const item of made.notes) note(item.code, item.message);
    const row: Cached = { fx: made.fx, end: stepTimes(got.values).endMs };
    store(key, row);
    if (made.fx.pieces.length === 0) { if (!made.notes.some((item) => item.code === "noPicture")) note("noPicture", ref); return null; }
    return row;
  };
  return {
    prewarm(refs) { for (const ref of refs) load(ref); },
    cast(cue) {
      const copy = plainCopy(cue, 3);
      if (copy === NOT_PLAIN || !isRecord(copy)) { note("invalidValue", "cue"); return; }
      const { id, atMs, caster, ref } = copy;
      if (typeof id !== "string" || id === "" || typeof atMs !== "number" || !Number.isFinite(atMs) || typeof caster !== "string" || caster === "" || typeof ref !== "string" || ref === "") { note("invalidValue", "cue"); return; }
      const seq = /^cast:(\d+)$/.exec(id);
      if (seq !== null && Number(seq[1]) <= mark) return;
      if (held.some((row) => row.fx.id === id)) return;
      const built = load(ref);
      if (built === null) return;
      const at = cell(copy.at), target = typeof copy.target === "string" ? copy.target : undefined;
      const fx: LiveFx = { ...built.fx, id, castMs: atMs, caster, ...(target === undefined ? {} : { target }), ...(at === undefined ? {} : { at }) };
      held.push({ fx, atMs, end: built.end });
      if (held.length > CAST.live) { held.shift(); if (!capped) { note("overCap", "live"); capped = true; } }
      shown = undefined;
    },
    effects(nowMs) {
      capped = false;
      const keep = held.filter((row) => nowMs <= row.atMs + row.end);
      if (keep.length !== held.length) { held = keep; shown = undefined; }
      const vis = held.filter((row) => row.atMs <= nowMs).map((row) => row.fx);
      if (shown !== undefined && shown.length === vis.length && shown.every((fx, i) => fx === vis[i])) return shown;
      shown = vis;
      return shown;
    },
    reset(nowMs, logSeq) {
      if (logSeq > mark) mark = logSeq;
      const keep = held.filter((row) => row.atMs <= nowMs);
      if (keep.length !== held.length) { held = keep; shown = undefined; }
    },
    get notes() { return extra > 0 ? [...notes, { code: "noticesCapped", message: `and ${extra} more` }] : notes; },
    get compiles() { return compiles; },
  };
}
