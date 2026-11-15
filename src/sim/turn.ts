import type { SimTimer } from "../core/clock/index.ts";
import { startFuse, type FuseSetting } from "../rules/turns/fuse.ts";
import { xGo, type Event, type Phase } from "../state/index.ts";
import { saveMatch } from "./run.ts";
import type { SimWorld, TurnState } from "./types.ts";

export type TurnOptions = { readonly fuse: FuseSetting; readonly onFuse?: (to: Phase) => void };
export type SaveMeta = { readonly projectId: string; readonly savedAt: string };
export type Turn = { go(e: Event): Phase; save(meta: SaveMeta, done: (text: string) => void): boolean; readonly undo: TurnState["undo"]; readonly pendingFuse: boolean; readonly settled: boolean; dispose(): void };
const FUSE: Event = { type: "FUSE_EXPIRE" };

export function createTurn(world: SimWorld, opts: TurnOptions): Turn {
  if (opts.fuse !== "off" && (typeof opts.fuse !== "number" || !Number.isInteger(opts.fuse) || opts.fuse <= 0)) throw new RangeError("createTurn: fuse must be off or an integer > 0");
  let sel: string | null = world.turn?.sel ?? null, undo: TurnState["undo"] = world.turn?.undo ?? null, due: number | null = world.turn?.fuseDueMs ?? null, pending = false, timer: SimTimer | null = null;
  const waiting: { meta: SaveMeta; done: (text: string) => void }[] = [];
  const write = (): void => { world.turn = { sel, undo, fuseDueMs: due }; };
  const battle = (): Phase => { const p = world.phases.battle; if (p === undefined) throw new Error("turn: battle phase missing"); return p; };
  const halt = (): void => { timer?.cancel(); timer = null; due = null; };
  const calm = (): boolean => { const p = battle(); return p !== "moving" && p !== "resolving" && !pending; };
  const drain = (): void => { for (const item of waiting.splice(0)) item.done(saveMatch(world, item.meta)); };
  const land = (from: Phase): void => {
    const to = xGo(from, FUSE); halt();
    if (to === from) { if (from !== "sideEnd" && from !== "play.result") pending = true; write(); return; }
    if (from === "actMenu") undo = null;
    pending = false; world.phases = { ...world.phases, battle: to }; write(); opts.onFuse?.(to); if (calm()) drain();
  };
  const armFull = (): void => { timer?.cancel(); timer = startFuse(world.clock, opts.fuse, () => land(battle())); due = timer?.dueMs ?? null; };
  const armLeft = (at: number): void => { timer?.cancel(); timer = world.clock.after(at - world.clock.now(), () => land(battle())); due = timer.dueMs; };
  if (due !== null) armLeft(due);
  write();
  return {
    go(e: Event): Phase {
      const from = battle();
      if (e.type === "FUSE_EXPIRE") { land(from); return battle(); }
      let to = xGo(from, e);
      if (to === from) return from;
      if (e.type === "SELECT_UNIT") sel = e.unitId;
      else if (e.type === "CANCEL" && to === "idle") sel = null;
      else if (e.type === "TAP_MOVE_CELL" && sel !== null) { const u = world.units.get(sel); if (u !== undefined) undo = { unitId: sel, at: { c: u.at.c, r: u.at.r } }; }
      if (from === "actMenu" && to !== "actMenu") undo = null;
      let told = false;
      if (e.type === "SIDE_BEGIN" || to === "sideEnd" || to === "play.result") { pending = false; halt(); }
      else if (pending) { const landed = xGo(to, FUSE); if (landed !== to) { if (to === "actMenu") undo = null; to = landed; pending = false; halt(); told = true; } }
      if (e.type === "SIDE_BEGIN") armFull();
      world.phases = { ...world.phases, battle: to }; write(); if (told) opts.onFuse?.(to); if (calm()) drain(); return to;
    },
    save(meta: SaveMeta, done: (text: string) => void): boolean {
      if (typeof meta?.projectId !== "string" || typeof meta?.savedAt !== "string" || typeof done !== "function") throw new RangeError("turn.save: projectId and savedAt must be strings and done a function");
      if (calm()) { done(saveMatch(world, meta)); return true; }
      waiting.push({ meta, done }); return false;
    },
    get undo(): TurnState["undo"] { return undo; },
    get pendingFuse(): boolean { return pending; },
    get settled(): boolean { return calm(); },
    dispose(): void { halt(); pending = false; waiting.length = 0; write(); },
  };
}
