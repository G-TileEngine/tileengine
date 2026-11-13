export type Blockers = { readonly cols: number; readonly rows: number; readonly blocks: ArrayLike<number | boolean> };
const NEAR = [0, -1, 1, 0, 0, 1, -1, 0, 1, -1, 1, 1, -1, 1, -1, -1];
const OCT = [1, 0, 0, 1, 0, 1, 1, 0, 0, -1, 1, 0, -1, 0, 0, 1, -1, 0, 0, -1, 0, -1, -1, 0, 0, 1, -1, 0, 1, 0, 0, -1];

export function openCell(g: Blockers, c: number, r: number): { c: number; r: number } | null {
  const open = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < g.cols && y < g.rows && !g.blocks[y * g.cols + x];
  if (open(c, r)) return { c, r };
  for (let i = 0; i < 16; i += 2) { const x = c + (NEAR[i] ?? 0), y = r + (NEAR[i + 1] ?? 0); if (open(x, y)) return { c: x, r: y }; }
  return null;
}

export function visibleCells(g: Blockers, c: number, r: number, radius: number): Uint8Array {
  const out = new Uint8Array(g.cols * g.rows), r2 = radius * radius;
  const wall = (x: number, y: number): boolean => x < 0 || y < 0 || x >= g.cols || y >= g.rows || !!g.blocks[y * g.cols + x];
  const mark = (x: number, y: number): void => { if (x >= 0 && y >= 0 && x < g.cols && y < g.rows) out[y * g.cols + x] = 1; };
  const cast = (row: number, start: number, end: number, xx: number, xy: number, yx: number, yy: number): void => {
    if (start <= end) return;
    for (let j = row; j <= radius; j += 1) {
      let dx = -j - 1, stop = false, next = 0; const dy = -j;
      while (dx <= 0) {
        dx += 1;
        const x = c + dx * xx + dy * xy, y = r + dx * yx + dy * yy, ls = (dx - 0.5) / (dy + 0.5), rs = (dx + 0.5) / (dy - 0.5);
        if (start < rs) continue;
        if (end > ls) break;
        if (dx * dx + dy * dy <= r2) mark(x, y);
        if (stop) { if (wall(x, y)) { next = rs; continue; } stop = false; start = next; }
        else if (wall(x, y) && j < radius) { stop = true; cast(j + 1, start, ls, xx, xy, yx, yy); next = rs; }
      }
      if (stop) break;
    }
  };
  mark(c, r);
  for (let i = 0; i < 32; i += 4) cast(1, 1, 0, OCT[i] ?? 0, OCT[i + 1] ?? 0, OCT[i + 2] ?? 0, OCT[i + 3] ?? 0);
  return out;
}

export function createSight(): { mask(g: Blockers, c: number, r: number, radius: number): Uint8Array; readonly stats: { computed: number } } {
  const stats = { computed: 0 }, ids = new WeakMap<object, number>(), cache = new Map<string, Uint8Array>();
  let n = 0;
  return {
    stats,
    mask(g, c, r, radius) {
      const blocks = g.blocks as object, id = ids.get(blocks) ?? (ids.set(blocks, ++n), n), key = `${id}:${c}:${r}:${radius}:${g.cols}`, hit = cache.get(key);
      if (hit !== undefined) return hit;
      if (cache.size >= 256) cache.clear();
      const made = visibleCells(g, c, r, radius);
      cache.set(key, made); stats.computed += 1;
      return made;
    },
  };
}
