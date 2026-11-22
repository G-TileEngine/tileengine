import { startMatch } from "../play-stage/page.ts";
import { openCheckpoint } from "./checkpoint.ts";
import { canvasMbOf, heapPeakOf, readout, RUN_MS } from "./readout.ts";
const read = document.querySelector("#read");
if (!(read instanceof HTMLElement)) throw new Error("baseline: #read");
const board = document.createElement("canvas"); board.id = "board"; document.body.prepend(board);
const opened = openCheckpoint();
if (opened.docs === null) read.textContent = `baseline: the checkpoint did not open\n${opened.error}`;
else {
  const host = window.requestAnimationFrame.bind(window); let t0 = 0, prev = -1, peak: number | null = null, lock = false; const gaps: number[] = [];
  const note = (ts: number): void => {
    if (lock) return; if (t0 === 0) t0 = ts; if (prev >= 0 && ts - t0 < RUN_MS) gaps.push(ts - prev); prev = ts;
    peak = heapPeakOf(peak, (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize);
    read.textContent = readout({ gaps, elapsedMs: ts - t0, canvasMb: canvasMbOf([...document.querySelectorAll("canvas")].map((el) => ({ width: el.width, height: el.height }))), heapMb: peak, dpr: devicePixelRatio || 1 });
    if (read.textContent.startsWith("DONE")) lock = true;
  };
  window.requestAnimationFrame = (cb) => host((ts) => { note(ts); cb(ts); });
  startMatch(opened.docs);
}
