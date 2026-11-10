import type { Sq } from "../../types/core-types.ts";
import type { Aim } from "../targeting/types.ts";
import { LOG_FORMAT_VERSION, type Action, type CommandLog, type LogEntry, type LogHeader, type ParseResult } from "./types.ts";

const EDGES = new Set(["N", "E", "S", "W"]);
const rec = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const sq = (v: unknown): v is Sq => rec(v) && typeof v.c === "number" && typeof v.r === "number";

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
  return (v.target === null || aimOf(v.target)) && dur && (typeof v.turns === "number" || v.turns === null) && fx && via;
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

export function createLog(header: LogHeader, onAppend?: (entry: LogEntry) => void): CommandLog {
  const list: LogEntry[] = [];
  const head: LogHeader = { seed: header.seed, formatVersion: header.formatVersion, engineVersion: header.engineVersion, projectHash: header.projectHash };
  return {
    header: head,
    append(tick, action) {
      const last = list.at(-1);
      if (!Number.isInteger(tick) || tick < 0 || (last !== undefined && tick < last.tick)) throw new RangeError("tick");
      const entry: LogEntry = { seq: list.length + 1, tick, action: packAction(action) };
      list.push(entry);
      onAppend?.(entry);
    },
    entries: () => list.slice(),
    lastSeq: () => list.length,
    toJSON: () => JSON.stringify({ header: head, entries: list }),
  };
}

export function parseLog(json: string): ParseResult {
  let value: unknown;
  try { value = JSON.parse(json); } catch { return { ok: false, error: "not JSON" }; }
  if (!rec(value) || !rec(value.header) || !Array.isArray(value.entries)) return { ok: false, error: "missing header or entries" };
  const h = value.header;
  if (h.formatVersion !== LOG_FORMAT_VERSION) return { ok: false, error: `unsupported log formatVersion ${String(h.formatVersion)}` };
  if (typeof h.seed !== "number" || !Number.isInteger(h.seed) || typeof h.engineVersion !== "string" || typeof h.projectHash !== "string") return { ok: false, error: "bad header" };
  const log = createLog({ seed: h.seed, formatVersion: LOG_FORMAT_VERSION, engineVersion: h.engineVersion, projectHash: h.projectHash });
  let prev = -1;
  for (let i = 0; i < value.entries.length; i += 1) {
    const e = value.entries[i];
    if (!rec(e) || e.seq !== i + 1 || typeof e.tick !== "number" || !Number.isInteger(e.tick) || e.tick < 0 || e.tick < prev || !actionOf(e.action)) return { ok: false, error: "bad entry" };
    prev = e.tick;
    log.append(e.tick, e.action);
  }
  return { ok: true, log };
}
