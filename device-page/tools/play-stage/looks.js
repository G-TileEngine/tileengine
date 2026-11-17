                                                                
                                                                                             
                                                                            
                                                                         
import { RECIPES, TEAM, TILE,            } from "./load.js";

export const WATER_RAMP = ["#1b3a5c", "#2a5d8a", "#4f8fc0", "#cfe8f5"]         ;
export const FLAME_RAMP = ["#b8401c", "#e8762a", "#f6c04a"]         ;
export const WASH = 0.5, LIGHT_RES = 4;
export const animId = (id        )         => `play:anim:${id}`;
const hex = (s        )         => Number.parseInt(s.slice(1), 16);
const put = (data                   , o        , n        )       => { data[o] = (n >>> 16) & 255; data[o + 1] = (n >>> 8) & 255; data[o + 2] = n & 255; data[o + 3] = 255; };
const strip = (frames                   )         => {
  const data = new Uint8ClampedArray(TILE * frames.length * TILE * 4);
  for (let f = 0; f < frames.length; f += 1) for (let y = 0; y < TILE; y += 1) for (let x = 0; x < TILE; x += 1) put(data, (y * TILE * frames.length + f * TILE + x) * 4, frames[f] ?? 0);
  return { w: TILE * frames.length, h: TILE, data };
};
export function frameOf(px        , f        , fw        , fh        )         {
  const data = new Uint8ClampedArray(fw * fh * 4);
  for (let y = 0; y < fh; y += 1) data.set(px.data.subarray((y * px.w + f * fw) * 4, (y * px.w + (f + 1) * fw) * 4), y * fw * 4);
  return { w: fw, h: fh, data };
}
export const sourceOf = (own                                    )              => (id, f, fw, fh) => { const px = own(id); return px === undefined ? undefined : frameOf(px, f, fw, fh); };
export const picturesOf = (own                                    , link                                            )                                       => (id) => own(id) ?? link.pixels(id);
export const litPlan = (lighting                                                                                                                      , looks                                                                   , lit       )            => lighting.plan(looks.light, looks.lights, WASH, 0, LIGHT_RES, lit);
export const unitAsset = (id        )             => ({ sheet: { id: animId(id), columns: 2, fw: TILE, fh: TILE }, clips: [{ name: "idle", frames: [0, 1] }] });
const animPx = (rgb        )         => {
  const one = strip([rgb]), data = new Uint8ClampedArray(TILE * 2 * TILE * 4);
  for (let y = 0; y < TILE; y += 1) { data.set(one.data.subarray(y * TILE * 4, (y + 1) * TILE * 4), (y * TILE * 2) * 4); if (y > 0) data.set(one.data.subarray((y - 1) * TILE * 4, y * TILE * 4), (y * TILE * 2 + TILE) * 4); }
  return { w: TILE * 2, h: TILE, data };
};
export function dressPx(id        )                     {
  if (id === "play:ground") return strip([0x243044, hex(WATER_RAMP[0]), 0x6b6256]);
  if (id === "play:canopy") return strip([0x1e6b3a]);
  if (id === "play:brazier") return strip([hex(FLAME_RAMP[0])]);
  if (!id.startsWith("play:anim:")) return undefined;
  const recipe = Object.values(RECIPES).find((row) => animId(row.id) === id);
  return recipe === undefined ? undefined : animPx(TEAM[recipe.team]);
}
                                                                                                                                                  
const cycle = (name        , n        ) => ({ cycle: { ramp: { name, steps: Array.from({ length: n }, (_, i) => i) } } });
export function dress(grid      , looks        ) {
  const n = grid.cols * grid.rows, tiles           = [], blocks = new Uint8Array(n);
  for (let i = 0; i < n; i += 1) { const id = grid.tileTypeAt({ c: i % grid.cols, r: (i / grid.cols) | 0 }).id, tile = id === "water" ? 1 : id === "rock" ? 2 : 0; tiles.push(tile); if (tile === 2) blocks[i] = 1; }
  const canopy = looks === undefined ? undefined : Array.from({ length: n }, () => null                 );
  if (looks !== undefined && canopy !== undefined) for (const [c, r] of looks.canopy) canopy[r * grid.cols + c] = 0;
  const assets                             = { "play:ground": { sheet: { id: "play:ground", columns: 3, fw: TILE, fh: TILE }, styled: true, tileProps: { "1": { motion: cycle("water", 3) } } } };
  if (canopy !== undefined) { assets["play:canopy"] = { sheet: { id: "play:canopy", columns: 1, fw: TILE, fh: TILE }, motion: { sway: { trunkFrom: 8 } } }; assets["play:brazier"] = { sheet: { id: "play:brazier", columns: 1, fw: TILE, fh: TILE }, styled: true, motion: cycle("fire", 3) }; }
  const braziers = looks?.braziers ?? [];
  return {
    assets,
    layers: [{ tileset: "play:ground", aboveUnits: false, visible: true, tiles }, ...(canopy === undefined ? [] : [{ tileset: "play:canopy", aboveUnits: true, visible: true, tiles: canopy }])],
    objects: braziers.map(([c, r]) => ({ assetId: "play:brazier", at: { c, r } })),
    style: { ramps: { water: [...WATER_RAMP], fire: [...FLAME_RAMP] } },
    waterTiles: { "play:ground": [1]          },
    light: { cols: grid.cols, rows: grid.rows, tileW: TILE, tileH: TILE, blocks },
    lights: braziers.map(([c, r]) => ({ x: (c + 0.5) * TILE, y: (r + 0.5) * TILE, radius: 3 * TILE, colour: FLAME_RAMP[2] })),
  };
}
