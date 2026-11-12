import { createClock } from "../core/clock/index.ts";
import { createBus, logEvents, unitEvents } from "../core/events/index.ts";
import { createGrid } from "../core/grid/index.ts";
import { LOG_FORMAT_VERSION, createLog } from "../core/log/index.ts";
import { DEFAULT_MATCH_LIMITS, PLAIN_DEPTH, withinCeilings } from "../core/limits.ts";
import type { Notice } from "../core/notice.ts";
import { NOT_PLAIN, isRecord, plainCopy } from "../core/plain.ts";
import { createRng, streamSeed } from "../core/rng/index.ts";
import { createUnits } from "../core/unit/index.ts";
import { readManifest, readMap, readStage, resolvePlacements, stageSeed, type ReadResult } from "../project/read/index.ts";
import { LEVEL_EVENTS, createLevels } from "../rules/levels/index.ts";
import type { SimInput, SimWorld } from "./types.ts";

function fail(doc: string, read: ReadResult<unknown>): Error {
  if (read.ok) return new Error(doc);
  const detail = read.needsMigration ? `needs migration from ${String(read.found)}` : read.error;
  return new Error(`${doc}: ${detail}`);
}
const dropped = new WeakMap<Notice[], number>();
export function note(world: SimWorld, item: Notice): void {
  const cap = world.limits.notices, list = world.notices;
  if (list.length < cap) { list.push(item); return; }
  const n = (dropped.get(list) ?? 0) + 1;
  dropped.set(list, n);
  const line: Notice = { code: "noticesCapped", message: `and ${n} more` };
  if (n === 1) list.push(line); else list[cap] = line;
}
export function createWorld(input: SimInput): SimWorld {
  const src = plainCopy(input, PLAIN_DEPTH);
  if (src === NOT_PLAIN || !isRecord(src)) throw new Error("createWorld: input is not plain data");
  input = src as SimInput;
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
  const bus = createBus(clock, input.levels === undefined ? undefined : LEVEL_EVENTS, input.busLimits);
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
  const notices: Notice[] = [];
  const levels = input.levels === undefined ? null : createLevels(input.levels, createRng(streamSeed(seed, "levels")), (event) => bus.emit(event));
  const world: SimWorld = { seed, clock, grid, units, bus, log, rng: createRng(streamSeed(seed, "match")), notices, levels, phases: { battle: "play.loading" }, limits };
  for (const item of [...grid.notices, ...placed.notices, ...units.notices]) note(world, item);
  return world;
}
