import { readFileSync } from "node:fs";

export type Rgb = readonly [number, number, number];
export type Palette = {
  readonly style: string;
  readonly outline: { readonly colour: string; readonly rampWeight: number; readonly colourWeight: number };
  readonly outlineBy: Readonly<Record<string, string>>;
  readonly ramps: Readonly<Record<string, readonly string[]>>;
};
export const PALETTE: Palette = JSON.parse(readFileSync(new URL("./palette.json", import.meta.url), "utf8")) as Palette;

export function rgb(hex: string): Rgb {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function ramp(name: string): readonly Rgb[] {
  const hexes = PALETTE.ramps[name];
  if (hexes === undefined) throw new Error(`art-bake: no ramp "${name}" in palette.json`);
  return hexes.map((hex) => rgb(hex));
}
