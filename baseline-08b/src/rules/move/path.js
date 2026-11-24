                                                    
import { DIRS } from "../../core/grid/index.js";
                                                     
                                                      

const bodyAt = (units       , at    , id        )          => units.occupantsAt(at).some((oid) => oid !== id && units.get(oid)?.alive === true);

export function walks(grid      , units       , id        , reach        )                    {
  const out = new Map              (), self = units.get(id);
  if (self === undefined || !self.alive) return out;
  for (const dir of DIRS) {
    const path       = [];
    let at = self.at;
    for (let step = 0; step < reach; step += 1) {
      if (!grid.canStep(at, dir)) break;
      const next = grid.step(at, dir);
      if (next === null || bodyAt(units, next, id)) break;
      path.push(next);
      out.set(grid.index(next), path.slice());
      at = next;
    }
  }
  return out;
}

export function reachCells(grid      , units       , id        , reach        )       {
  const ends       = [];
  for (const path of walks(grid, units, id, reach).values()) { const end = path.at(-1); if (end !== undefined) ends.push(end); }
  return ends.sort((a, b) => a.r - b.r || a.c - b.c);
}

export function walkTo(grid      , units       , id        , reach        , to    )              {
  if (!grid.inBounds(to)) return null;
  return walks(grid, units, id, reach).get(grid.index(to)) ?? null;
}
