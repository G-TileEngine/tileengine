                                         
import { brightPixels,            } from "./fx-light.js";
export const LOOK = { outlineOverPx: 6, cacheBytes: 16 * 2 ** 20, buckets: 16, liteBuckets: 8, up: 3 }         ;
export const lookSize = (fw        , fh        , look        )                           => {
  let w = fw, h = fh; if (/(?:^|\|)[rn]\d/.test(look)) { const s = Math.ceil(Math.hypot(fw, fh)); w = s; h = s; } if (/(?:^|\|)ol#/.test(look)) { w += 2; h += 2; } return { w, h };
};
export const turnTag = (deg                    , lite         )                => {
  if (typeof deg !== "number" || !Number.isFinite(deg)) return null;
  const n = lite ? LOOK.liteBuckets : LOOK.buckets, b = ((Math.round(deg / (360 / n)) % n) + n) % n;
  return b === 0 ? null : lite ? `n${b * 2}` : `r${b}`;
};
export const lookId = (id        , frame        , fw        , fh        , look        )         => `${id}~fx${frame}~${fw}x${fh}~${look}`;
const hexOf = (arg        )                                  => { const m = /^#([0-9a-f]{6})$/i.exec(arg); if (m?.[1] === undefined) return null; const n = Number.parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const pix = (p        , x        , y        )         => { if (x < 0 || y < 0 || x >= p.w || y >= p.h) return 0; const i = (y * p.w + x) * 4, a = p.data[i + 3] ?? 0; return a === 0 ? 0 : ((((p.data[i] ?? 0) << 24) | ((p.data[i + 1] ?? 0) << 16) | ((p.data[i + 2] ?? 0) << 8) | a) >>> 0); };
const put = (data                   , i        , c        )       => { data[i] = c >>> 24; data[i + 1] = (c >>> 16) & 255; data[i + 2] = (c >>> 8) & 255; data[i + 3] = c & 255; };
const scale3x = (src        )         => {
  const w = src.w * LOOK.up, h = src.h * LOOK.up, data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < src.h; y += 1) for (let x = 0; x < src.w; x += 1) {
    const B = pix(src, x, y - 1), D = pix(src, x - 1, y), E = pix(src, x, y), F = pix(src, x + 1, y), H = pix(src, x, y + 1), A = pix(src, x - 1, y - 1), C = pix(src, x + 1, y - 1), G = pix(src, x - 1, y + 1), I = pix(src, x + 1, y + 1);
    const e = [E, E, E, E, E, E, E, E, E];
    if (B !== H && D !== F) { e[0] = D === B ? D : E; e[1] = (D === B && E !== C) || (B === F && E !== A) ? B : E; e[2] = B === F ? F : E; e[3] = (D === B && E !== G) || (D === H && E !== A) ? D : E; e[5] = (B === F && E !== I) || (H === F && E !== C) ? F : E; e[6] = D === H ? D : E; e[7] = (D === H && E !== I) || (H === F && E !== G) ? H : E; e[8] = H === F ? F : E; }
    for (let k = 0; k < 9; k += 1) put(data, ((y * LOOK.up + ((k / 3) | 0)) * w + x * LOOK.up + (k % 3)) * 4, e[k] ?? E);
  }
  return { w, h, data };
};
const turned = (src        , tag        )         => {
  const rad = Number(tag.slice(1)) * 22.5 * Math.PI / 180, up = tag.startsWith("r"), big = up ? scale3x(src) : src, mul = up ? LOOK.up : 1, side = Math.ceil(Math.hypot(src.w, src.h)), data = new Uint8ClampedArray(side * side * 4), cs = Math.cos(rad), sn = Math.sin(rad);
  for (let y = 0; y < side; y += 1) for (let x = 0; x < side; x += 1) { const dx = x + 0.5 - side / 2, dy = y + 0.5 - side / 2; put(data, (y * side + x) * 4, pix(big, Math.floor((cs * dx + sn * dy + src.w / 2) * mul), Math.floor((-sn * dx + cs * dy + src.h / 2) * mul))); }
  return { w: side, h: side, data };
};
const ring = (src        , colour        )         => {
  const w = src.w + 2, h = src.h + 2, data = new Uint8ClampedArray(w * h * 4), c = hexOf(colour) ?? [255, 255, 255];
  for (let y = 0; y < src.h; y += 1) for (let x = 0; x < src.w; x += 1) { const j = (y * src.w + x) * 4; if ((src.data[j + 3] ?? 0) === 0) continue; const o = ((y + 1) * w + x + 1) * 4; data[o] = src.data[j] ?? 0; data[o + 1] = src.data[j + 1] ?? 0; data[o + 2] = src.data[j + 2] ?? 0; data[o + 3] = src.data[j + 3] ?? 0; }
  for (let y = 0; y < src.h; y += 1) for (let x = 0; x < src.w; x += 1) { const j = (y * src.w + x) * 4; if ((src.data[j + 3] ?? 0) === 0) continue; for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]         ) { const p = ((y + 1 + dy) * w + x + 1 + dx) * 4; if ((data[p + 3] ?? 0) !== 0) continue; data[p] = c[0]; data[p + 1] = c[1]; data[p + 2] = c[2]; data[p + 3] = 255; } }
  return { w, h, data };
};
export function recolour(src        , arg        , ramps                   )         {
  if (arg === "bright") return brightPixels(src, ramps);
  const data = new Uint8ClampedArray(src.data), c = arg === "white" ? [255, 255, 255] : arg === "black" ? [0, 0, 0] : hexOf(arg) ?? [255, 255, 255];
  for (let i = 0; i < data.length; i += 4) { if ((data[i + 3] ?? 0) === 0) continue; data[i] = c[0] ?? 255; data[i + 1] = c[1] ?? 255; data[i + 2] = c[2] ?? 255; }
  return { w: src.w, h: src.h, data };
}
                                                                                             
export function lookPixels(id        , source        , ramps                   )                     {
  const m = /^(.*)~fx(\d+)~(\d+)x(\d+)~(.+)$/.exec(id); if (m === null) return undefined;
  const fw = Number(m[3]), fh = Number(m[4]), src = source(m[1] ?? "", Number(m[2]), fw, fh); if (src === undefined || src.w !== fw || src.h !== fh) return undefined;
  let img = src; for (const tag of (m[5] ?? "").split("|")) { if (/^[rn]\d+$/.test(tag)) img = turned(img, tag); else if (tag.startsWith("hw:")) img = recolour(img, tag.slice(3), ramps); else if (tag.startsWith("ol#")) img = ring(img, tag.slice(2)); }
  return img;
}
export const pieceLook = (fw        , fh        , outline                    , blend                    , angle                    , ramp                          , lite         , hw               )                     => {
  const tags           = []; const turn = turnTag(angle, lite); if (turn !== null) tags.push(turn); if (hw !== null) tags.push(`hw:${hw}`);
  if (blend !== "add" && (outline === "on" || (outline === "auto" && (fw > LOOK.outlineOverPx || fh > LOOK.outlineOverPx)))) tags.push(`ol${ramp?.[0] ?? "#000000"}`);
  return tags.length > 0 ? tags.join("|") : undefined;
};
