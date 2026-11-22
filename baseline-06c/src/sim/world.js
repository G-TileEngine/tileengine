import { createClock } from "../core/clock/index.js";
import { createBus, logEvents, unitEvents } from "../core/events/index.js";
import { createGrid } from "../core/grid/index.js";
import { LOG_FORMAT_VERSION, createLog } from "../core/log/index.js";
import { DEFAULT_MATCH_LIMITS, PLAIN_DEPTH, withinCeilings } from "../core/limits.js";
                                                
import { NOT_PLAIN, isRecord, plainCopy } from "../core/plain.js";
import { createRng, streamSeed } from "../core/rng/index.js";
import { createUnits } from "../core/unit/index.js";
import { readManifest, readMap, readStage, resolvePlacements, stageSeed,                 } from "../project/read/index.js";
import { LEVEL_EVENTS, createLevels } from "../rules/levels/index.js";
import { BATTLE_EVENTS, createBattle } from "../rules/battle/index.js";
                                                     

function fail(doc        , read                     )        {
  if (read.ok) return new Error(doc);
  const detail = read.needsMigration ? `needs migration from ${String(read.found)}` : read.error;
  return new Error(`${doc}: ${detail}`);
}
const dropped = new WeakMap                  ();
export function note(world          , item        )       {
  const cap = world.limits.notices, list = world.notices;
  if (list.length < cap) { list.push(item); return; }
  const n = (dropped.get(list) ?? 0) + 1;
  dropped.set(list, n);
  const line         = { code: "noticesCapped", message: `and ${n} more` };
  if (n === 1) list.push(line); else list[cap] = line;
}
export function createWorld(input          )           {
  const src = plainCopy(input, PLAIN_DEPTH);
  if (src === NOT_PLAIN || !isRecord(src)) throw new Error("createWorld: input is not plain data");
  input = src            ;
  const limits = input.limits === undefined ? DEFAULT_MATCH_LIMITS : input.limits;
  if (!withinCeilings(limits)) throw new RangeError("createWorld: limits must be whole numbers from 1 to their ceilings");
  const manifest = readManifest(input.manifest, input.stageLimits);
  const map = readMap(input.map, input.stageLimits);
  const stage = readStage(input.stage, input.stageLimits);
  if (!manifest.ok) throw fail("manifest", manifest);
  if (!map.ok) throw fail("map", map);
  if (!stage.ok) throw fail("stage", stage);
  if (stage.doc.mapRef !== map.doc.id) throw new Error(`mapRef ${stage.doc.mapRef}`);
  const seed = stageSeed(stage.doc) ?? input.hostSeed;
  const clock = createClock();
  const bus = createBus(clock, input.rules === undefined ? (input.levels === undefined ? undefined : LEVEL_EVENTS) : { mode: "battle", types: [...(input.levels === undefined ? [] : LEVEL_EVENTS.types), ...BATTLE_EVENTS.types] }, input.busLimits);
  const settings = manifest.doc.project.settings;
  const grid = createGrid(map.doc, input.tiles, { wrapEdges: settings.wrapEdges });
  const units = createUnits(grid, {
    hooks: unitEvents(bus),
    ...(settings.occupancy === undefined ? {} : { occupancy: settings.occupancy }),
    ...(input.terrain === undefined ? {} : { terrain: input.terrain }),
  });
  const log = createLog(
    { seed, formatVersion: LOG_FORMAT_VERSION, engineVersion: input.engineVersion, projectHash: input.projectHash },
    logEvents(bus),
    limits,
  );
  const pool = createRng(streamSeed(seed, "pool"));
  const placed = resolvePlacements(stage.doc, map.doc, input.chosen, (w) => pool.weighted(w), input.stageLimits.notices);
  for (const p of placed.placements) units.place(p);
  const notices           = [];
  const levels = input.levels === undefined ? null : createLevels(input.levels, createRng(streamSeed(seed, "levels")), (event) => bus.emit(event));
  const rules = input.rules === undefined ? null : createBattle(input.rules, units, grid, (event) => bus.emit(event));
  const world           = { seed, clock, grid, units, bus, log, rng: createRng(streamSeed(seed, "match")), notices, levels, rules, phases: { battle: "play.loading" }, limits };
  for (const item of [...grid.notices, ...placed.notices, ...units.notices]) note(world, item);
  return world;
}
