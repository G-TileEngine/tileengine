import type { Sq } from "../../types/core-types.ts";
import { isRecord, plainCopy } from "../../core/plain.ts";
import type { GestureBoard, GestureMapper, GestureOptions, Intent, PointerSample } from "./types.ts";

export function createGestureMapper(opts: GestureOptions, board: GestureBoard): GestureMapper {
  if (!(opts.cellPx > 0)) throw new RangeError("createGestureMapper: cellPx must be > 0");
  if (!(opts.tapMaxPx >= 0)) throw new RangeError("createGestureMapper: tapMaxPx must be >= 0");
  if (!Number.isInteger(opts.holdMs) || opts.holdMs <= 0) throw new RangeError("createGestureMapper: holdMs must be an integer > 0");
  let prev: number | null = null;
  let owner: number | null = null;
  let x0 = 0, y0 = 0, t0 = 0;
  let mode: "press" | "drag" | "box" = "press";
  const cell = (x: number, y: number): Sq | null => {
    const c = Math.floor(x / opts.cellPx), r = Math.floor(y / opts.cellPx);
    return c < 0 || r < 0 || c >= board.cols || r >= board.rows ? null : { c, r };
  };
  const aim = (sq: Sq): Intent => {
    const id = board.unitAt(sq);
    return id === undefined ? { type: "TargetCell", at: { c: sq.c, r: sq.r } } : { type: "SelectUnit", unitId: id };
  };
  return (sample) => {
    const copy = plainCopy(sample, 1);
    if (!isRecord(copy) || typeof copy.x !== "number" || typeof copy.y !== "number" || !Number.isFinite(copy.x) || !Number.isFinite(copy.y)) return [];
    sample = copy as PointerSample;
    if (!Number.isInteger(sample.ms) || sample.ms < 0 || (prev !== null && sample.ms < prev)) {
      throw new RangeError("createGestureMapper: ms must be an integer >= 0 and must not go back");
    }
    prev = sample.ms;
    if (owner === null) {
      if (sample.kind !== "down") return [];
      owner = sample.id; x0 = sample.x; y0 = sample.y; t0 = sample.ms; mode = "press";
      return [];
    }
    if (sample.id !== owner || sample.kind === "down") return [];
    const dx = sample.x - x0, dy = sample.y - y0;
    const far = dx * dx + dy * dy > opts.tapMaxPx * opts.tapMaxPx;
    if (mode === "press" && (far || sample.ms - t0 >= opts.holdMs)) mode = sample.ms - t0 >= opts.holdMs ? "box" : "drag";
    if (sample.kind !== "up") { if (sample.kind === "cancel") owner = null; return []; }
    const start = cell(x0, y0), end = cell(sample.x, sample.y);
    owner = null;
    if (mode === "box") return start !== null && end !== null ? [{ type: "BoxSelect", from: { c: start.c, r: start.r }, to: { c: end.c, r: end.r } }] : [];
    if (mode === "drag") return start !== null && end !== null && board.unitAt(start) !== undefined ? [aim(start), aim(end)] : [];
    return start === null ? [] : [aim(start)];
  };
}
