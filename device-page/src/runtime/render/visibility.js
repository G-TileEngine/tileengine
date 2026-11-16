                                                                                                                                                               
const NEAR = [0, -1, 1, 0, 0, 1, -1, 0, 1, -1, 1, 1, -1, 1, -1, -1];
const OCT = [1, 0, 0, 1, 0, 1, 1, 0, 0, -1, 1, 0, -1, 0, 0, 1, -1, 0, 0, -1, 0, -1, -1, 0, 0, 1, -1, 0, 1, 0, 0, -1];
const DIRS = ["n", "e", "s", "w"]         , BITS = [1, 2, 4, 8];
export function wallsFrom(grid                                                                                                                              )             {
  const out = new Uint8Array(grid.cols * grid.rows);
  for (let r = 0; r < grid.rows; r += 1) for (let c = 0; c < grid.cols; c += 1) { let b = 0; for (let i = 0; i < 4; i += 1) if (grid.hasWall({ c, r }, DIRS[i] ?? "n")) b |= BITS[i] ?? 0; out[r * grid.cols + c] = b; }
  return out;
}
/** Centre-to-centre. A corner blocks only when both ways round it are walled. */
function rayOpen(w                   , cols        , rows        , x0        , y0        , x1        , y1        )          {
  const dx = x1 - x0, dy = y1 - y0, ax = Math.abs(dx), ay = Math.abs(dy), sx = dx < 0 ? -1 : 1, sy = dy < 0 ? -1 : 1;
  const on = (x        , y        , b        )          => x >= 0 && y >= 0 && x < cols && y < rows && ((w[y * cols + x] ?? 0) & b) !== 0;
  const vEdge = (x        , y        )          => on(x, y, sx > 0 ? 2 : 8) || on(x + sx, y, sx > 0 ? 8 : 2);
  const hEdge = (x        , y        )          => on(x, y, sy > 0 ? 4 : 1) || on(x, y + sy, sy > 0 ? 1 : 4);
  let x = x0, y = y0, ix = 0, iy = 0;
  while (ix < ax || iy < ay) {
    const vert = ay === 0 || (ax !== 0 && (2 * ix + 1) * ay < (2 * iy + 1) * ax), horiz = ax === 0 || (ay !== 0 && (2 * iy + 1) * ax < (2 * ix + 1) * ay);
    if (vert && !horiz) { if (vEdge(x, y)) return false; x += sx; ix += 1; }
    else if (horiz && !vert) { if (hEdge(x, y)) return false; y += sy; iy += 1; }
    else { if ((vEdge(x, y) || hEdge(x + sx, y)) && (hEdge(x, y) || vEdge(x, y + sy))) return false; x += sx; y += sy; ix += 1; iy += 1; }
  }
  return true;
}

export function openCell(g          , c        , r        )                                  {
  const open = (x        , y        )          => x >= 0 && y >= 0 && x < g.cols && y < g.rows && !g.blocks[y * g.cols + x];
  if (open(c, r)) return { c, r };
  for (let i = 0; i < 16; i += 2) { const x = c + (NEAR[i] ?? 0), y = r + (NEAR[i + 1] ?? 0); if (open(x, y)) return { c: x, r: y }; }
  return null;
}

export function visibleCells(g          , c        , r        , radius        )             {
  const out = new Uint8Array(g.cols * g.rows), r2 = radius * radius;
  const wall = (x        , y        )          => x < 0 || y < 0 || x >= g.cols || y >= g.rows || !!g.blocks[y * g.cols + x];
  const mark = (x        , y        )       => { if (x >= 0 && y >= 0 && x < g.cols && y < g.rows) out[y * g.cols + x] = 1; };
  const cast = (row        , start        , end        , xx        , xy        , yx        , yy        )       => {
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
  const walls = g.lightWalls;
  if (walls !== undefined) {
    const x0 = Math.max(0, c - radius), x1 = Math.min(g.cols - 1, c + radius), y0 = Math.max(0, r - radius), y1 = Math.min(g.rows - 1, r + radius);
    for (let y = y0; y <= y1; y += 1) for (let x = x0; x <= x1; x += 1) if ((x !== c || y !== r) && out[y * g.cols + x] === 1 && !rayOpen(walls, g.cols, g.rows, c, r, x, y)) out[y * g.cols + x] = 0;
  }
  return out;
}

export function createSight()                                                                                                                {
  const stats = { computed: 0 }, ids = new WeakMap                (), cache = new Map                    ();
  let n = 0;
  return {
    stats,
    mask(g, c, r, radius) {
      const blocks = g.blocks          , walls = g.lightWalls                      , id = ids.get(blocks) ?? (ids.set(blocks, ++n), n);
      const wid = walls === undefined ? 0 : ids.get(walls) ?? (ids.set(walls, ++n), n), key = `${id}:${wid}:${c}:${r}:${radius}:${g.cols}`, hit = cache.get(key);
      if (hit !== undefined) return hit;
      if (cache.size >= 256) cache.clear();
      const made = visibleCells(g, c, r, radius);
      cache.set(key, made); stats.computed += 1;
      return made;
    },
  };
}
