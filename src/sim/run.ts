import { createClock } from "../core/clock/index.ts";
import { DEFAULT_MATCH_LIMITS, PLAIN_DEPTH, withinCeilings } from "../core/limits.ts";
import { parseLog, type CommandLog } from "../core/log/index.ts";
import type { Notice } from "../core/notice.ts";
import { NOT_PLAIN, isRecord, plainCopy } from "../core/plain.ts";
import { SAVE_FORMAT, SAVE_MIGRATIONS, migrateSave, type SaveChains } from "./migrations/save/index.ts";
import type { SimInput, SimSnapshot, SimWorld } from "./types.ts";
import { submit } from "./actions.ts";
import { createWorld } from "./world.ts";

export function replayTicks(world: SimWorld, n: number): void {
  if (!Number.isInteger(n) || n < 0) throw new RangeError("replayTicks: n must be an integer >= 0");
  for (let i = 0; i < n; i += 1) world.clock.step();
}
export function advance(world: SimWorld, ms: number): void {
  const step = world.clock.stepMs;
  if (!Number.isInteger(ms) || ms < 0 || ms % step !== 0) throw new RangeError("advance: ms must be an integer >= 0 and a multiple of stepMs");
  replayTicks(world, ms / step);
}
export function snapshot(world: SimWorld): SimSnapshot {
  const { clock, grid, units, rng, log } = world;
  const occupancy: [number, readonly string[]][] = [];
  for (let i = 0; i < grid.cols * grid.rows; i += 1) {
    const ids = units.occupantsAt(grid.sqAt(i));
    if (ids.length > 0) occupancy.push([i, ids]);
  }
  return {
    tick: clock.tick(),
    clockMs: clock.now(),
    rngState: rng.state(),
    units: units.all().map((u) => ({
      id: u.id, unitId: u.unitId, side: u.side, at: { c: u.at.c, r: u.at.r },
      offset: u.offset === null ? null : { dx: u.offset.dx, dy: u.offset.dy }, facing: u.facing, alive: u.alive,
    })),
    occupancy,
    phases: { ...world.phases },
    logSeq: log.lastSeq(),
    ...(world.levels === null ? {} : { levels: world.levels.state() }),
  };
}
export function replay(input: SimInput, log: CommandLog, untilTick: number): SimWorld {
  const src = plainCopy(input, PLAIN_DEPTH);
  if (src === NOT_PLAIN || !isRecord(src)) throw new Error("replay: input is not plain data");
  const lim = (src as SimInput).limits === undefined ? DEFAULT_MATCH_LIMITS : (src as SimInput).limits;
  if (withinCeilings(lim) && (!Number.isInteger(untilTick) || untilTick < 0 || untilTick > lim.ticks || log.lastSeq() > lim.entries)) throw new Error("replay: tick or log over the limits");
  const world = createWorld({ ...(src as SimInput), hostSeed: log.header.seed });
  if (world.seed !== log.header.seed) throw new Error(`replay: world seed ${world.seed} is not the log seed ${log.header.seed}`);
  let at = 0;
  for (const entry of log.entries()) {
    if (entry.tick > untilTick) break;
    replayTicks(world, entry.tick - at);
    submit(world, entry.action);
    at = entry.tick;
  }
  replayTicks(world, untilTick - at);
  return world;
}
export function restore(input: SimInput, log: CommandLog, snap: SimSnapshot): SimWorld {
  const shot = plainCopy(snap, 5);
  if (shot === NOT_PLAIN || !isRecord(shot) || !isRecord(shot.phases)) throw new Error("restore: snapshot is not plain data");
  const tick = shot.tick, stepMs = createClock().stepMs, n = typeof tick === "number" && Number.isInteger(tick) && tick >= 0 ? log.entries().filter((e) => e.tick <= tick).length : -1;
  if (n < 0 || shot.clockMs !== (tick as number) * stepMs || shot.logSeq !== n) throw new Error("restore: snapshot does not match the log");
  const world = replay(input, log, tick as number);
  world.phases = { ...(shot.phases as SimSnapshot["phases"]) };
  if (JSON.stringify(snapshot(world)) !== JSON.stringify(shot)) throw new Error("restore: snapshot does not match the log");
  return world;
}
export type SaveRefusal = { readonly ok: false; readonly code: "saveEngineMismatch" | "saveProjectMismatch" | "saveFormatNewer" | "saveFormatOlder" | "saveMigrationFailed"; readonly needsMigration: boolean };
export type SaveLoad = { readonly ok: true; readonly world: SimWorld; readonly notices: readonly Notice[] } | SaveRefusal;
export type LoadOptions = { readonly allowProjectMismatch?: boolean; readonly allowEngineMismatch?: boolean };
export function saveMatch(world: SimWorld, meta: { readonly projectId: string; readonly savedAt: string }): string {
  if (typeof meta?.projectId !== "string" || typeof meta?.savedAt !== "string") throw new RangeError("saveMatch: projectId and savedAt must be strings");
  const h = world.log.header;
  return JSON.stringify({ kind: "match-save", formatVersion: SAVE_FORMAT, header: { projectHash: h.projectHash, engineVersion: h.engineVersion, projectId: meta.projectId, savedAt: meta.savedAt }, log: world.log.toJSON(), snapshot: snapshot(world) });
}
export function loadSave(input: SimInput, text: unknown, opts?: LoadOptions, chains: SaveChains = SAVE_MIGRATIONS): SaveLoad {
  let box: unknown;
  try { box = plainCopy({ input, opts: opts ?? {} }, PLAIN_DEPTH); } catch { throw new Error("load: input is not plain data"); }
  if (box === NOT_PLAIN || !isRecord(box) || !isRecord(box.input)) throw new Error("load: input is not plain data");
  const src = box.input as SimInput, opt = isRecord(box.opts) ? box.opts : {};
  let raw: unknown = null;
  if (typeof text === "string") { try { raw = JSON.parse(text); } catch { raw = null; } }
  if (!isRecord(raw) || raw.kind !== "match-save" || typeof raw.formatVersion !== "number" || !Number.isInteger(raw.formatVersion)) throw new Error("load: not a match save");
  let doc: Record<string, unknown> = raw;
  const fv = doc.formatVersion as number;
  if (fv > SAVE_FORMAT) return { ok: false, code: "saveFormatNewer", needsMigration: false };
  if (fv < SAVE_FORMAT) {
    try {
      const migrated = migrateSave("match-save", doc, fv, SAVE_FORMAT, chains);
      if (migrated === null) return { ok: false, code: "saveFormatOlder", needsMigration: true };
      const copy = plainCopy(migrated, PLAIN_DEPTH);
      if (copy === NOT_PLAIN || !isRecord(copy) || copy.kind !== "match-save" || copy.formatVersion !== SAVE_FORMAT) return { ok: false, code: "saveMigrationFailed", needsMigration: true };
      doc = copy;
    } catch { return { ok: false, code: "saveMigrationFailed", needsMigration: true }; }
  }
  const header = doc.header;
  if (!isRecord(header) || typeof header.projectHash !== "string" || typeof header.engineVersion !== "string" || typeof header.projectId !== "string" || typeof header.savedAt !== "string" || typeof doc.log !== "string") throw new Error("load: not a match save");
  const parsed = parseLog(doc.log, src.limits);
  if (!parsed.ok) throw new Error(`load: ${parsed.error}`);
  if (parsed.log.header.engineVersion !== header.engineVersion || parsed.log.header.projectHash !== header.projectHash) throw new Error("load: the log header is not the save header");
  const engineBad = header.engineVersion !== src.engineVersion, projectBad = header.projectHash !== src.projectHash;
  if (engineBad && opt.allowEngineMismatch !== true) return { ok: false, code: "saveEngineMismatch", needsMigration: false };
  if (projectBad && opt.allowProjectMismatch !== true) return { ok: false, code: "saveProjectMismatch", needsMigration: false };
  const notices: Notice[] = [];
  if (engineBad) notices.push({ code: "saveEngineMismatch", message: "saveEngineMismatch" });
  if (projectBad) notices.push({ code: "saveProjectMismatch", message: "saveProjectMismatch" });
  if (notices.length > 0) {
    const shot = doc.snapshot, tick = isRecord(shot) && typeof shot.tick === "number" && Number.isInteger(shot.tick) && shot.tick >= 0 ? shot.tick : 0;
    return { ok: true, world: replay(src, parsed.log, tick), notices };
  }
  return { ok: true, world: restore(src, parsed.log, doc.snapshot as SimSnapshot), notices };
}
