import type { Clock } from "../clock/types.ts";
import type { UnitHooks } from "../unit/types.ts";
import type { LogEntry } from "../log/types.ts";
import { ENGINE_EVENT_TYPES, type BusEvent, type BusLimits, type BusRecord, type EventBus, type EventMap, type EventRegistry, type NoModeEvents } from "./types.ts";

const CORE = new Set<string>(ENGINE_EVENT_TYPES);

/** Engine default (step 17): about 5x the longest BTF match measured (187 records), small enough for a phone. Makers pass their own. */
export const DEFAULT_BUS_LIMITS: BusLimits = { history: 1024 };

function off<T>(list: T[], fn: T): () => void {
  list.push(fn);
  return () => { const i = list.indexOf(fn); if (i >= 0) list.splice(i, 1); };
}

export function createBus<M extends EventMap<M> = NoModeEvents>(clock: Clock, registry?: EventRegistry<M>, limits: BusLimits = DEFAULT_BUS_LIMITS): EventBus<M> {
  const cap = limits.history;
  if (!Number.isInteger(cap) || cap < 0) throw new RangeError("createBus: history must be an integer >= 0");
  const mode = new Set<string>();
  for (const t of registry?.types ?? []) {
    if (CORE.has(t) || mode.has(t)) throw new RangeError("event type");
    mode.add(t);
  }
  const known = (type: string): boolean => CORE.has(type) || mode.has(type);
  let n = 0;
  const hist: BusRecord<M>[] = [];
  const by = new Map<string, ((e: BusEvent<M>, r: BusRecord<M>) => void)[]>();
  const anyLs: ((r: BusRecord<M>) => void)[] = [];
  const errLs: ((err: unknown) => void)[] = [];
  let dead = false;
  const report = (err: unknown): void => {
    for (const fn of errLs.slice()) if (errLs.includes(fn)) { try { fn(err); } catch { /* an onError throw is not reported */ } }
  };
  const each = <A extends unknown[]>(list: ((...args: A) => void)[], args: A): void => {
    for (const fn of list.slice()) if (list.includes(fn)) { try { fn(...args); } catch (err) { report(err); } }
  };
  return {
    emit(event) {
      if (!known(event.type)) throw new RangeError("unregistered event");
      if (dead) return;
      const rec: BusRecord<M> = { seq: ++n, tick: clock.tick(), event };
      hist.push(rec);
      if (hist.length > cap) hist.splice(0, hist.length - cap);
      each(by.get(event.type) ?? [], [event, rec]);
      each(anyLs, [rec]);
    },
    on(type, fn) {
      if (!known(type)) throw new RangeError("unregistered event");
      if (dead) return () => {};
      const list = by.get(type) ?? [];
      by.set(type, list);
      return off(list, fn);
    },
    onAny: (fn) => dead ? () => {} : off(anyLs, fn),
    onError: (fn) => dead ? () => {} : off(errLs, fn),
    isRegistered: known,
    history: () => hist.slice(),
    dispose() {
      if (dead) return;
      dead = true;
      for (const list of by.values()) list.length = 0;
      by.clear();
      anyLs.length = errLs.length = hist.length = 0;
    },
  };
}

export function unitEvents<M extends EventMap<M>>(bus: EventBus<M>): UnitHooks {
  return {
    landed: (unit, cell, cause) => bus.emit({ type: "landedOn", unit, cell, cause }),
    pushBlocked: (unit, blocker, cellsRemaining) => bus.emit({ type: "pushBlocked", unit, blocker, cellsRemaining }),
  };
}

export function logEvents<M extends EventMap<M>>(bus: EventBus<M>): (entry: LogEntry) => void {
  return (entry) => bus.emit({ type: "actionLogged", seq: entry.seq, kind: entry.action.kind, durationMs: entry.action.durationMs });
}
