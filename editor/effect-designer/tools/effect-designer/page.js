import { createClock } from "../../src/core/clock/index.js";
import { createDriver,                                            } from "../../src/runtime/host/raf-driver.js";
import { createSceneLink } from "../../src/runtime/scene/world-scene.js";
                                                             
import { breed, pushRoll, roll } from "../../src/editor/effect/dice.js";
import { blankDoc } from "../../src/editor/effect/house.js";
import { meter } from "../../src/editor/effect/merge.js";
import { commit, ownerOf, redoGroup, saveAndUse, trashGone, undoGroup, undoStep,                       } from "../../src/editor/effect/save.js";
                                                             
                                                                      
import { RASTERS } from "../pixel-suite/fixture.js";
import { INTENTS, intentFor, rampChips, tiles,                          } from "./grid.js";
import { beatRow, chips, cycle, houseOf, keysOf, meterText, mixer, mixed, page3, shelve, snap, swap, take, toggle, trimLine,                       } from "./mixer.js";
import { PRESETS } from "./presets.js";
import { opfsStore, purgeTrash } from "./store.js";
import { fitZoom, preview, seen, STRIP, turn, VIEW0, zoom,           } from "./strip.js";
import { minter } from "./ulid.js";
const q = new URLSearchParams(location.search), who = q.get("for") ?? "effect", ownerFile = `setups/${who}.json`, styleRamps = (q.get("ramps") ?? "fire,frost,holy,venom").split(",");
const canvas = document.querySelector                   ("#strip"), toast = document.querySelector             ("#toast"), forEl = document.querySelector("#for");
if (canvas === null || toast === null || forEl === null) throw new Error("effect page");
forEl.textContent = `Designing for ${who}`;
const say = (t        , button         )       => { toast.replaceChildren(document.createTextNode(t)); if (button === undefined) return; const b = document.createElement("button"); b.type = "button"; b.textContent = button; b.addEventListener("click", () => void undo()); toast.append(document.createTextNode(" "), b); };
const redoBtn = ()       => { const b = document.createElement("button"); b.type = "button"; b.textContent = "Redo"; b.addEventListener("click", () => void redo()); toast.append(document.createTextNode(" "), b); };
const sheet = { id: "a", fw: 16, fh: 16, columns: 4 }, ground = { id: "g", fw: 16, fh: 16, columns: 4 }, link = createSceneLink(), clock = createClock(), board = Array.from({ length: STRIP.cols * STRIP.rows }, () => 1), made = new Map                           ();
const load = (id        )                             => { const hit = made.get(id); if (hit !== undefined) return Promise.resolve(hit); const r = RASTERS[id]; if (r === undefined) return Promise.reject(new Error(id)); const c = document.createElement("canvas"); c.width = r.w; c.height = r.h; const g = c.getContext("2d"); if (g === null) return Promise.reject(new Error(id)); const d = g.createImageData(r.w, r.h); r.px.forEach((p, i) => d.data.set([(p >>> 16) & 255, (p >>> 8) & 255, p & 255, 255], i * 4)); g.putImageData(d, 0, 0); made.set(id, c); return Promise.resolve(c); };
const env = { requestAnimationFrame: (cb                      )         => window.requestAnimationFrame(cb), cancelAnimationFrame: (id        )       => { window.cancelAnimationFrame(id); }, document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return window.devicePixelRatio; } }           ;
                                                                                                       
let view       = VIEW0, intent                = intentFor(q.get("kind")), ramp                = null, tile                    , driver                    , entry                   ;
let docs                      = {}, trash           = []; const taken = new Set        (), revs                                = {};
let chosen              = null, prev              = null, shelf         = [], picked           = [], anchor                     = null, rolls           = [], layer = "", mm               = null, kids          = [], kidAt = 0, kidOn = -1, punch = 0, motes = false;
let fitted = false, undone                                                                    = null;
const fit = ()         => fitZoom(canvas.clientWidth, canvas.clientHeight, devicePixelRatio, STRIP.cols * 16, STRIP.rows * 16); view = zoom(view, fit());
const store = opfsStore(await navigator.storage.getDirectory()), mint = minter(() => Date.now(), (n) => crypto.getRandomValues(new Uint8Array(n)));
await purgeTrash(store);
const seed = ()         => (crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) & 0x7fffffff;
const cardOf = (w      )       => ({ id: w.label, rev: 0, label: w.label, doc: w.doc });
const live = ()              => chosen ?? (tile === undefined ? null : { label: tile.label, doc: tile.doc, notes: [] });
const boot = ()       => { driver?.dispose(); driver = undefined; if (!view.visible) return; const doc = live()?.doc ?? {}, castAt = clock.now(), liveDriver = createDriver({ env, canvas: canvas                         , clock, clear: "#203040", load, view: () => { const p = preview(doc, view, castAt, sheet); return { scene: link.scene({ cols: STRIP.cols, rows: STRIP.rows, tileW: 16, tileH: 16, mapSeed: 1, overlays: [], objects: [], assets: { stand: { sheet }, g: { sheet: ground } }, layers: [{ tileset: "g", aboveUnits: false, visible: true, tiles: board }], units: p.units, effects: p.effects }, { tMs: clock.now(), stepMs: clock.stepMs }), x: 0, y: 0, s: view.zoom }; } }); driver = liveDriver; liveDriver.start(); };
const chip = (id        , label        , on         , go            )       => { const host = document.querySelector(`#${id}`); if (host === null) return; const b = document.createElement("button"); b.type = "button"; b.textContent = label; if (on) b.setAttribute("aria-pressed", "true"); b.addEventListener("click", go); host.append(b); };
const clear = (id        )       => { document.querySelector(`#${id}`)?.replaceChildren(); };
const use = (w      )       => { prev = live(); chosen = w; anchor = null; rolls = []; mm = null; kids = []; draw(); boot(); };
const sel = ()         => picked.flatMap((id) => { const c = shelf.find((x) => x.id === id); return c === undefined ? [] : [c]; });
const blendNow = (next       )       => { mm = next; const r = mixed(mm, mint), base = next.base === "a" ? next.a : next.b, other = next.base === "a" ? next.b : next.a; prev = live(); chosen = { label: `${base.label} × ${other.label}`, doc: r.doc, badges: r.badges, notes: [...r.messages] }; anchor = null; rolls = []; kids = []; draw(); boot(); };
const draw = ()       => {
  if (!fitted && canvas.clientWidth > 0) { view = zoom(view, fit()); fitted = true; }
  clear("intents"); clear("colour"); clear("grid"); clear("checks");
  const shown = tiles(PRESETS, intent, ramp); tile = shown.find((t) => t.id === tile?.id);
  for (const id of INTENTS) chip("intents", id.slice(0, 1).toUpperCase() + id.slice(1), id === intent, () => { intent = intent === id ? null : id; draw(); boot(); });
  for (const id of rampChips(["fire", "frost", "holy", "venom"], styleRamps)) chip("colour", id, id === ramp, () => { ramp = id; draw(); boot(); });
  for (const t of shown) chip("grid", t.label, t.id === tile?.id, () => { tile = t; use({ label: t.label, doc: t.doc, notes: [] }); });
  chip("checks", "Turn", false, () => { view = turn(seen(view, true)); boot(); }); chip("checks", "Fit", view.zoom === fit(), () => { view = zoom(seen(view, true), fit()); draw(); boot(); });
  for (const z of STRIP.zooms) chip("checks", `${z}×`, view.zoom === z, () => { view = zoom(seen(view, true), z); draw(); boot(); });
  page2();
};
const page2 = ()       => {
  const doc = live()?.doc ?? {}, badges = live()?.badges, notes = live()?.notes ?? [];
  clear("layers"); clear("meter"); clear("dice"); clear("shelf"); clear("blend"); clear("breed"); clear("house"); clear("beats"); clear("picks");
  for (const c of chips(doc, badges)) { const mark = c.badge === null ? "" : c.badge === "both" ? " A+B" : ` ${c.badge.toUpperCase()}`; chip("layers", `${c.layer}${mark}`, layer === c.layer, () => { layer = c.layer; draw(); }); }
  const m = meter(doc, notes), line = trimLine(m), meterHost = document.querySelector("#meter"); meterHost?.append(Object.assign(document.createElement("span"), { textContent: meterText(m) }));
  if (line !== null && meterHost !== null) { meterHost.append(Object.assign(document.createElement("span"), { textContent: line })); chip("meter", "Undo", false, () => { if (prev === null) return; chosen = prev; prev = null; draw(); boot(); }); }
  if (layer !== "") chip("dice", `Dice ${layer}`, false, () => { const l = layer, w = live(); if (w === null) return; if (anchor === null) anchor = w.doc; const s = seed(); rolls = pushRoll(rolls, s); const rolled = roll(anchor, l, s); chosen = { label: w.label, doc: rolled.doc, notes: rolled.messages }; draw(); boot(); });
  rolls.forEach((s, i) => chip("dice", `#${i + 1}`, false, () => { const l = layer; if (anchor === null) return; const rolled = roll(anchor, l, s); const w = live(); if (w === null) return; chosen = { ...w, doc: rolled.doc, notes: rolled.messages }; draw(); boot(); }));
  chip("shelf", "Shelf it", false, () => { if (chosen !== null) shelf = shelve(shelf, cardOf(chosen)); draw(); });
  for (const c of shelf) chip("shelf", c.label, picked.includes(c.id), () => { picked = toggle(picked, c.id); mm = null; draw(); });
  const one = sel()[0], cur = live();
  if (picked.length === 1 && one !== undefined && cur !== null) { const base = cardOf(cur); for (const c of chips(one.doc)) chip("blend", `Take its ${c.layer}`, false, () => { const r = take(base, one, c.layer, mint); use({ label: cur.label, doc: r.doc, badges: r.badges, notes: [...r.messages] }); }); }
  if (picked.length >= 2) chip("blend", "Blend with…", false, () => { const a = sel()[0], b = sel()[1]; if (a !== undefined && b !== undefined) blendNow(mixer(a, b)); });
  if (mm !== null) { const baseCard = mm.base === "a" ? mm.a : mm.b, host = document.querySelector("#blend"); host?.prepend(Object.assign(document.createElement("span"), { textContent: `Base ${baseCard.label}` })); chip("blend", "Swap", false, () => { if (mm !== null) blendNow(swap(mm)); }); for (const v of [0, 25, 50, 75, 100]) chip("blend", String(v), mm.mix === v, () => { if (mm !== null) blendNow(snap(mm, v)); }); }
  if (picked.length >= 2) chip("breed", "Breed", false, () => { kids = breed(sel(), { seed: seed(), mint }); kidAt = 0; kidOn = 0; const first = page3(kids, kidAt).shown[0]; if (first !== undefined) { chosen = { label: "Child 1", doc: first.doc, notes: [...first.messages] }; anchor = null; rolls = []; } draw(); boot(); });
  page3(kids, kidAt).shown.forEach((k, i) => chip("breed", `Child ${kidAt * 3 + i + 1}`, kidOn === kidAt * 3 + i, () => { kidOn = kidAt * 3 + i; chosen = { label: `Child ${kidOn + 1}`, doc: k.doc, notes: [...k.messages] }; draw(); boot(); }));
  if (kids.length > 0) chip("breed", "Next 3", false, () => { const at = page3(kids, kidAt + 1).at; kidAt = at; kidOn = at * 3; const first = page3(kids, at).shown[0]; if (first !== undefined) chosen = { label: `Child ${kidOn + 1}`, doc: first.doc, notes: [...first.messages] }; draw(); boot(); });
  for (const n of [0, 1, 2, 3]) chip("house", `Punch ${n}`, punch === n, () => { punch = n; draw(); });
  chip("house", "Motes", motes, () => { motes = !motes; draw(); });
  chip("house", "New blank", false, () => { use({ label: "Blank", doc: blankDoc(houseOf(punch, motes, ramp, styleRamps), mint), notes: [] }); });
  const beats = document.querySelector("#beats"); for (const b of beatRow(doc)) beats?.append(Object.assign(document.createElement("span"), { textContent: `${b.beat.slice(0, 1).toUpperCase()}${b.beat.slice(1)} ${b.steps}${b.span === null ? "" : ` ${b.span[0]}–${b.span[1]} ms`}` }));
  if (mm !== null) for (const k of keysOf(mm)) chip("picks", `${k} ${mm.picks[k] ?? "both"}`, false, () => { if (mm !== null) blendNow(cycle(mm, k)); });
};
const at = ()         => new Date().toISOString();
const save = async ()                => { const work = live(); if (work === null) return; try {
  const read = ownerOf(ownerFile, await store.read(ownerFile)); if ("error" in read) { say(read.message); return; }
  revs[ownerFile] = read.doc === null ? null : Number(read.doc["rev"]);
  const id = mint("setup_"), label = work.label, owner = read.doc ?? { kind: "behaviour-setup", formatVersion: 3, id: who, name: who, rev: 0, behaviourId: who, catalogue: { rev: 28 }, createdAt: at(), updatedAt: at(), copiedFrom: null, answers: {}, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [] } };
  const out = saveAndUse({ name: `effects/${id}.json`, doc: null, values: work.doc }, { name: ownerFile, doc: owner }, { at: at(), mint, id, label, catalogueRev: 28, taken: [...taken] });
  if ("error" in out) { say(out.message); return; }
  const done = await commit(store, out.docs, revs, { absent: out.absent }); if ("error" in done) { say(`Not saved: ${done.name} changed. Nothing was changed.`); return; }
  try { for (const t of trash) await store.remove(t); } catch { /* best-effort */ }
  docs = out.docs; entry = out.entry; trash = []; undone = null; taken.add(id); for (const [k, d] of Object.entries(out.docs)) revs[k] = Number(d["rev"]); say(`Saved '${label}' and ${who} uses it. One undo.${out.notes.length === 0 ? "" : ` ${out.notes.map((n) => n.message).join(" ")}`}`, "Undo");
} catch (e) { say(`Not saved: storage error (${e instanceof Error ? e.message : "error"}). Nothing was changed.`); } };
const undo = async ()                => { if (entry === undefined) return; const held = entry; try {
  const got = undoGroup(docs, entry, at());
  if ("error" in got) { const cur = docs[got.name]; if (cur === undefined) { say(got.error); return; } const next = undoStep(cur, at()); const one = await commit(store, { [got.name]: next }, revs); if ("error" in one) { say(one.error); return; } docs[got.name] = next; revs[got.name] = Number(next["rev"]); entry = undefined; say("Undone."); return; }
  const done = await commit(store, got.docs, revs, { moves: got.moves }); if ("error" in done) { say(`${done.error} ${done.name}`); return; }
  docs = { ...got.docs }; entry = undefined; undone = { entry: held, moves: got.moves, docs: got.docs }; for (const m of got.moves) { trash.push(m.to); revs[m.from] = null; revs[m.to] = Number(m.doc["rev"] ?? 0); } for (const [k, d] of Object.entries(docs)) revs[k] = Number(d["rev"]); say("Undone."); redoBtn();
} catch (e) { say(`Not undone: storage error (${e instanceof Error ? e.message : "error"}). Nothing was changed.`); } };
const redo = async ()                => { if (undone === null) return; try {
  const got = redoGroup(docs, undone.entry, undone.moves, at()); if ("error" in got) { say(got.error); return; }
  const r = await commit(store, got.docs, revs, { moves: got.moves });
  const gone = trashGone(r, got.moves); if (gone !== null) undone = null;
  if (gone !== null) { say("Not redone: its deleted copy is gone (a reload cleared it, maybe in another tab). Nothing was changed."); return; }
  if ("error" in r) { say(`${r.error} ${r.name}`); return; }
  docs = got.docs; entry = undone.entry; undone = null; for (const m of got.moves) { revs[m.from] = null; revs[m.to] = Number(m.doc["rev"] ?? 0); } for (const [k, d] of Object.entries(docs)) revs[k] = Number(d["rev"]); say("Redone. One undo.", "Undo");
} catch (e) { say(`Not redone: storage error (${e instanceof Error ? e.message : "error"}). Nothing was changed.`); } };
draw(); boot(); new IntersectionObserver((es) => { const next = seen(view, es.some((e) => e.isIntersecting)); if (next === view) return; view = next; boot(); }, { rootMargin: "320px 0px 320px 0px" }).observe(canvas);
document.querySelector("#save")?.addEventListener("click", () => void save()); document.querySelector("#undo")?.addEventListener("click", () => void undo());
