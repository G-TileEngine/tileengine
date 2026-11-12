import type { ResolvedPlacement, Sq } from "../../types/core-types.ts";
import type { Grid } from "../grid/types.ts";
import type { Notice } from "../notice.ts";
import { cellOf } from "../plain.ts";
import type { OccupancyRule, PlaceResult, PushBlocker, UnitState, Units, UnitsOptions } from "./types.ts";

export const STRICT1: OccupancyRule = { id: "strict1", canHold: (_unit, occupants) => occupants.length === 0 };

type Live = {
  id: string; unitId: UnitState["unitId"]; side: UnitState["side"]; at: Sq;
  offset: UnitState["offset"]; facing: UnitState["facing"]; alive: boolean;
};

export function createUnits(grid: Grid, opts?: UnitsOptions): Units {
  const notices: Notice[] = [];
  if (opts?.occupancy !== undefined && opts.occupancy !== STRICT1.id) {
    notices.push({ code: "occupancyUnsupported", message: "occupancy unsupported" });
  }
  const pushIntoWalls = opts?.terrain?.push_into_walls === true;
  const hooks = opts?.hooks;
  const byId = new Map<string, Live>(), order: Live[] = [], occ = new Map<number, string[]>();
  let nextN = 0;
  const idsAt = (at: Sq): readonly string[] => (grid.inBounds(at) ? occ.get(grid.index(at)) ?? [] : []);
  const living = (at: Sq): UnitState[] => idsAt(at).flatMap((id) => { const u = byId.get(id); return u?.alive ? [u] : []; });
  const take = (id: string, at: Sq): void => {
    const key = grid.index(at), list = occ.get(key), i = list?.indexOf(id) ?? -1;
    if (list && i >= 0) list.splice(i, 1);
    if (list?.length === 0) occ.delete(key);
  };
  const put = (id: string, at: Sq): void => {
    const list = occ.get(grid.index(at)); if (list) list.push(id); else occ.set(grid.index(at), [id]);
  };
  const deny = (code: string, at: Sq, message: string): PlaceResult => {
    const notice: Notice = { code, message, at }; notices.push(notice); return { ok: false, notice };
  };
  const place = (p: ResolvedPlacement): PlaceResult => {
    const at = cellOf(p.at); if (at === null) { const notice: Notice = { code: "placeOffMap", message: "off map" }; notices.push(notice); return { ok: false, notice }; }
    if (!grid.inBounds(at)) return deny("placeOffMap", at, "off map");
    if (!grid.isOpen(at)) return deny("placeClosed", at, "closed cell");
    const draft: Live = { id: "", unitId: p.unitId, side: p.side, at, offset: null, facing: p.facing, alive: true };
    if (!STRICT1.canHold(draft, living(at))) return deny("placeOccupied", at, "cell taken");
    nextN += 1; draft.id = `${p.unitId}#${nextN}`;
    byId.set(draft.id, draft); order.push(draft); put(draft.id, at);
    hooks?.landed?.(draft.id, at, "place");
    return { ok: true, id: draft.id };
  };
  const moveTo: Units["moveTo"] = (id, to, cause = "move") => {
    const u = byId.get(id);
    if (!u) return { ok: false, reason: "unknownUnit" };
    if (!u.alive) return { ok: false, reason: "notAlive" };
    const cell = cellOf(to);
    if (cell === null || !grid.inBounds(cell)) return { ok: false, reason: "outOfBounds" };
    to = cell;
    if (u.at.c === to.c && u.at.r === to.r) return { ok: true, at: u.at };
    if (!grid.isOpen(to)) return { ok: false, reason: "closed" };
    if (!STRICT1.canHold(u, living(to))) return { ok: false, reason: "occupied" };
    take(id, u.at); u.at = to; put(id, to);
    hooks?.landed?.(id, to, cause);
    return { ok: true, at: to };
  };
  const push: Units["push"] = (id, dir, cells) => {
    const u = byId.get(id);
    if (!u) return { moved: 0, at: { c: -1, r: -1 }, blocker: null, cellsRemaining: 0 };
    if (!u.alive || !Number.isInteger(cells) || cells < 1) return { moved: 0, at: u.at, blocker: null, cellsRemaining: 0 };
    let at = u.at, moved = 0, blocker: PushBlocker | null = null;
    for (let n = 0; n < cells; n += 1) {
      const gate = grid.canForceInto(at, dir), nxt = grid.step(at, dir);
      if (!gate.ok || nxt === null) { blocker = gate.ok ? "edge" : gate.blocker; break; }
      if (!STRICT1.canHold(u, living(nxt))) { blocker = "unit"; break; }
      at = nxt; moved += 1;
    }
    if (moved > 0) { take(id, u.at); u.at = at; put(id, at); }
    const left = cells - moved;
    if (blocker !== null && pushIntoWalls) hooks?.pushBlocked?.(id, blocker, left);
    if (moved >= 1) hooks?.landed?.(id, u.at, "forced");
    return { moved, at: u.at, blocker, cellsRemaining: left };
  };
  const alive = (id: string): Live | undefined => { const u = byId.get(id); return u?.alive ? u : undefined; };
  return {
    occupancy: STRICT1.id, notices, place, moveTo, push,
    get: (id) => byId.get(id), all: () => order.slice(),
    occupantAt: (at) => idsAt(at)[0], occupantsAt: (at) => idsAt(at).slice(),
    setOffset: (id, offset) => { const u = alive(id); if (!u) return false; u.offset = offset; return true; },
    setFacing: (id, facing) => { const u = alive(id); if (!u) return false; u.facing = facing; return true; },
    remove: (id) => { const u = alive(id); if (!u) return false; u.alive = false; u.offset = null; take(id, u.at); return true; },
  };
}
