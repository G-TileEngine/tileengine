import { createClock } from "../core/clock/index.ts";
import { createBus, logEvents, unitEvents } from "../core/events/index.ts";
import { createGrid } from "../core/grid/index.ts";
import { LOG_FORMAT_VERSION, createLog } from "../core/log/index.ts";
import type { Notice } from "../core/notice.ts";
import { createRng, streamSeed } from "../core/rng/index.ts";
import { createUnits } from "../core/unit/index.ts";
import { readManifest, readMap, readStage, resolvePlacements, stageSeed, type ReadResult } from "../project/read/index.ts";
import type { SimInput, SimWorld } from "./types.ts";

function fail(doc: string, read: ReadResult<unknown>): Error {
  if (read.ok) return new Error(doc);
  const detail = read.needsMigration ? `needs migration from ${String(read.found)}` : read.error;
  return new Error(`${doc}: ${detail}`);
}
export function createWorld(input: SimInput): SimWorld {
  const manifest = readManifest(input.manifest);
  const map = readMap(input.map);
  const stage = readStage(input.stage, input.stageLimits);
  if (!manifest.ok) throw fail("manifest", manifest);
  if (!map.ok) throw fail("map", map);
  if (!stage.ok) throw fail("stage", stage);
  if (stage.doc.mapRef !== map.doc.id) throw new Error(`mapRef ${stage.doc.mapRef}`);
  const seed = stageSeed(stage.doc) ?? input.hostSeed;
  const clock = createClock();
  const bus = createBus(clock);
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
  );
  const pool = createRng(streamSeed(seed, "pool"));
  const placed = resolvePlacements(stage.doc, map.doc, input.chosen, (w) => pool.weighted(w));
  for (const p of placed.placements) units.place(p);
  const notices: Notice[] = [...grid.notices, ...placed.notices, ...units.notices];
  return { seed, clock, grid, units, bus, log, rng: createRng(streamSeed(seed, "match")), notices, phases: { battle: "play.loading" } };
}
