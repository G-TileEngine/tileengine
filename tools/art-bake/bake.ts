import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodePng } from "./png.ts";
import { lantern } from "./recipes/lantern.ts";
import { rock } from "./recipes/rock.ts";
import { crate } from "./recipes/crate.ts";
import { colourise, gridSprite, type Sprite, type Tile } from "./sprite.ts";

export const RECIPES: Readonly<Record<string, (tile: Tile) => Sprite>> = { crate: (tile) => gridSprite(crate(tile)), rock, lantern };
export const DEFAULT_TILES: readonly Tile[] = [32];
export type Baked = { readonly sprite: Sprite; readonly rgba: Uint8Array; readonly sha256: string };
export type ManifestRow = { readonly name: string; readonly tile: Tile; readonly file: string; readonly w: number; readonly h: number; readonly foot: readonly [number, number]; readonly sha256: string };

export function bakeOne(name: string, tile: Tile): Baked {
  const make = RECIPES[name];
  if (make === undefined) throw new Error(`art-bake: no recipe "${name}"`);
  const sprite = make(tile);
  const rgba = colourise(sprite);
  const sha256 = createHash("sha256").update(rgba).digest("hex");
  return { sprite, rgba, sha256 };
}

export function bakeAll(outDir: string, tiles: readonly Tile[] = DEFAULT_TILES): ManifestRow[] {
  mkdirSync(outDir, { recursive: true });
  const rows: ManifestRow[] = [];
  const hash = createHash("sha256");
  for (const name of Object.keys(RECIPES)) {
    for (const tile of tiles) {
      const { sprite, rgba, sha256 } = bakeOne(name, tile);
      const file = `${name}-${tile}.png`;
      writeFileSync(join(outDir, file), encodePng(sprite.w, sprite.h, rgba));
      hash.update(rgba);
      rows.push({ name, tile, file, w: sprite.w, h: sprite.h, foot: sprite.foot, sha256 });
    }
  }
  writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify({ style: "B r6b", hash: hash.digest("hex"), sprites: rows }, null, 1)}\n`);
  return rows;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outDir = process.argv[2] ?? fileURLToPath(new URL("./out", import.meta.url));
  const args = process.argv.slice(3);
  const tiles = args.length === 0 ? DEFAULT_TILES : args.map((arg) => {
    if (arg !== "32" && arg !== "48") throw new Error(`art-bake: tile must be 32 or 48 ("${arg}")`);
    return Number(arg) as Tile;
  });
  for (const row of bakeAll(outDir, tiles)) console.log(`${row.file} ${row.w}x${row.h} foot ${row.foot[0]},${row.foot[1]} ${row.sha256}`);
}
