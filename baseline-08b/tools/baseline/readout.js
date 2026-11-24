export const RUN_MS = 60_000, DROP_MS = 25, BAD_MS = 50, GC_LINE = "GC: n/a (browsers don't expose it)";
                                                                                                                                                                     
export function framesOf(gaps                   )             {
  const s = [...gaps].sort((a, b) => a - b), n = s.length;
  if (n === 0) return { p50: 0, p95: 0, max: 0, dropped: 0, over50: 0, n: 0 };
  let dropped = 0, over50 = 0; for (const v of s) { if (v > DROP_MS) dropped += 1; if (v > BAD_MS) over50 += 1; }
  return { p50: s[Math.floor(n * 0.5)] ?? 0, p95: s[Math.floor(n * 0.95)] ?? 0, max: s[n - 1] ?? 0, dropped, over50, n };
}
export function canvasMbOf(sizes                                                                )         {
  let bytes = 0; for (const box of sizes) bytes += box.width * box.height * 4; return bytes / 1_048_576;
}
export function heapPeakOf(peak               , used                    )                {
  return typeof used === "number" && Number.isFinite(used) ? Math.max(peak ?? 0, used / 1_048_576) : peak;
}
export function readout(input                                                                                                                                                                                                                )         {
  const f = framesOf(input.gaps), heap = input.heapMb === null ? "n/a" : input.heapMb.toFixed(1), head = input.elapsedMs >= RUN_MS ? "DONE\n" : "", worst = (input.swaps ?? []).reduce((m, i) => Math.max(m, input.gaps[i] ?? 0, input.gaps[i + 1] ?? 0, input.gaps[i + 2] ?? 0), 0);
  return `${head}${input.scene === "shop" ? "baseline 06c · Shop stairs (?scene=shop)" : "baseline 06c · Skirmish (checkpoint.tileproj)"}\nframe ms p50 ${f.p50.toFixed(1)} p95 ${f.p95.toFixed(1)} max ${f.max.toFixed(1)}\ndropped (>25 ms) ${f.dropped} over 50 ms ${f.over50} of ${f.n}\ncanvas MB ${input.canvasMb.toFixed(1)} · dpr ${input.dpr.toFixed(1)}\nheap MB peak ${heap}\n${GC_LINE}${input.swaps === undefined ? "" : `\nstage changes ${input.swaps.length}\nworst ms in 3 frames after a swap ${worst.toFixed(1)}`}`;
}
