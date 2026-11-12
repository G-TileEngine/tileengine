import type { Sq } from "../../types/core-types.ts";
import type { Aim } from "../targeting/types.ts";
import { DEFAULT_MATCH_LIMITS, SEED_MAX, withinCeilings, type MatchLimits } from "../limits.ts";
import { NOT_PLAIN, plainCopy } from "../plain.ts";
import { LOG_FORMAT_VERSION, type Action, type CommandLog, type LogEntry, type LogHeader, type ParseResult } from "./types.ts";

const EDGES = new Set(["N", "E", "S", "W"]);
const rec = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const sq = (v: unknown): v is Sq => rec(v) && Number.isInteger(v.c) && Number.isInteger(v.r);

function aimOf(v: unknown): v is Aim {
  if (!rec(v)) return false;
  if (v.pipe === "unit" && typeof v.unitId === "string") return v.fallbackAt === undefined || sq(v.fallbackAt);
  return v.pipe === "tile" && sq(v.at) && (v.edge === undefined || (typeof v.edge === "string" && EDGES.has(v.edge)));
}
function actionOf(v: unknown): v is Action {
  if (!rec(v) || typeof v.id !== "string" || typeof v.kind !== "string" || typeof v.actor !== "string") return false;
  const dur = v.durationMs === null || (typeof v.durationMs === "number" && Number.isInteger(v.durationMs) && v.durationMs >= 0);
  const via = v.via === undefined || (rec(v.via) && typeof v.via.presentation === "string" && (v.via.ref === undefined || typeof v.via.ref === "string"));
  const fx = Array.isArray(v.effects) && v.effects.every((e) => typeof e === "string");
  const turns = v.turns === null || (typeof v.turns === "number" && Number.isFinite(v.turns));
  return (v.target === null || aimOf(v.target)) && dur && turns && fx && via;
}
function packAim(a: Aim): Aim {
  if (a.pipe === "unit") {
    const at = a.fallbackAt;
    return at === undefined ? { pipe: "unit", unitId: a.unitId } : { pipe: "unit", unitId: a.unitId, fallbackAt: { c: at.c, r: at.r } };
  }
  const at = { c: a.at.c, r: a.at.r };
  return a.edge === undefined ? { pipe: "tile", at } : { pipe: "tile", at, edge: a.edge };
}
function packAction(a: Action): Action {
  const base = { id: a.id, kind: a.kind, actor: a.actor, target: a.target === null ? null : packAim(a.target), durationMs: a.durationMs, turns: a.turns, effects: [...a.effects] };
  if (a.via === undefined) return base;
  const via = a.via.ref === undefined ? { presentation: a.via.presentation } : { presentation: a.via.presentation, ref: a.via.ref };
  return { ...base, via };
}
function tooLong(a: Action, n: number): boolean {
  const t = a.target, v = a.via, aim = t === null || (t.pipe === "unit" ? t.unitId.length <= n : t.edge === undefined || t.edge.length <= n);
  return a.id.length > n || a.kind.length > n || a.actor.length > n || a.effects.some((s) => s.length > n) || !aim || (v !== undefined && (v.presentation.length > n || (v.ref !== undefined && v.ref.length > n)));
}
const ownLimits = (v: unknown): MatchLimits | null => { const own = v === DEFAULT_MATCH_LIMITS ? v : plainCopy(v, 1); return withinCeilings(own) ? own : null; };
export function readAction(v: unknown, limits: MatchLimits = DEFAULT_MATCH_LIMITS): Action | null {
  const cap = ownLimits(limits); if (cap === null) return null;
  limits = cap;
  const copy = plainCopy(v, 3);
  return copy !== NOT_PLAIN && actionOf(copy) && (copy.durationMs === null || copy.durationMs <= limits.durationMs) && !tooLong(copy, limits.text) ? copy : null;
}

export function createLog(header: LogHeader, onAppend?: (entry: LogEntry) => void, limits: MatchLimits = DEFAULT_MATCH_LIMITS): CommandLog {
  const cap = ownLimits(limits); if (cap === null) throw new RangeError("createLog: limits must be whole numbers from 1 to their ceilings");
  limits = cap; const copied = plainCopy(header, 1); if (!rec(copied)) throw new RangeError("createLog: seed must be a uint32 and header text short");
  header = copied as LogHeader;
  if (!Number.isInteger(header.seed) || header.seed < 0 || header.seed > SEED_MAX || typeof header.engineVersion !== "string" || typeof header.projectHash !== "string" || header.engineVersion.length > limits.text || header.projectHash.length > limits.text) throw new RangeError("createLog: seed must be a uint32 and header text short");
  const list: LogEntry[] = [];
  const head: LogHeader = Object.freeze({ seed: header.seed, formatVersion: header.formatVersion, engineVersion: header.engineVersion, projectHash: header.projectHash });
  return {
    header: head,
    append(tick, action) {
      const last = list.at(-1);
      if (!Number.isInteger(tick) || tick < 0 || tick > limits.ticks || (last !== undefined && tick < last.tick)) throw new RangeError("tick");
      if (list.length >= limits.entries) throw new RangeError("append: log full");
      const own = readAction(action, limits);
      if (own === null) throw new RangeError("append: not an action");
      const entry = plainCopy({ seq: list.length + 1, tick, action: packAction(own) }, 4) as LogEntry | typeof NOT_PLAIN;
      if (entry === NOT_PLAIN) throw new RangeError("append: not an action");
      list.push(entry);
      onAppend?.(entry);
    },
    entries: () => list.slice(),
    lastSeq: () => list.length,
    toJSON: () => JSON.stringify({ header: head, entries: list }),
  };
}

export function parseLog(json: string, limits: MatchLimits = DEFAULT_MATCH_LIMITS): ParseResult {
  const cap = ownLimits(limits); if (cap === null) return { ok: false, error: "bad limits" };
  limits = cap;
  if (typeof json !== "string") return { ok: false, error: "not JSON" };
  let value: unknown;
  try { value = JSON.parse(json); } catch { return { ok: false, error: "not JSON" }; }
  if (!rec(value) || !rec(value.header) || !Array.isArray(value.entries)) return { ok: false, error: "missing header or entries" };
  const h = value.header;
  if (h.formatVersion !== LOG_FORMAT_VERSION) return { ok: false, error: `unsupported log formatVersion ${String(h.formatVersion)}` };
  if (typeof h.seed !== "number" || !Number.isInteger(h.seed) || h.seed < 0 || h.seed > SEED_MAX || typeof h.engineVersion !== "string" || typeof h.projectHash !== "string" || h.engineVersion.length > limits.text || h.projectHash.length > limits.text) return { ok: false, error: "bad header" };
  if (value.entries.length > limits.entries) return { ok: false, error: "too many entries" };
  const log = createLog({ seed: h.seed, formatVersion: LOG_FORMAT_VERSION, engineVersion: h.engineVersion, projectHash: h.projectHash }, undefined, limits);
  let prev = -1;
  for (let i = 0; i < value.entries.length; i += 1) {
    const e = value.entries[i];
    if (!rec(e) || e.seq !== i + 1 || typeof e.tick !== "number" || !Number.isInteger(e.tick) || e.tick < 0 || e.tick > limits.ticks || e.tick < prev || readAction(e.action, limits) === null) return { ok: false, error: "bad entry" };
    prev = e.tick;
    log.append(e.tick, e.action as Action);
  }
  return { ok: true, log };
}
