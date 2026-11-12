import { createRng, streamSeed } from "../core/rng/index.ts";
import { NOT_PLAIN, plainCopy } from "../core/plain.ts";
import type { Sq } from "../types/core-types.ts";
import { createGestureMapper, type GestureOptions, type PointerSample } from "../runtime/input/index.ts";
import { runChaos } from "./chaos.ts";
import type { ChaosGen, ChaosGenOptions, ChaosKind, ChaosResult, IntentHook, IntentInput, SimInput, SimWorld } from "./types.ts";

export const CHAOS_KINDS: readonly ChaosKind[] = ["legal", "stall", "offGrid", "foreign", "taken", "cancel", "confirm", "box", "gesture"];

export function gestureRecipes(from: Sq, to: Sq, ms: number, g: GestureOptions): readonly (readonly PointerSample[])[] {
  const p = (kind: PointerSample["kind"], id: number, at: Sq, t: number, dx = 0): PointerSample => ({ kind, id, pointer: "touch", x: at.c * g.cellPx + dx, y: at.r * g.cellPx, ms: t });
  return [
    [p("down", 0, from, ms), p("up", 0, from, ms + g.holdMs - 1, g.tapMaxPx)],
    [p("down", 0, from, ms), p("move", 0, to, ms), p("up", 0, to, ms)],
    [p("down", 0, from, ms), p("up", 0, to, ms + g.holdMs)],
    [p("up", 1, to, ms), p("down", 0, from, ms), p("down", 0, to, ms), p("down", 1, to, ms), p("up", 1, to, ms), p("up", 0, from, ms)],
    [p("down", 0, from, ms), p("cancel", 0, from, ms), p("up", 0, from, ms)]];
}

function requireGen(gen: ChaosGen): void {
  const keys = Object.keys(gen.mix), weights = CHAOS_KINDS.map((kind) => gen.mix[kind]);
  if (gen.stream === "" || gen.stream === "match" || gen.stream === "pool") throw new RangeError("chaos-gen: stream must be a non-empty name other than match or pool");
  if (keys.length !== CHAOS_KINDS.length || CHAOS_KINDS.some((kind) => !keys.includes(kind))) throw new RangeError("chaos-gen: mix keys must be exactly the nine kinds");
  if (weights.some((w) => !Number.isFinite(w) || w < 0) || weights.every((w) => w === 0)) throw new RangeError("chaos-gen: every weight must be finite and >= 0, and not all zero");
  if (!Number.isInteger(gen.burst) || gen.burst < 1) throw new RangeError("chaos-gen: burst must be an integer >= 1");
  if (gen.mix.gesture > 0 && gen.gestures === null) throw new RangeError("chaos-gen: gestures are required when the gesture weight is above zero");
  if (gen.gestures !== null) createGestureMapper(gen.gestures, { cols: 1, rows: 1, unitAt: () => undefined });
}

export function chaosIntents(live: ChaosGen, legal: IntentHook): IntentHook {
  const kept = plainCopy(live, 2);
  let state: { readonly world: SimWorld; readonly rng: ReturnType<typeof createRng> } | null = null;
  return (world, side, budget) => {
    if (kept === NOT_PLAIN) throw new RangeError("chaos-gen: gen must be plain data");
    const gen = kept as ChaosGen;
    requireGen(gen);
    if (state === null) state = { world, rng: createRng(streamSeed(world.seed, gen.stream)) };
    else if (state.world !== world) throw new Error("chaos-gen: one generator per run");
    const rng = state.rng, kind = CHAOS_KINDS[rng.weighted(CHAOS_KINDS.map((k) => gen.mix[k]))];
    if (kind === undefined) throw new Error("chaos-gen: kind");
    if (kind === "legal") return legal(world, side, budget);
    if (kind === "stall" || budget.units.length === 0) return [];
    const id = rng.pick(budget.units), grid = world.grid, cell = (): Sq => ({ c: rng.int(grid.cols), r: rng.int(grid.rows) });
    const sel = (unitId: string): IntentInput => ({ intent: { type: "SelectUnit", unitId } }), tap = (at: Sq): IntentInput => ({ intent: { type: "TargetCell", at } });
    if (kind === "offGrid") { const a = cell(); return [sel(id), tap(rng.pick([{ c: -1, r: a.r }, { c: grid.cols, r: a.r }, { c: a.c, r: -1 }, { c: a.c, r: grid.rows }]))]; }
    if (kind === "foreign") return [sel(rng.pick([...world.units.all().flatMap((u) => (u.alive && u.side !== side ? [u.id] : [])), `${id}#`])), tap(cell())];
    if (kind === "taken") {
      const spots: Sq[] = [];
      for (let r = 0; r < grid.rows; r += 1) for (let c = 0; c < grid.cols; c += 1) { const at = { c, r }; if (!grid.isOpen(at) || world.units.occupantsAt(at).length > 0) spots.push(at); }
      return [sel(id), tap(rng.pick(spots))];
    }
    if (kind === "cancel" || kind === "confirm") {
      const times = 1 + rng.int(gen.burst), out: IntentInput[] = [sel(id)];
      for (let i = 0; i < times; i += 1) out.push(kind === "cancel" ? { intent: { type: "Cancel" } } : { intent: { type: "Confirm" }, aim: rng.pick([null, cell()]) });
      return out;
    }
    if (kind === "box") return [{ intent: { type: "BoxSelect", from: cell(), to: cell() } }];
    const g = gen.gestures;
    if (g === null) return [];
    const at = world.units.get(id)?.at ?? { c: 0, r: 0 }, from = rng.pick([at, cell()]), to = cell();
    const mapper = createGestureMapper(g, { cols: grid.cols, rows: grid.rows, unitAt: (sq) => world.units.occupantAt(sq) });
    return rng.pick(gestureRecipes(from, to, world.clock.now(), g)).flatMap((sample) => mapper(sample).map((intent) => ({ intent })));
  };
}

export function runChaosGen(input: SimInput, opts: ChaosGenOptions): ChaosResult {
  const { gen, legal, ...rest } = opts;
  return runChaos(input, { ...rest, presets: { ...opts.presets, chaosGen: gen }, intents: chaosIntents(gen, legal) });
}
