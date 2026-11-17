                                                             
                                                             
import { readHouse,            } from "../../src/editor/effect/house.js";
import { blend, impactMarks, keyOf,                                } from "../../src/editor/effect/merge.js";
import { snapMix } from "../../src/editor/effect/parts.js";
import { stepsOf,                  } from "../../src/runtime/render/fx-doc.js";
                                                              
export const PAGE2 = { show: 3, shelf: 48, picks: ["both", "a", "b", "mix"], punch: ["hit_stop_ms", "hit_white_ms", "shake", "squash"] }         ;
const KINDS = ["shape", "colour", "sparks", "light", "punch", "trail"]         , BEATS = ["cast", "travel", "hit", "linger"]         ;
                                                       
                                                                                                                                    
                                                                                                                                                    
const zero = ()                         => ({ cast: 0, travel: 0, hit: 0, linger: 0 });
const punches = (doc             )          => PAGE2.punch.some((k) => { const v = doc[k]; return v !== undefined && v !== 0 && v !== false; });
export function chips(doc             , badges                                        )         {
  const rows                                         = {};
  stepsOf(doc).forEach((_, i) => { const [layer, beat] = keyOf(doc, i).split(":"); const row = rows[layer ?? ""] ??= zero(); row[beat ?? ""] = (row[beat ?? ""] ?? 0) + 1; });
  if (punches(doc)) rows["punch"] ??= zero();
  return KINDS.flatMap((layer) => { const row = rows[layer]; if (row === undefined) return []; const sides = Object.keys(badges ?? {}).filter((k) => k.startsWith(`${layer}:`)).map((k) => badges?.[k]); const badge = sides.length === 0 ? null : sides.every((s) => s === sides[0]) ? sides[0] ?? null : "both"; return [{ layer, beats: row, badge }]; });
}
export const meterText = (m       )         => `Particles ${m.particles.n} of ${m.particles.cap} · Draws ${m.draws.n} of ${m.draws.cap}`;
export const trimLine = (m       )                => { const line = m.line.endsWith(" · Undo") ? m.line.slice(0, -" · Undo".length) : m.line; return line === "" ? null : line; };
export const beatRow = (doc             )                                                                            => { const marks = impactMarks(doc), n = zero(); stepsOf(doc).forEach((_, i) => { const b = keyOf(doc, i).split(":")[1] ?? ""; n[b] = (n[b] ?? 0) + 1; }); return BEATS.map((beat) => ({ beat, span: marks.beats[beat] ?? null, steps: n[beat] ?? 0 })); };
export const mixer = (a      , b      )        => ({ a, b, base: "a", mix: 50, picks: {} });
export const swap = (m       )        => ({ ...m, base: m.base === "a" ? "b" : "a" });
export const snap = (m       , mix        )        => ({ ...m, mix: typeof mix === "number" && Number.isFinite(mix) ? snapMix(mix) : 50 });
const rank = (k        )         => KINDS.indexOf((k.split(":")[0] ?? "")                        ) * 10 + BEATS.indexOf((k.split(":")[1] ?? "")                        );
export const keysOf = (m       )           => { const keys = new Set        (); for (const card of [m.a, m.b]) { stepsOf(card.doc).forEach((_, i) => keys.add(keyOf(card.doc, i))); if (punches(card.doc)) keys.add("punch:hit"); } return [...keys].sort((x, y) => rank(x) - rank(y)); };
export const cycle = (m       , key        )        => { const i = PAGE2.picks.indexOf((m.picks[key] ?? "both")                              ); return { ...m, picks: { ...m.picks, [key]: PAGE2.picks[(i + 1) % PAGE2.picks.length] ?? "a" } }; };
export const mixed = (m       , mint                            )        => blend(m.a, m.b, { base: m.base, mix: m.mix, mint, picks: m.picks });
export function take(base      , other      , layer        , mint                            )        {
  const picks                       = {};
  for (const card of [base, other]) stepsOf(card.doc).forEach((_, i) => { const k = keyOf(card.doc, i); picks[k] = k.startsWith(`${layer}:`) ? "b" : "a"; });
  if (punches(base.doc) || punches(other.doc)) picks["punch:hit"] = layer === "punch" ? "b" : "a";
  return blend(base, other, { base: "a", mix: 0, mint, picks });
}
export const shelve = (shelf                 , card      )         => [card, ...shelf.filter((c) => c.id !== card.id)].slice(0, PAGE2.shelf);
export const toggle = (picked                   , id        )           => { const next = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]; return next.length > 3 ? next.slice(next.length - 3) : next; };
export const page3 = (kids                  , at        )                                 => { const pages = Math.max(1, Math.ceil(kids.length / PAGE2.show)); const n = kids.length === 0 || !Number.isInteger(at) ? 0 : ((at % pages) + pages) % pages; return { at: n, shown: kids.slice(n * PAGE2.show, n * PAGE2.show + PAGE2.show) }; };
export const houseOf = (punch        , motes         , ramp               , styleRamps                   )        => readHouse({ effectHouse: { punch, motes, ramps: ramp === null ? [] : [ramp] } }, styleRamps).house;
