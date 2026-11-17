                                        
const step = (kind        , seconds = 0.24)                          => ({ kind, seconds });
const tile = (id        , label        , tags                   , n        , extra                          = {})         => ({ id, label, doc: { ...extra, tags: tags.map((t) => ({ id: t })), steps: Array.from({ length: n }, (_, i) => step(id === "pop" || (id === "mend" && i > 0) ? "particles" : i === 0 ? "stamp" : "flash", id === "arrow" ? 3 : id === "arc" ? 0.15 : 0.24)) } });
export const PRESETS                    = [
  tile("arc", "Slash arc", ["slash"], 2, { shake: 1 }),
  tile("pop", "Pop", ["burst", "shot"], 1, { hit_stop_ms: 40, shake: 1 }),
  tile("scorch", "Scorch", ["burst"], 1),
  tile("aura", "Aura", ["aura"], 1),
  tile("heal", "Heal", ["heal"], 1),
  tile("buff", "Buff", ["buff"], 1),
  tile("ground", "Ground", ["ground"], 1),
  tile("mend", "Mend", ["heal"], 2),
  tile("arrow", "Arrow", ["shot"], 2),
  tile("halo", "Halo", ["aura"], 1),
];