export function xGo(from: string, _e: unknown): string { return from; }
const snap = { phase: "idle" };
const next = { ...snap, phase: xGo(snap.phase, {}) };
if (snap.phase === next.phase) { /* compare is fine */ }
