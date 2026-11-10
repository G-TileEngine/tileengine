export type RngState = { readonly a: number };

export interface Rng {
  next(): number;
  int(maxExclusive: number): number;
  pick<T>(xs: readonly T[]): T;
  weighted(weights: readonly number[]): number;
  state(): RngState;
}

function positive(w: number | undefined): w is number {
  return w !== undefined && Number.isFinite(w) && w > 0;
}

export function restoreRng(state: RngState): Rng {
  let a = state.a >>> 0;
  function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  return {
    next,
    int(maxExclusive: number): number {
      if (!Number.isInteger(maxExclusive) || maxExclusive < 1) throw new RangeError("int: maxExclusive must be an integer >= 1");
      return Math.floor(next() * maxExclusive);
    },
    pick<T>(xs: readonly T[]): T {
      if (xs.length === 0) throw new RangeError("pick: empty list");
      return xs[this.int(xs.length)] as T;
    },
    weighted(weights: readonly number[]): number {
      let total = 0;
      let last = -1;
      for (let i = 0; i < weights.length; i += 1) {
        const w = weights[i];
        if (!positive(w)) continue;
        total += w;
        last = i;
      }
      if (total === 0) return -1;
      let roll = next() * total;
      for (let i = 0; i < weights.length; i += 1) {
        const w = weights[i];
        if (!positive(w)) continue;
        if (roll < w) return i;
        roll -= w;
      }
      return last;
    },
    state(): RngState { return { a }; },
  };
}

export function createRng(seed: number): Rng {
  return restoreRng({ a: seed >>> 0 });
}

export function streamSeed(seed: number, name: string): number {
  let h = (0x811c9dc5 ^ (seed >>> 0)) >>> 0;
  for (let i = 0; i < name.length; i += 1) h = Math.imul(h ^ name.charCodeAt(i), 0x01000193) >>> 0;
  return h >>> 0;
}
