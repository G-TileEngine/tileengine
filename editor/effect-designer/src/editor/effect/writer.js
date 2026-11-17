                                                                  
import { exportClean } from "./parts.js";
                                          
                                                                                          
                                                                                                                                                                                                      
                                                                                                                                            
export const WRITER = { cap: 200, retries: 8, barriers: ["migrate"], ids: { steps: "s-", parts: "p-" } }         ;
const BAD = new Set(["__proto__", "constructor", "prototype"]);
const REN                         = { start_at: "start_at_ms", particle_life: "particle_life_ms", radius_from: "wave_from", radius_to: "wave_radius", ring_thickness_px: "wave_thickness_px", light: "light_mode", flash_center: "anchor", blank_at: "start_mode", ease: "look_ease" };
const TAB                                          = { light: { off: "off", steady: "steady", pop: "pop" }, flash_center: { hit: "target", caster: "caster", screen: "screen" }, blank_at: { hit: "at-hit", "step-start": "with-last" }, ease: { "fast-out": "out", linear: "linear" } };
const rec = (v         )             => (v !== null && typeof v === "object" && !Array.isArray(v) ? (v       ) : null);
const own = (o        , k        )          => Object.prototype.hasOwnProperty.call(o, k);
const omit = (o     , k        )      => Object.fromEntries(Object.entries(o).filter(([key]) => key !== k));
const num = (v         )         => (typeof v === "number" ? v : 0);
const seqOf = (ops                , base        )         => Math.max(base, ...ops.flatMap((op) => (typeof op["seq"] === "number" && Number.isInteger(op["seq"]) ? [op["seq"]] : []))) + 1;
export function canonStep(step     )      {
  const out      = {};
  for (const [k, v] of Object.entries(step)) {
    let key = k, val = v;
    if (k === "hold") { if (typeof v === "number") key = "hold_ms"; } else if (k === "flash_seconds") { if (typeof v === "number" && Number.isFinite(v)) { key = "flash_ms"; val = Math.round(v * 1000); } } else if (k === "smear_remnant") { if (typeof v === "boolean") { key = "smear_remnant_ms"; val = v ? 40 : 0; } } else if (own(REN, k) && !own(TAB, k)) key = REN[k] ?? k; else if (own(TAB, k) && own(TAB[k] ?? {}, String(v))) { key = REN[k] ?? k; val = (TAB[k] ?? {})[String(v)]; }
    if (key !== k && (own(step, key) || own(out, key))) continue; out[key] = val;
  }
  return out;
}
export const canonKnob                                        = (knob, v) => (knob === "variant_seed" && v === 0 ? undefined : knob === "pixel_scale" && typeof v === "string" && /^[1-6]$/.test(v) ? Number(v) : v);
const answersOf = (doc     )      => rec(doc["answers"]) ?? {};
const stateOf = (answer            )      => { const out      = answer === null ? { source: "default" } : {}; if (answer !== null) for (const [k, v] of Object.entries(answer)) if (k !== "rev") out[k] = v; return out; };
const listIds = (v         , into             )       => { if (!Array.isArray(v)) return; for (const item of v) { const o = rec(item); if (o !== null && typeof o["id"] === "string" && o["id"] !== "") into.add(o["id"]); } };
const readHist = (doc     )                                               => { const h = rec(doc["history"]) ?? {}, capRaw = h["cap"], baseRaw = h["baseSeq"]; return { cap: typeof capRaw === "number" && Number.isInteger(capRaw) && capRaw >= 1 && capRaw <= WRITER.cap ? capRaw : WRITER.cap, baseSeq: typeof baseRaw === "number" && Number.isInteger(baseRaw) ? baseRaw : 0, ops: (Array.isArray(h["ops"]) ? h["ops"] : []).flatMap((op) => { const o = rec(op); return o === null || !Number.isInteger(o["seq"]) || !Array.isArray(o["changes"]) || o["changes"].some((c) => rec(c) === null) ? [] : [o]; }) }; };
export function usedIds(doc     , knob        )              {
  const ids = new Set        (), live = rec(answersOf(doc)[knob]); if (live !== null) listIds(live["value"], ids);
  for (const op of readHist(doc).ops) for (const ch of op["changes"]             ) { const c = rec(ch); if (c === null || c["knob"] !== knob) continue; const b = rec(c["before"]), a = rec(c["after"]); if (b !== null) listIds(b["value"], ids); if (a !== null) listIds(a["value"], ids); }
  const ans = rec(rec((rec(doc["orphans"]) ?? {})[`${knob}#items`])?.["answer"]); if (ans !== null) listIds(ans["value"], ids); return ids;
}
export const valuesOf                            = (doc) => { const out      = {}; for (const [k, raw] of Object.entries(answersOf(doc))) { const a = rec(raw); if (a === null || a["source"] === "default" || !own(a, "value")) continue; out[k] = a["value"]; } return out; };
const mintId = (prefix        , held             , seen             , mint                       )         => { const bad = (id        )          => id === "" || seen.has(id) || held.has(id); for (let i = 0; i <= WRITER.retries; i += 1) { const id = mint(prefix); if (!bad(id)) return id; } const start = held.size + seen.size + 1; for (let n = start; n < start + held.size + seen.size + 1; n += 1) if (!bad(`${prefix}${n}`)) return `${prefix}${n}`; return `${prefix}${start}`; };
const freeze = (doc     , knob                   , list                    , mint                       )                                     => {
  const prefix = WRITER.ids[knob], held = usedIds(doc, knob), live = new Set        (), seen = new Set        (), value        = []; listIds(rec(answersOf(doc)[knob])?.["value"], live); let aliased = false;
  for (const item of list) { const o = rec(item); if (o === null) continue; const step = knob === "steps" ? canonStep(o) : { ...o }; if (knob === "steps" && JSON.stringify(step) !== JSON.stringify(o)) aliased = true; const id = step["id"], keep = typeof id === "string" && id !== "" && !seen.has(id) && (live.has(id) || !held.has(id)), next = keep ? id : mintId(prefix, held, seen, mint); step["id"] = next; seen.add(next); value.push(step); }
  return { value, aliased };
};
const desired = (prev            , value         )      => { const kept      = {}; if (prev !== null) for (const [k, v] of Object.entries(prev)) if (k !== "rev" && k !== "value" && k !== "source") kept[k] = v; return value === undefined ? { ...kept, source: "default" } : { ...kept, source: "user", value }; };
const canon = (v         )          => (Array.isArray(v) ? v.map(canon) : v !== null && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon((v       )[k])])) : v);
const same = (a     , b     )          => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
const pushOp = (ops       , cap        , baseSeq        , op     )         => { ops.push(op); while (ops.length > cap) { ops.shift(); baseSeq += 1; } return baseSeq; };
const tag = (op     , extra     )      => ({ ...extra, ...(typeof op["group"] === "string" ? { group: op["group"] } : {}) });
export function write(doc     , values                                   , o           )      {
  const hist = readHist(doc), changes           = [], aliased = new Set        ();
  for (const [knob, raw] of Object.entries(values)) { if (BAD.has(knob)) continue; const prev = rec(answersOf(doc)[knob]), frozen = (knob === "steps" || knob === "parts") && Array.isArray(raw) ? freeze(doc, knob, raw, o.mint) : null; if (frozen?.aliased === true) aliased.add(knob); const after = desired(prev, frozen !== null ? frozen.value : canonKnob(knob, raw)), before = stateOf(prev); if (!same(before, after)) changes.push({ knob, before, after }); }
  if (changes.length === 0) return doc;
  const rev = num(doc["rev"]) + 1, answers      = { ...answersOf(doc) }, orphans      = { ...(rec(doc["orphans"]) ?? {}) };
  for (const ch of changes) { const prev = rec(answers[ch.knob]); answers[ch.knob] = { ...ch.after, rev: num(prev?.["rev"]) + 1 }; if (ch.knob === "steps" && aliased.has("steps")) orphans["steps#items"] = { answer: prev ?? { source: "default" }, removedAtRev: rev, reason: "aliases normalised (M6)" }; }
  const ops = [...hist.ops]; const baseSeq = pushOp(ops, hist.cap, hist.baseSeq, { seq: seqOf(hist.ops, hist.baseSeq), at: o.at, kind: "set", changes, ...(o.group !== undefined ? { group: o.group } : {}), ...(o.note !== undefined ? { note: o.note } : {}) });
  return { ...doc, rev, updatedAt: o.at, answers, orphans, history: { cap: hist.cap, baseSeq, ops } };
}
const undoneOf = (ops                )              => { const undone = new Set        (); for (const op of ops) { const target = op["target"]; if (typeof target !== "number") continue; if (op["kind"] === "undo") undone.add(target); else if (op["kind"] === "redo") undone.delete(target); } return undone; };
const openOps = (ops       )        => { let wall = -1; ops.forEach((op, i) => { if ((WRITER.barriers                     ).includes(String(op["kind"]))) wall = i; }); const undone = undoneOf(ops); return ops.filter((op, i) => i > wall && op["kind"] !== "undo" && op["kind"] !== "redo" && !undone.has(op["seq"]          )); };
const apply = (answers     , knob        , state     )       => { if (BAD.has(knob)) return; answers[knob] = { ...state, rev: num(rec(answers[knob])?.["rev"]) + 1 }; };
const play = (doc     , at        , hist                                              , batch                , field                    , kind        )      => {
  const answers      = { ...answersOf(doc) }; let rev = num(doc["rev"]); const ops = [...hist.ops]; let baseSeq = hist.baseSeq;
  for (const op of batch) { for (const ch of (field === "before" ? op["changes"] : (hist.ops.find((item) => item["seq"] === op["target"]) ?? {})["changes"])                          ?? []) { const c = rec(ch); if (c !== null && typeof c["knob"] === "string") apply(answers, c["knob"], rec(c[field]) ?? { source: "default" }); } rev += 1; baseSeq = pushOp(ops, hist.cap, baseSeq, tag(op, { seq: seqOf(ops, baseSeq), at, kind, target: kind === "undo" ? op["seq"] : op["target"], changes: [] })); }
  return { ...doc, rev, updatedAt: at, answers, orphans: { ...(rec(doc["orphans"]) ?? {}) }, history: { cap: hist.cap, baseSeq, ops } };
};
export function undo(doc     , at        , o                      )      {
  const hist = readHist(doc), open = openOps(hist.ops); if (open.length === 0) return doc;
  const top = open[open.length - 1], group = o?.alone === true ? undefined : top?.["group"], members = (typeof group === "string" ? open.filter((op) => op["group"] === group) : [top]).filter((op)            => op !== undefined);
  if (typeof group === "string" && open.slice(open.indexOf(members[0]       ) + 1).some((op) => op["group"] !== group)) return doc;
  return play(doc, at, hist, [...members].reverse(), "before", "undo");
}
export function redo(doc     , at        )      {
  const hist = readHist(doc), newest = hist.ops[hist.ops.length - 1]; if (newest === undefined || (newest["kind"] !== "undo" && newest["kind"] !== "redo")) return doc;
  const undone = undoneOf(hist.ops), pending = [...hist.ops].reverse().filter((op) => op["kind"] === "undo" && typeof op["target"] === "number" && undone.has(op["target"])), seen = new Set        ();
  for (const op of pending) {
    const idx = hist.ops.indexOf(op); if (seen.has(idx)) continue; let lo = idx, hi = idx;
    if (typeof op["group"] === "string") { while (lo > 0 && hist.ops[lo - 1]?.["kind"] === "undo" && hist.ops[lo - 1]?.["group"] === op["group"]) lo -= 1; while (hi + 1 < hist.ops.length && hist.ops[hi + 1]?.["kind"] === "undo" && hist.ops[hi + 1]?.["group"] === op["group"]) hi += 1; }
    for (let j = lo; j <= hi; j += 1) seen.add(j);
    const held = hist.ops.slice(lo, hi + 1).filter((p) => hist.ops.some((item) => item["seq"] === p["target"] && item["kind"] !== "undo" && item["kind"] !== "redo"));
    if (held.length === 0) continue; return play(doc, at, hist, [...held].sort((a, b) => (a["target"]          ) - (b["target"]          )), "after", "redo");
  }
  return doc;
}
export function exportEffect(doc     , o                      )      {
  if (o?.clean !== true) return doc;
  const hist = readHist(doc), answers      = { ...answersOf(doc) }, parts = rec(answers["parts"]); if (parts !== null && Array.isArray(parts["value"])) answers["parts"] = { ...parts, value: exportClean({ parts: parts["value"]                         })["parts"] };
  const last = hist.ops[hist.ops.length - 1]?.["seq"]; return { ...doc, answers, orphans: omit(rec(doc["orphans"]) ?? {}, "parts#items"), history: { cap: hist.cap, baseSeq: typeof last === "number" ? last : hist.baseSeq, ops: [] } };
}
