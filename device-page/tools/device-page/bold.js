                                                                                                                            
                                               
                                                                                                                                                                                                            
                                                                                                                                         
                                                                                                                                                                    
                                                                                 
const ORDER = ["caster", "breed", "rhythm", "export", "tiers", "path", "linger6", "react", "fusion", "living"]         ;
export const IDEAS                                                                           = [
  { token: "caster", ux: "B3", name: "Caster colours", ms: 0.5 }, { token: "breed", ux: "B1", name: "Breed", ms: 2 },
  { token: "rhythm", ux: "B4", name: "Tap the rhythm", ms: 0.3 }, { token: "export", ux: "B10", name: "Export as asset", ms: null },
  { token: "tiers", ux: "B7", name: "Power-up tiers", ms: 1 }, { token: "path", ux: "B2", name: "Draw the spell", ms: 2 },
  { token: "linger6", ux: "B6", name: "World-aware linger", ms: 1.5 }, { token: "react", ux: "B5", name: "Element reactions", ms: 1 },
  { token: "fusion", ux: "B8", name: "Combo fusion", ms: 2 }, { token: "living", ux: "B9", name: "Living linger", ms: 2.5 },
];
export const SHARED = { p95: 18.3, overMs: 50, dropMs: 25, dropShare: 0.01, mb: 160 }         ;
export const AB = { blockMs: 20_000, blocks: 6, visitMs: 120_000, hashEveryMs: 5_000 }         ;
const SEED_MAX = 2147483647;
export function parseFlags(bold               , seed               )        {
  const raw = (bold ?? "").split(",").map((s) => s.trim()).filter((s) => s !== ""), unknown           = [], picked = new Set       ();
  let sawOff = false, other = false;
  for (const tok of raw) {
    if (tok === "off") { sawOff = true; continue; }
    other = true;
    if ((ORDER                     ).includes(tok)) picked.add(tok         ); else if (!unknown.includes(tok)) unknown.push(tok);
  }
  const mixed = sawOff && other, on = mixed ? [] : ORDER.filter((t) => picked.has(t)), notices = [...unknown.map((u) => `"${u}" stays off`), ...(mixed ? ["off mixed with tokens stays off"] : [])];
  const seedOk = seed === null || (/^\d+$/.test(seed) && Number(seed) <= SEED_MAX);
  if (!seedOk) notices.push("playing seed 0");
  return { present: bold !== null, on, unknown, seed: seedOk && seed !== null ? Number(seed) : 0, notices, scored: !mixed && unknown.length === 0 && on.length <= 1 };
}
export function blockAt(ms        )        {
  const done = Number.isFinite(ms) && ms >= AB.visitMs, t = done ? AB.visitMs : Math.max(0, Number.isFinite(ms) ? ms : 0), i = Math.min(AB.blocks - 1, Math.floor(t / AB.blockMs)), on = i % 2 === 1;
  return { i, on, label: `${on ? "ON" : "OFF"} ${i + 1}/${AB.blocks}`, leftS: done ? 0 : Math.ceil(((i + 1) * AB.blockMs - t) / 1000), done };
}
export function pool(gaps                   )       {
  const s = [...gaps].sort((a, b) => a - b), at = (q        )         => s[Math.floor(s.length * q)] ?? 0;
  let dropped = 0, over50 = 0;
  for (const v of gaps) { if (v > SHARED.dropMs) dropped += 1; if (v > SHARED.overMs) over50 += 1; }
  return { p50: at(0.5), p95: at(0.95), max: s[s.length - 1] ?? 0, dropped, over50, frames: gaps.length };
}
export function createAB()                                                                                             {
  const off           = [], on           = [];
  return { add(visitMs, gap)       { if (visitMs >= AB.visitMs) return; (blockAt(visitMs).on ? on : off).push(gap); }, get off() { return off; }, get on() { return on; } };
}
export const canvasMb = (backendBytes        , w        , h        )         => (backendBytes + w * h * 4) / 1048576;
export function verdict(v                                                                                                 )          {
  const why           = [];
  if (v.ms !== null && v.on.p95 - v.off.p95 > v.ms) why.push(`on−off p95 ${(v.on.p95 - v.off.p95).toFixed(2)} > ${v.ms}`);
  if (v.off.p95 > SHARED.p95 || v.on.p95 > SHARED.p95) why.push(`p95 > ${SHARED.p95}`);
  if (v.off.max > SHARED.overMs || v.on.max > SHARED.overMs) why.push(`a frame > ${SHARED.overMs}`);
  const frames = v.off.frames + v.on.frames;
  if (frames > 0 && (v.off.dropped + v.on.dropped) / frames > SHARED.dropShare) why.push("dropped > 1 %");
  if (v.canvasMb > SHARED.mb) why.push(`canvas > ${SHARED.mb}`);
  if (v.heapMb !== null && v.heapMb > SHARED.mb) why.push(`heap > ${SHARED.mb}`);
  if (v.hash === "FAIL") why.push("hash FAIL");
  return { red: why.length > 0, why };
}
export const hashPass = (frameAt                          )           => { const out           = []; for (let t = 0; t < AB.visitMs; t += AB.hashEveryMs) out.push(JSON.stringify(frameAt(t))); return out; };
export const hashCheck = (a                   , b                   )       => a.length === AB.visitMs / AB.hashEveryMs && a.length === b.length && a.every((v, i) => v === b[i]) ? "PASS" : "FAIL";
const row = (name        , p      )         => `${name} p50 ${p.p50.toFixed(1)} p95 ${p.p95.toFixed(1)} max ${p.max.toFixed(1)} dropped ${p.dropped} over-50 ${p.over50} frames ${p.frames}`;
export function readout(r                                                                                                                                                                                                      )         {
  const idea = r.flags.on.length === 1 ? IDEAS.find((i) => i.token === r.flags.on[0]) : undefined;
  const v = verdict({ ms: r.flags.on.length === 1 ? idea?.ms ?? null : null, off: r.off, on: r.on, canvasMb: r.canvasPeak, heapMb: r.heapPeak, hash: r.hash === "pending" ? "PASS" : r.hash });
  const scored = r.flags.scored && r.cap && r.lite === "off", budget = `${scored ? "" : "NOT SCORED "}${v.red ? "budget RED" : "budget GREEN"}${v.why.length > 0 ? ` (${v.why.join("; ")})` : ""}`;
  return `${r.block.done ? "DONE\n" : ""}${r.block.label} ${r.block.leftS}s left\nbold ${r.flags.on.join(",") || "off"} seed ${r.flags.seed} cap ${r.cap ? "on" : "off"} lite ${r.lite} switches ${r.switches}\n${row("off", r.off)}\n${row("on", r.on)}\non−off p95 ${(r.on.p95 - r.off.p95).toFixed(2)} ms ${idea?.ms ?? "none"}\ncanvas MB peak ${r.canvasPeak.toFixed(1)} heap MB peak ${r.heapPeak === null ? "n/a" : r.heapPeak.toFixed(1)} G5b device cap ${SHARED.mb}\nhash ${r.hash}${r.block.done ? ` in-page 2nd pass #${r.hashOf}` : ""}${r.flags.on.includes("living") ? " VISUAL ONLY" : ""}\n${budget}${r.flags.notices.length > 0 ? `\n${r.flags.notices.join("\n")}` : ""}${r.extra.length > 0 ? `\n${r.extra.join("\n")}` : ""}`;
}
