import type { Sq } from "../types/core-types.ts";

export const NOT_PLAIN: unique symbol = Symbol("NOT_PLAIN");
const SKIP = new Set(["__proto__", "constructor", "prototype"]);
export const isRecord = (v: unknown): v is Readonly<Record<string, unknown>> => typeof v === "object" && v !== null && !Array.isArray(v);

function walk(v: unknown, depth: number, left: { n: number }, seen: Set<object>): unknown {
  if (left.n <= 0) return NOT_PLAIN;
  left.n -= 1;
  if (typeof v === "number") return Object.is(v, -0) ? 0 : v;
  if (v === null || v === undefined || typeof v === "string" || typeof v === "boolean") return v;
  if (typeof v === "bigint") return NOT_PLAIN;
  if (typeof v !== "object" || seen.has(v)) return typeof v !== "object" ? undefined : NOT_PLAIN;
  const proto = Object.getPrototypeOf(v) as object | null, arr = Array.isArray(v);
  if (depth <= 0 || (arr ? proto !== Array.prototype : proto !== Object.prototype && proto !== null)) return NOT_PLAIN;
  seen.add(v);
  const box: unknown[] | Record<string, unknown> = arr ? [] : {};
  if (arr) {
    const n = (v as { length: number }).length;
    if (!Number.isInteger(n) || n < 0 || n > left.n) return NOT_PLAIN;
    for (let i = 0; i < n; i += 1) {
      if (!Object.hasOwn(v, i)) return NOT_PLAIN;
      const item = walk((v as unknown[])[i], depth - 1, left, seen);
      if (item === NOT_PLAIN) return NOT_PLAIN;
      (box as unknown[]).push(item);
    }
  } else for (const key of Object.keys(v)) {
    if (SKIP.has(key)) continue;
    const item = walk((v as Record<string, unknown>)[key], depth - 1, left, seen);
    if (item === NOT_PLAIN) return NOT_PLAIN;
    if (item !== undefined) (box as Record<string, unknown>)[key] = item;
  }
  seen.delete(v);
  return Object.freeze(box);
}

export function plainCopy(value: unknown, depth: number, nodes = Number.POSITIVE_INFINITY): unknown {
  try { return walk(value, depth, { n: nodes }, new Set()); } catch { return NOT_PLAIN; }
}
export function cellOf(v: unknown): Sq | null {
  const copy = plainCopy(v, 1);
  return isRecord(copy) && Number.isInteger(copy.c) && Number.isInteger(copy.r) ? copy as Sq : null;
}
