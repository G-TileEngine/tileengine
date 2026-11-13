export type Pixels = { readonly w: number; readonly h: number; readonly data: Uint8ClampedArray };
export const SWAY_LOOP = [[0, 0], [0, -1], [1, -1], [1, 0]] as const;
export const SWAY_EDGE_PX = 2, WIND_PX_PER_S = 45;

const put = (src: Uint8ClampedArray, si: number, dst: Uint8ClampedArray, di: number): void => { dst[di] = src[si] ?? 0; dst[di + 1] = src[si + 1] ?? 0; dst[di + 2] = src[si + 2] ?? 0; dst[di + 3] = src[si + 3] ?? 0; };

export function cycleFrames(img: Pixels, ramp: readonly number[]): Pixels[] {
  if (ramp.length < 2 || new Set(ramp).size !== ramp.length) return [];
  const frames: Pixels[] = [img];
  for (let n = 1; n < ramp.length; n += 1) {
    const data = new Uint8ClampedArray(img.data);
    for (let i = 0; i < data.length; i += 4) {
      if ((data[i + 3] ?? 0) === 0) continue;
      const hit = ramp.findIndex((c) => data[i] === ((c >> 16) & 255) && data[i + 1] === ((c >> 8) & 255) && data[i + 2] === (c & 255));
      const to = hit < 0 ? -1 : ramp[(hit + n) % ramp.length];
      if (to === undefined || to < 0) continue;
      data[i] = (to >> 16) & 255; data[i + 1] = (to >> 8) & 255; data[i + 2] = to & 255;
    }
    frames.push({ w: img.w, h: img.h, data });
  }
  return frames;
}

export function scrollFrames(img: Pixels, step: number, axis: "x" | "y" = "x"): Pixels[] {
  const size = axis === "y" ? img.h : img.w;
  if (!Number.isInteger(step) || step < 1 || step > size || size % step !== 0) return [];
  const frames: Pixels[] = [];
  for (let f = 0; f < size / step; f += 1) {
    if (f === 0) { frames.push(img); continue; }
    const shift = f * step, data = new Uint8ClampedArray(img.w * img.h * 4);
    for (let y = 0; y < img.h; y += 1) for (let x = 0; x < img.w; x += 1) {
      const sx = axis === "y" ? x : (x - shift + img.w) % img.w, sy = axis === "y" ? (y - shift + img.h) % img.h : y;
      put(img.data, (sy * img.w + sx) * 4, data, (y * img.w + x) * 4);
    }
    frames.push({ w: img.w, h: img.h, data });
  }
  return frames;
}

export function swayFrames(img: Pixels, trunkFrom: number, edge = SWAY_EDGE_PX): Pixels[] {
  const { w, h, data } = img, n = w * h, dist = new Uint8Array(n).fill(255), q: number[] = [];
  for (let i = 0; i < n; i += 1) if ((data[i * 4 + 3] ?? 0) === 0) { dist[i] = 0; q.push(i); }
  for (let qi = 0; qi < q.length; qi += 1) {
    const i = q[qi] ?? 0, d0 = (dist[i] ?? 255) + 1;
    if (d0 > edge) continue;
    const x = i % w, y = (i / w) | 0, see = (nx: number, ny: number): void => {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
      const j = ny * w + nx;
      if ((dist[j] ?? 255) <= d0) return;
      dist[j] = d0; q.push(j);
    };
    see(x - 1, y); see(x + 1, y); see(x, y - 1); see(x, y + 1);
  }
  const move = new Uint8Array(n);
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
    const i = y * w + x;
    move[i] = y < trunkFrom && (data[i * 4 + 3] ?? 0) !== 0 && Math.min(dist[i] ?? 255, Math.min(x, y, w - 1 - x, h - 1 - y) + 1) <= edge ? 1 : 0;
  }
  return SWAY_LOOP.map(([dx, dy]) => {
    if (dx === 0 && dy === 0) return img;
    const out = new Uint8ClampedArray(data);
    for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
      if (move[y * w + x] !== 1) continue;
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      put(data, (y * w + x) * 4, out, (ny * w + nx) * 4);
    }
    return { w, h, data: out };
  });
}

export function waveOffsetMs(xArt: number, loopMs: number, pxPerS = WIND_PX_PER_S): number {
  if (!Number.isFinite(xArt) || !Number.isFinite(loopMs) || !Number.isFinite(pxPerS) || loopMs <= 0 || pxPerS <= 0) return 0;
  const mod = ((Math.floor((xArt * 1000) / pxPerS) % loopMs) + loopMs) % loopMs;
  return (loopMs - mod) % loopMs;
}
