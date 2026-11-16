/** The one engine clock (BUILD_GUIDE §2 law 1, MODES-v1 M1, CN-001). Sim time is integer ms: ticks × stepMs. */
import type { Notice } from "../notice.ts";

export type ClockOptions = {
  readonly stepMs?: number;      // integer ≥ 1; fixed sim step; default 10
  readonly maxFrameMs?: number;  // integer ≥ 1; a host delta above this is clamped; default 100
  readonly timeScale?: number;   // default 1; see setTimeScale
  readonly maxSkipMs?: number;   // integer 1..86400000 (24 h); anything else is 8 h. Sim time, not host ms.
};
export type TickInfo = { readonly tick: number; readonly simMs: number; readonly stepMs: number };
export type RenderInfo = { readonly simMs: number; readonly alpha: number; readonly dtMs: number };
export type SimTimer = { readonly id: number; readonly dueMs: number; cancel(): void };
export type Unsubscribe = () => void;
export type SkipResult = { readonly remainderMs: number; readonly notice?: Notice };

export interface Clock {
  advance(dtMs: number): void;
  step(): void;
  /** Step 29: runs the ticks `ms` of host time is worth (timeScale applied) at once (rAF pile-up, tab return). With no tick subscriber it jumps straight between due timers; timers fire in the same order as advance. No-op while paused. G4: at most maxSkipMs of sim time per call; the unused host ms come back. */
  skip(ms: number): SkipResult;
  pause(): void;
  resume(): void;
  readonly paused: boolean;
  setTimeScale(x: number): void;
  readonly timeScale: number;
  now(): number;
  tick(): number;
  readonly stepMs: number;
  readonly maxSkipMs: number;
  onTick(cb: (t: TickInfo) => void): Unsubscribe;
  onRender(cb: (r: RenderInfo) => void): Unsubscribe;
  after(ms: number, cb: () => void): SimTimer;
  onError(cb: (err: unknown) => void): Unsubscribe;
  /** Step 17: cancels and drops every timer and subscriber; later `after` / `on…` store nothing. Time still counts. Safe to call twice. */
  dispose(): void;
}
