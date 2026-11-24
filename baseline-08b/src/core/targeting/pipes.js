                                                            
                                             
                                              
                                                                                                           

export function aimUnit(unitId        , fallbackAt     )          {
  return fallbackAt === undefined ? { pipe: "unit", unitId } : { pipe: "unit", unitId, fallbackAt };
}

export function aimTile(at    , edge           )          {
  return edge === undefined ? { pipe: "tile", at } : { pipe: "tile", at, edge };
}

/** First living id at a logic cell, or none. A dead id in that slot is not a hit. */
function livingAt(units       , at    )                     {
  const id = units.occupantAt(at);
  return id !== undefined && units.get(id)?.alive === true ? id : undefined;
}

export function resolveAim(aim     , units       , grid      )             {
  if (aim.pipe === "tile") {
    if (!grid.inBounds(aim.at)) return { hit: false, reason: "offMap" };
    const id = livingAt(units, aim.at);
    return id === undefined ? { hit: false, reason: "empty" } : { hit: true, unitId: id, at: aim.at };
  }
  const body = units.get(aim.unitId);
  if (body?.alive === true) return { hit: true, unitId: body.id, at: body.at };
  if (body === undefined || aim.fallbackAt === undefined) return { hit: false, reason: "dead" };
  const spot = aim.fallbackAt;
  if (!grid.inBounds(spot)) return { hit: false, reason: "offMap" };
  const id = livingAt(units, spot);
  return id === undefined ? { hit: false, reason: "dead" } : { hit: true, unitId: id, at: spot };
}

export function resolveContext(caster        , aim            , units       , grid      )                 {
  if (aim === null) return { caster, aim: null, resolution: null };
  return { caster, aim, resolution: resolveAim(aim, units, grid) };
}

export function roster(units       , side         )                         {
  const out                = [];
  for (const u of units.all()) {
    if (!u.alive) continue;
    if (side !== undefined && u.side !== side) continue;
    out.push({ id: u.id, at: u.at });
  }
  return out;
}

export function toCell(point                                            )     {
  return { c: Math.floor(point.c + 0.5), r: Math.floor(point.r + 0.5) };
}
