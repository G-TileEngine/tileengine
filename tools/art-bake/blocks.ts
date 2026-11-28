export const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi);

export function roundEven(v: number): number {
  const f = Math.floor(v);
  const frac = v - f;
  if (frac < 0.5) {
    return f;
  }
  if (frac > 0.5) {
    return f + 1;
  }
  return f % 2 === 0 ? f : f + 1;
}

export function hash2(i: number, j: number, s: number): number {
  const h = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(s, 1442695041)) >>> 0;
  const m = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((m ^ (m >>> 16)) >>> 0) / 4294967296;
}

export function vnoise(x: number, y: number, sc: number, s: number): number {
  const u = x / sc;
  const v = y / sc;
  const i = Math.floor(u);
  const j = Math.floor(v);
  const fx = u - i;
  const fy = v - j;
  const a = hash2(i, j, s);
  const b = hash2(i + 1, j, s);
  const c = hash2(i, j + 1, s);
  const d = hash2(i + 1, j + 1, s);
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

export function fbm(x: number, y: number, sc: number, s: number, oct = 4): number {
  let t = 0;
  let amp = 1;
  let tot = 0;
  for (let o = 0; o < oct; o++) {
    t = t + amp * vnoise(x, y, sc / 2 ** o, s + o * 31);
    tot += amp;
    amp *= 0.5;
  }
  return t / tot;
}

const NORM = Math.sqrt(0.55 * 0.55 + 0.62 * 0.62 + 0.56 * 0.56);
export const LIGHT = [-0.55 / NORM, -0.62 / NORM, 0.56 / NORM] as const;

export function sphere(nx: number, ny: number): number {
  const z = Math.sqrt(clamp(1 - nx * nx - ny * ny, 0, 1));
  return 0.5 + 0.5 * (nx * LIGHT[0] + ny * LIGHT[1] + z * LIGHT[2]);
}

export const band = (t: number, n: number): number => roundEven(clamp(t, 0, 1) * (n - 1));
