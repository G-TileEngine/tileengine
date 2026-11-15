// Host guide recipe (D3): match -> picture. Hand-run, never shipped; src never imports tools/.
// Run: node tools/host-example/match-picture.ts  (replays a stage-fixed match, then draws its last frame)
import { buildDrawList, fitView, snapCamera, type Sheet } from "../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneLayer, type SceneUnit, type SceneWorld } from "../../src/runtime/scene/world-scene.ts";
import { createWorld, replay, runMatch, snapshot, type SimInput } from "../../src/sim/index.ts";
import { bot, reachFarRow, seedless } from "../../tests/sim/ai.ts";
import { input } from "../../tests/sim/input.ts";
import { seatAll } from "../../tests/sim/seats.ts";

/** What the host owns and the match does not: the map's picture and one sprite per unit type. */
export type MatchAssets = {
  readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number;
  readonly assets: Readonly<Record<string, SceneAsset>>; readonly layers: readonly SceneLayer[];
  readonly sprites: Readonly<Record<string, string>>; // unitId (e.g. "knight") -> asset id
};
type PlainUnit = { id: string; unitId: string; at: { c: number; r: number }; offset: { dx: number; dy: number } | null; facing: SceneUnit["facing"]; alive: boolean };

/** The target shape: plain snapshot data in, a SceneWorld out. Reads only what it needs; unknown sprites are skipped. */
export function sceneFromMatch(snap: { readonly units: readonly PlainUnit[] }, art: MatchAssets): SceneWorld {
  const units: SceneUnit[] = [];
  for (const u of snap.units) {
    const sprite = art.sprites[u.unitId];
    if (sprite === undefined) continue;
    units.push({ id: u.id, sprite, at: { c: u.at.c, r: u.at.r }, offset: u.offset === null ? null : { dx: u.offset.dx, dy: u.offset.dy }, facing: u.facing, alive: u.alive, action: u.offset === null ? "idle" : "move" });
  }
  return { cols: art.cols, rows: art.rows, tileW: art.tileW, tileH: art.tileH, mapSeed: art.mapSeed, assets: art.assets, layers: art.layers, units, objects: [], overlays: [] };
}

/** Example host: play a match, keep only its log, replay it fresh, snapshot, copy as plain data, draw. */
export function demo(seed = 1): { units: number; standing: number; cmds: number; tick: number } {
  const src: SimInput = seedless(input("stage-fixed", seed)), sides = ["player", "wolves"] as const, played = createWorld(src);
  runMatch(played, { sides: [...sides], victory: reachFarRow, fuse: 60000, maxRounds: 40, maxSimMs: 600000, seats: seatAll(played, sides, bot(seed), 200) });
  const tick = played.clock.tick(), world = replay(src, played.log, tick);
  const plain = JSON.parse(JSON.stringify(snapshot(world))) as { units: PlainUnit[] }; // a save or a network copy looks like this
  const sheet = (id: string): Sheet => ({ id, columns: 4, fw: 16, fh: 16 }), { cols, rows } = world.grid;
  const tiles = Array.from({ length: cols * rows }, (_, i) => (world.grid.isOpen(world.grid.sqAt(i)) ? 0 : 1));
  const art: MatchAssets = {
    cols, rows, tileW: 16, tileH: 16, mapSeed: seed, layers: [{ tileset: "ground", aboveUnits: false, visible: true, tiles }],
    assets: { ground: { sheet: sheet("ground") }, knight: { sheet: sheet("knight") }, archer: { sheet: sheet("archer") }, wolf: { sheet: sheet("wolf") }, crate: { sheet: sheet("crate") }, merchant: { sheet: sheet("merchant") } },
    sprites: { knight: "knight", archer: "archer", wolf: "wolf", crate: "crate", merchant: "merchant" },
  };
  const scene = createSceneLink().scene(sceneFromMatch(plain, art), { tMs: world.clock.now(), stepMs: world.clock.stepMs });
  const fit = fitView(cols * 16, rows * 16, 1, 16, 16), list = buildDrawList(scene, fit, snapCamera(0, 0, 1), world.clock.now(), world.clock.stepMs);
  return { units: plain.units.length, standing: scene.standing.length, cmds: list.cmds.length, tick };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const got = demo();
  console.log(`match-picture: stage-fixed replay to tick ${got.tick}: ${got.units} units, ${got.standing} drawn standing, ${got.cmds} draw commands`);
  if (got.cmds === 0 || got.standing !== got.units) process.exit(1);
}
