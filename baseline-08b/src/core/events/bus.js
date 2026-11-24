                                               
                                                  
                                                
import { ENGINE_EVENT_TYPES,                                                                                                                    } from "./types.js";

const CORE = new Set        (ENGINE_EVENT_TYPES);

/** Engine default (step 17): about 5x the longest BTF match measured (187 records), small enough for a phone. Makers pass their own. */
export const DEFAULT_BUS_LIMITS            = { history: 1024 };

function off   (list     , fn   )             {
  list.push(fn);
  return () => { const i = list.indexOf(fn); if (i >= 0) list.splice(i, 1); };
}

export function createBus                                      (clock       , registry                   , limits            = DEFAULT_BUS_LIMITS)              {
  const cap = limits.history;
  if (!Number.isInteger(cap) || cap < 0) throw new RangeError("createBus: history must be an integer >= 0");
  const mode = new Set        ();
  for (const t of registry?.types ?? []) {
    if (CORE.has(t) || mode.has(t)) throw new RangeError("event type");
    mode.add(t);
  }
  const known = (type        )          => CORE.has(type) || mode.has(type);
  let n = 0;
  const hist                 = [];
  const by = new Map                                                       ();
  const anyLs                                = [];
  const errLs                             = [];
  let dead = false;
  const report = (err         )       => {
    for (const fn of errLs.slice()) if (errLs.includes(fn)) { try { fn(err); } catch { /* an onError throw is not reported */ } }
  };
  const each =                      (list                          , args   )       => {
    for (const fn of list.slice()) if (list.includes(fn)) { try { fn(...args); } catch (err) { report(err); } }
  };
  return {
    emit(event) {
      if (!known(event.type)) throw new RangeError("unregistered event");
      if (dead) return;
      const rec               = { seq: ++n, tick: clock.tick(), event };
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

export function unitEvents                       (bus             )            {
  return {
    landed: (unit, cell, cause) => bus.emit({ type: "landedOn", unit, cell, cause }),
    pushBlocked: (unit, blocker, cellsRemaining) => bus.emit({ type: "pushBlocked", unit, blocker, cellsRemaining }),
  };
}

export function logEvents                       (bus             )                            {
  return (entry) => bus.emit({ type: "actionLogged", seq: entry.seq, kind: entry.action.kind, durationMs: entry.action.durationMs });
}
