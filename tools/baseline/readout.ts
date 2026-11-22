export const RUN_MS = 60_000, DROP_MS = 25, BAD_MS = 50, GC_LINE = "GC: n/a (browsers don't expose it)";
export type FrameStats = { readonly p50: number; readonly p95: number; readonly max: number; readonly dropped: number; readonly over50: number; readonly n: number };
export function framesOf(gaps: readonly number[]): FrameStats {
  const s = [...gaps].sort((a, b) => a - b), n = s.length;
  if (n === 0) return { p50: 0, p95: 0, max: 0, dropped: 0, over50: 0, n: 0 };
  let dropped = 0, over50 = 0; for (const v of s) { if (v > DROP_MS) dropped += 1; if (v > BAD_MS) over50 += 1; }
  return { p50: s[Math.floor(n * 0.5)] ?? 0, p95: s[Math.floor(n * 0.95)] ?? 0, max: s[n - 1] ?? 0, dropped, over50, n };
}
export function canvasMbOf(sizes: readonly { readonly width: number; readonly height: number }[]): number {
  let bytes = 0; for (const box of sizes) bytes += box.width * box.height * 4; return bytes / 1_048_576;
}
export function heapPeakOf(peak: number | null, used: number | undefined): number | null {
  return typeof used === "number" && Number.isFinite(used) ? Math.max(peak ?? 0, used / 1_048_576) : peak;
}
export function readout(input: { readonly gaps: readonly number[]; readonly elapsedMs: number; readonly canvasMb: number; readonly heapMb: number | null; readonly dpr: number }): string {
  const f = framesOf(input.gaps), heap = input.heapMb === null ? "n/a" : input.heapMb.toFixed(1), head = input.elapsedMs >= RUN_MS ? "DONE\n" : "";
  return `${head}baseline 06c · Skirmish (checkpoint.tileproj)\nframe ms p50 ${f.p50.toFixed(1)} p95 ${f.p95.toFixed(1)} max ${f.max.toFixed(1)}\ndropped (>25 ms) ${f.dropped} over 50 ms ${f.over50} of ${f.n}\ncanvas MB ${input.canvasMb.toFixed(1)} · dpr ${input.dpr.toFixed(1)}\nheap MB peak ${heap}\n${GC_LINE}`;
}
