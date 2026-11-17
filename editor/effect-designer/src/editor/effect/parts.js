                                                   
import { hash32 } from "../../runtime/render/frames.js";
                                                                  
import { variantSeed } from "../../runtime/render/fx-particles.js";
export const PARTS = { max: 6, kinds: ["shape", "colour", "sparks", "light", "punch", "trail"], beats: ["cast", "travel", "hit", "linger"], gridMs: 30, snaps: [0, 25, 50, 75, 100] }         ;
                                                                     
                                                                                                                                                                                
const rec = (v         )                                 => (v !== null && typeof v === "object" && !Array.isArray(v) ? (v                           ) : null);
const readFrom = (v         )                   => { const o = rec(v); return o !== null && typeof o["effect"] === "string" && typeof o["rev"] === "number" ? { effect: o["effect"], rev: o["rev"] } : undefined; };
export const partsOf = (doc             )         => (Array.isArray(doc["parts"]) ? doc["parts"] : []).flatMap((item) => {
  const o = rec(item); if (o === null || typeof o["id"] !== "string" || typeof o["kind"] !== "string" || !Array.isArray(o["beats"])) return [];
  const from = readFrom(o["from"]);
  return [{ id: o["id"], kind: o["kind"], beats: o["beats"].filter((b)              => typeof b === "string"), ...(from === undefined ? {} : { from }), ...(typeof o["nudge_ms"] === "number" ? { nudge_ms: o["nudge_ms"] } : {}), ...(typeof o["label"] === "string" ? { label: o["label"] } : {}) }];
});
export function checkParts(doc             )           {
  const notes           = [], raw = doc["parts"];
  if (raw !== undefined && !Array.isArray(raw)) return [{ code: "invalidValue", message: "parts" }];
  const list = Array.isArray(raw) ? raw : [], ids = new Set        ();
  if (list.length > PARTS.max) notes.push({ code: "overCap", message: `parts: ${list.length} of ${PARTS.max}` });
  list.forEach((item, i) => {
    const o = rec(item); if (o === null) { notes.push({ code: "invalidValue", message: `parts[${i}]` }); return; }
    const id = o["id"], kind = o["kind"], beats = o["beats"];
    if (typeof id !== "string") notes.push({ code: "invalidValue", message: `parts[${i}].id` }); else if (ids.has(id)) notes.push({ code: "invalidValue", message: `parts[${i}].id duplicate` }); else ids.add(id);
    if (typeof kind !== "string") notes.push({ code: "invalidValue", message: `parts[${i}].kind` }); else if (!(PARTS.kinds                     ).includes(kind)) notes.push({ code: "outOfRange", message: `parts[${i}].kind` });
    if (!Array.isArray(beats) || beats.length === 0 || beats.some((b) => typeof b !== "string")) notes.push({ code: "invalidValue", message: `parts[${i}].beats` }); else if (beats.some((b) => !(PARTS.beats                     ).includes(String(b)))) notes.push({ code: "outOfRange", message: `parts[${i}].beats` });
    if ("from" in o && readFrom(o["from"]) === undefined) notes.push({ code: "invalidValue", message: `parts[${i}].from` });
    if ("nudge_ms" in o) { const nudge = o["nudge_ms"]; if (typeof nudge !== "number" || !Number.isInteger(nudge)) notes.push({ code: "outOfRange", message: `parts[${i}].nudge_ms` }); else if (nudge % PARTS.gridMs !== 0) notes.push({ code: "offStep", message: `parts[${i}].nudge_ms` }); }
    if ("label" in o && typeof o["label"] !== "string") notes.push({ code: "invalidValue", message: `parts[${i}].label` });
  });
  (Array.isArray(doc["steps"]) ? doc["steps"] : []).forEach((item, i) => {
    const o = rec(item); if (o === null || !("part" in o)) return; const part = o["part"];
    if (typeof part !== "string") notes.push({ code: "invalidValue", message: `steps[${i}].part` }); else if (!ids.has(part)) notes.push({ code: "unknownRef", message: `steps[${i}].part ${part}` });
  });
  return notes;
}
                                                                                
                                                                    
export function fromInfo(selfId        , doc             , look                            )                                       {
  const cyc = (start        )          => {
    const gray = new Set        (), done = new Set        (), walk = (id        )          => {
      if (id === selfId || gray.has(id)) return true;
      if (done.has(id)) return false;
      const src = look(id); if (src === null) return false;
      gray.add(id);
      const hit = partsOf(src.doc).some((p) => p.from !== undefined && walk(p.from.effect));
      gray.delete(id); if (!hit) done.add(id); return hit;
    };
    return walk(start);
  };
  return partsOf(doc).flatMap((p) => { const from = p.from; if (from === undefined) return []; const src = look(from.effect); const state            = src === null && from.effect !== selfId ? "removed" : cyc(from.effect) ? "cycle" : src !== null && src.rev === from.rev ? "current" : "changed"; return [{ part: p.id, state }]; });
}
export const exportClean = (doc             )              => (!Array.isArray(doc["parts"]) ? doc : { ...doc, parts: doc["parts"].map((item) => { const o = rec(item); if (o === null) return item; const copy = { ...o }; delete copy["from"]; return copy; }) });
export const writeSeed = (seed        )                     => (seed === 0 ? undefined : seed);
export const snapMix = (mix        )         => Math.min(100, Math.max(0, Math.round(mix / 25) * 25));
export const blendSeed = (a         , b         , mix        , base           )         => (hash32(variantSeed(a).seed, `blend:${snapMix(mix)}:${base}`, variantSeed(b).seed, 0) & 0x7fffffff);
