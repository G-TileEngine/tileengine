import type { Clock, ClockOptions, RenderInfo, SimTimer, TickInfo, Unsubscribe } from "./types.ts";
import { isRecord, plainCopy } from "../plain.ts";

const DEFAULT_STEP_MS = 10;
const DEFAULT_MAX_FRAME_MS = 100;

type LiveTimer = { id: number; dueMs: number; cb: () => void; dead: boolean };

function intAtLeast1(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isInteger(value) && value >= 1 ? value : fallback;
}

export function createClock(opts?: ClockOptions): Clock {
  const raw = plainCopy(opts, 1);
  opts = isRecord(raw) ? raw as ClockOptions : undefined;
  const stepMs = intAtLeast1(opts?.stepMs, DEFAULT_STEP_MS);
  const maxFrameMs = intAtLeast1(opts?.maxFrameMs, DEFAULT_MAX_FRAME_MS);
  const stepQ = stepMs * 4;
  let accQ = 0;
  let scaleQ = 4;
  let tickN = 0;
  let paused = false;
  let nextId = 1;
  let dead = false;
  const timers: LiveTimer[] = [];
  const tickSubs: ((t: TickInfo) => void)[] = [];
  const renderSubs: ((r: RenderInfo) => void)[] = [];
  const errorSubs: ((err: unknown) => void)[] = [];

  function report(err: unknown): void {
    for (const cb of errorSubs.slice()) {
      if (!errorSubs.includes(cb)) continue;
      try { cb(err); } catch { /* an onError throw is not reported again */ }
    }
  }

  function listen<T>(list: T[], cb: T): Unsubscribe {
    if (dead) return () => {};
    list.push(cb);
    return () => {
      const i = list.indexOf(cb);
      if (i >= 0) list.splice(i, 1);
    };
  }

  function fireDue(simMs: number): void {
    const due = timers.filter((t) => !t.dead && t.dueMs <= simMs).sort((a, b) => a.dueMs - b.dueMs || a.id - b.id);
    for (const t of due) {
      if (t.dead) continue;
      t.dead = true;
      try { t.cb(); } catch (err) { report(err); }
    }
    for (let i = timers.length - 1; i >= 0; i -= 1) {
      if (timers[i]?.dead === true) timers.splice(i, 1);
    }
  }

  function runTick(): void {
    tickN += 1;
    const simMs = tickN * stepMs;
    fireDue(simMs);
    const info: TickInfo = { tick: tickN, simMs, stepMs };
    for (const cb of tickSubs.slice()) {
      if (!tickSubs.includes(cb)) continue;
      try { cb(info); } catch (err) { report(err); }
    }
  }

  function render(dtMs: number): void {
    const info: RenderInfo = { simMs: tickN * stepMs, alpha: paused ? 0 : accQ / stepQ, dtMs };
    for (const cb of renderSubs.slice()) {
      if (!renderSubs.includes(cb)) continue;
      try { cb(info); } catch (err) { report(err); }
    }
  }

  function setTimeScale(x: number): void {
    if (!Number.isFinite(x)) { scaleQ = 0; return; }
    scaleQ = Math.min(32, Math.max(0, Math.round(x * 4)));
  }

  if (opts?.timeScale !== undefined) setTimeScale(opts.timeScale);

  return {
    advance(dtMs: number): void {
      if (!Number.isInteger(dtMs) || dtMs < 0) throw new RangeError("advance: dtMs must be an integer >= 0");
      const dt = dtMs < maxFrameMs ? dtMs : maxFrameMs;
      if (!paused) {
        accQ += dt * scaleQ;
        while (accQ >= stepQ) { accQ -= stepQ; runTick(); }
      }
      render(dt);
    },
    skip(ms: number): void {
      if (!Number.isInteger(ms) || ms < 0) throw new RangeError("skip: ms must be an integer >= 0");
      if (paused) return;
      const end = tickN + Math.floor((ms * scaleQ) / stepQ);
      while (tickN < end) {
        if (tickSubs.length > 0) { runTick(); continue; }
        let next = end;
        for (const t of timers) { if (t.dead) continue; const at = Math.max(tickN + 1, Math.ceil(t.dueMs / stepMs)); if (at < next) next = at; }
        tickN = next; fireDue(tickN * stepMs);
        if (tickSubs.length > 0) { const info: TickInfo = { tick: tickN, simMs: tickN * stepMs, stepMs }; for (const cb of tickSubs.slice()) { if (!tickSubs.includes(cb)) continue; try { cb(info); } catch (err) { report(err); } } }
      }
      render(ms); // step 30 ruling: render subscribers get the skipped host time as dtMs (not clamped to maxFrameMs)
    },
    step(): void { runTick(); render(0); },
    pause(): void { paused = true; accQ = 0; },
    resume(): void { paused = false; },
    get paused(): boolean { return paused; },
    setTimeScale,
    get timeScale(): number { return scaleQ / 4; },
    now(): number { return tickN * stepMs; },
    tick(): number { return tickN; },
    get stepMs(): number { return stepMs; },
    onTick(cb): Unsubscribe { return listen(tickSubs, cb); },
    onRender(cb): Unsubscribe { return listen(renderSubs, cb); },
    after(ms: number, cb: () => void): SimTimer {
      if (!Number.isInteger(ms) || ms < 0 || typeof cb !== "function") {
        report(new RangeError("after: ms must be an integer >= 0 and cb a function"));
        return { id: 0, dueMs: -1, cancel() {} };
      }
      const id = nextId;
      nextId += 1;
      const dueMs = tickN * stepMs + (ms > stepMs ? ms : stepMs);
      if (dead) return { id, dueMs, cancel() {} };
      const timer: LiveTimer = { id, dueMs, cb, dead: false };
      timers.push(timer);
      return { id, dueMs, cancel(): void { timer.dead = true; } };
    },
    onError(cb): Unsubscribe { return listen(errorSubs, cb); },
    dispose() {
      if (dead) return;
      dead = true;
      for (const t of timers) t.dead = true;
      timers.length = tickSubs.length = renderSubs.length = errorSubs.length = 0;
    },
  };
}
