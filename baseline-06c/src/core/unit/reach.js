                                                    
                                             
                                                     

export function reach(grid      , units       , id        , maxSteps        , pass              = "allies")                {
  const self = units.get(id);
  if (!self?.alive) return [];
  const blocked = (at    )          => {
    if (pass === "all") return false;
    for (const oid of units.occupantsAt(at)) {
      if (oid === id) continue;
      const other = units.get(oid);
      if (other?.alive && (pass === "none" || other.side !== self.side)) return true;
    }
    return false;
  };
  const out       = [];
  for (const index of grid.reachable(self.at, maxSteps, blocked).keys()) {
    const at = grid.sqAt(index);
    const taken = units.occupantsAt(at).some((oid) => oid !== id && units.get(oid)?.alive === true);
    if (!taken) out.push(at);
  }
  return out;
}
