import { readFileSync } from "node:fs";

export type Rgb = readonly [number, number, number];
export type Palette = {
  readonly style: string;
  readonly outline: { readonly colour: string; readonly rampWeight: number; readonly colourWeight: number };
  readonly outlineBy: Readonly<Record<string, string>>;
  readonly rim: number;
  readonly bias: Readonly<Record<string, number>>;
  readonly ramps: Readonly<Record<string, readonly string[]>>;
};

export function rgb(hex: string): Rgb {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    throw new Error(`art-bake: colour "${hex}" is not #rrggbb`);
  }
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function luma(c: Rgb): number {
  return Math.round(0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]);
}

function ban(hex: string): void {
  const n = hex.toLowerCase();
  if (n === "#000000" || n === "#ffffff") {
    throw new Error(`art-bake: colour "${hex}" is pure black or white`);
  }
}

function named(p: Palette, keys: readonly string[], what: string): void {
  for (const name of keys) {
    if (p.ramps[name] === undefined) {
      throw new Error(`art-bake: ${what} names "${name}", which has no ramp in palette.json`);
    }
  }
}

export function checkPalette(p: Palette): Palette {
  for (const name of Object.keys(p.ramps)) {
    const hexes = p.ramps[name] ?? [];
    if (hexes.length < 1 || hexes.length > 9) {
      throw new Error(`art-bake: ramp "${name}" has ${hexes.length} steps, must be 1 to 9`);
    }
    const seen: string[] = [];
    let prev: number | undefined;
    for (const hex of hexes) {
      const c = rgb(hex);
      ban(hex);
      const key = hex.toLowerCase();
      if (seen.includes(key)) {
        throw new Error(`art-bake: ramp "${name}" repeats colour "${hex}"`);
      }
      seen.push(key);
      const y = luma(c);
      if (prev !== undefined && y <= prev) {
        throw new Error(`art-bake: ramp "${name}" is not strictly lighter at "${hex}"`);
      }
      prev = y;
    }
  }
  rgb(p.outline.colour);
  ban(p.outline.colour);
  for (const hex of Object.values(p.outlineBy)) {
    rgb(hex);
    ban(hex);
  }
  named(p, Object.keys(p.bias), "bias");
  named(p, Object.keys(p.outlineBy), "outlineBy");
  return p;
}

export const PALETTE: Palette = checkPalette(JSON.parse(readFileSync(new URL("./palette.json", import.meta.url), "utf8")) as Palette);

export function ramp(name: string): readonly Rgb[] {
  const hexes = PALETTE.ramps[name];
  if (hexes === undefined) throw new Error(`art-bake: no ramp "${name}" in palette.json`);
  return hexes.map((hex) => rgb(hex));
}

export function stepOf(name: string, step: number): Rgb {
  const colours = ramp(name);
  const got = colours[step];
  if (got === undefined) {
    throw new Error(`art-bake: ramp "${name}" has no step ${step}`);
  }
  return got;
}
