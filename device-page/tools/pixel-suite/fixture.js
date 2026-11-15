// Step 34b pixel fixture (L1 in Node, L2 in browsers): three fixed frames of one scene at s 1-3 with letterbox. Pure: no DOM, no wall time.
import { canvas2d,                 } from "../../src/runtime/canvas/canvas2d.js";
import { buildDrawList, fitView, present, snapCamera,                  } from "../../src/runtime/render/index.js";
                                                               
const sheet = (rgb                   )         => { const px = new Uint32Array(64 * 16); for (let i = 0; i < px.length; i += 1) px[i] = (0xff000000 | ((rgb[Math.floor((i % 64) / 16)] ?? 0) ^ ((((i % 64) + (i >> 6)) & 3) === 0 ? 0x183018 : 0))) >>> 0; return { w: 64, h: 16, px }; };
export const RASTERS                                   = { g: sheet([0x2a4f6e, 0x3c7a3a, 0x8a6d3b, 0x5b5b66]), a: sheet([0xd0d0d0, 0xb03030, 0x30b0a0, 0xe0c040]) };
const cells = (n        , at                              )                    => Array.from({ length: n }, (_, i) => at(i));
export const SCENE              = { cols: 20, rows: 12, tileW: 16, tileH: 16, mapSeed: 1, overlays: [], standing: [{ kind: "object", sheet: { id: "a", fw: 16, fh: 16, columns: 4 }, c: 6, r: 5 }],
  ground: [{ sheet: { id: "g", fw: 16, fh: 16, columns: 4 }, tiles: cells(240, (i) => (i * 7 + (i >> 3)) % 4) }], above: [{ sheet: { id: "a", fw: 16, fh: 16, columns: 4 }, tiles: cells(240, (i) => (i % 9 === 0 ? 3 : null)) }] };
export const VIEW = { w: 150, h: 98, clear: "#203040" }         ;
export const L1 = ["1:150x98:04b5748d", "2:150x98:6865666d", "3:150x98:846e2223"]         ; // the recording canvas's frames (pinned in tests/runtime/perf-34b.test.ts)
export const CAMS                                                 = [[0, 0, 1], [17, 9, 2], [40, 23, 3]];
export const fnv = (px                   )         => { let h = 0x811c9dc5; for (let i = 0; i < px.length; i += 1) h = Math.imul(h ^ (px[i] ?? 0), 0x01000193) >>> 0; return h.toString(16).padStart(8, "0"); };
/** Draws each camera's frame on `canvas` and hashes `read()` (ARGB per pixel, row-major). */
export function frames(canvas            , makeCanvas                                      , images                                    , read                         )           {
  return CAMS.map(([x, y, s]) => { const r = canvas2d(canvas, { images, makeCanvas, buildsPerFrame: 100 }), fit = fitView(VIEW.w, VIEW.h, s, 16, 16); r.world(SCENE, 1); present(r, fit, buildDrawList(SCENE, fit, snapCamera(x, y, s), 0, 10), VIEW.clear); const hash = fnv(read()); r.dispose(); return `${s}:${fit.devW}x${fit.devH}:${hash}`; });
}
