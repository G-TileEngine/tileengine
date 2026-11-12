export type SaveStep = (doc: Readonly<Record<string, unknown>>) => Readonly<Record<string, unknown>>;
export type SaveChains = Readonly<Record<"save" | "match-save", Readonly<Record<number, SaveStep>>>>;
export const SAVE_FORMAT = 1;
export const SAVE_MIGRATIONS: SaveChains = Object.freeze({ save: Object.freeze({}), "match-save": Object.freeze({}) });
export function migrateSave(kind: "save" | "match-save", doc: Readonly<Record<string, unknown>>, from: number, to = SAVE_FORMAT, chains: SaveChains = SAVE_MIGRATIONS): Readonly<Record<string, unknown>> | null {
  let cur = doc; const steps = chains[kind];
  for (let v = from; v < to; v += 1) {
    const step = steps[v]; if (step === undefined) return null;
    const next: unknown = step(cur);
    if (typeof next !== "object" || next === null) throw new TypeError("migrateSave: a step must return an object");
    cur = next as Readonly<Record<string, unknown>>;
  }
  return cur;
}
