import { startMatch } from "../play-stage/page.js";
import { openCheckpoint, openShop, shopFiles } from "./checkpoint.js";
import { arriveIn } from "../play-stage/project.js";
import { canvasMbOf, heapPeakOf, readout, RUN_MS } from "./readout.js";
const read = document.querySelector("#read");
if (!(read instanceof HTMLElement)) throw new Error("baseline: #read");
const board = document.createElement("canvas"); board.id = "board"; document.body.prepend(board);
const scene = new URLSearchParams(location.search).get("scene"), opened = scene === "shop" ? openShop() : openCheckpoint();
if (opened.docs === null) read.textContent = `baseline: the checkpoint did not open\n${opened.error}`;
else {
  const host = window.requestAnimationFrame.bind(window); let t0 = 0, prev = -1, peak                = null, lock = false; const gaps           = [], swaps           = [];
  const note = (ts        )       => {
    if (lock) return; if (t0 === 0) t0 = ts; if (prev >= 0 && ts - t0 < RUN_MS) gaps.push(ts - prev); prev = ts;
    peak = heapPeakOf(peak, (performance                                                       ).memory?.usedJSHeapSize);
    read.textContent = readout({ gaps, elapsedMs: ts - t0, canvasMb: canvasMbOf([...document.querySelectorAll("canvas")].map((el) => ({ width: el.width, height: el.height }))), heapMb: peak, dpr: devicePixelRatio || 1, ...(scene === "shop" ? { swaps, scene: "shop" } : {}) });
    if (read.textContent.startsWith("DONE")) lock = true;
  };
  window.requestAnimationFrame = (cb) => host((ts) => { note(ts); cb(ts); });
  const travel                                   = (link, party) => { const got = arriveIn(shopFiles(), link.from, link.to, party); if (got.docs === null) { read.textContent = got.error; return; } swaps.push(gaps.length); document.querySelector("#board")?.remove(); document.querySelector("#hud")?.remove(); const next = document.createElement("canvas"); next.id = "board"; document.body.prepend(next); startMatch(got.docs, undefined, undefined, travel); };
  if (scene === "shop") startMatch(opened.docs, undefined, undefined, travel); else startMatch(opened.docs);
}
