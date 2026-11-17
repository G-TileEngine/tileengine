import type { Preset } from "./grid.ts";
const step = (kind: string): Record<string, unknown> => ({ kind, seconds: 0.24 });
const tile = (id: string, label: string, tags: readonly string[], n: number): Preset => ({ id, label, doc: { tags: tags.map((t) => ({ id: t })), steps: Array.from({ length: n }, (_, i) => step(i === 0 ? "stamp" : "flash")) } });
export const PRESETS: readonly Preset[] = [
  tile("arc", "Slash arc", ["slash"], 2),
  tile("pop", "Pop", ["burst", "shot"], 1),
  tile("scorch", "Scorch", ["burst"], 1),
  tile("aura", "Aura", ["aura"], 1),
  tile("heal", "Heal", ["heal"], 1),
  tile("buff", "Buff", ["buff"], 1),
  tile("ground", "Ground", ["ground"], 1),
];
