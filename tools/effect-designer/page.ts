import { createClock } from "../../src/core/clock/index.ts";
import { createDriver, type Driver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { commit, ownerOf, saveAndUse, undoGroup, undoStep, type Entry } from "../../src/editor/effect/save.ts";
import type { Row } from "../../src/editor/effect/writer.ts";
import { RASTERS } from "../pixel-suite/fixture.ts";
import { INTENTS, intentFor, rampChips, tiles, type Intent, type Preset } from "./grid.ts";
import { PRESETS } from "./presets.ts";
import { opfsStore } from "./store.ts";
import { preview, seen, STRIP, turn, VIEW0, zoom, type View } from "./strip.ts";
const ALPH = "0123456789ABCDEFGHJKMNPQRSTVWXYZ", q = new URLSearchParams(location.search), who = q.get("for") ?? "effect", ownerFile = `setups/${who}.json`;
const canvas = document.querySelector<HTMLCanvasElement>("#strip"), toast = document.querySelector<HTMLElement>("#toast"), forEl = document.querySelector("#for");
if (canvas === null || toast === null || forEl === null) throw new Error("effect page");
forEl.textContent = `Designing for ${who}`; const say = (t: string): void => { toast.textContent = t; };
const sheet = { id: "a", fw: 16, fh: 16, columns: 4 }, ground = { id: "g", fw: 16, fh: 16, columns: 4 }, link = createSceneLink(), clock = createClock(), board = Array.from({ length: STRIP.cols * STRIP.rows }, () => 1), made = new Map<string, HTMLCanvasElement>();
const load = (id: string): Promise<HTMLCanvasElement> => { const hit = made.get(id); if (hit !== undefined) return Promise.resolve(hit); const r = RASTERS[id]; if (r === undefined) return Promise.reject(new Error(id)); const c = document.createElement("canvas"); c.width = r.w; c.height = r.h; const g = c.getContext("2d"); if (g === null) return Promise.reject(new Error(id)); const d = g.createImageData(r.w, r.h); r.px.forEach((p, i) => d.data.set([(p >>> 16) & 255, (p >>> 8) & 255, p & 255, 255], i * 4)); g.putImageData(d, 0, 0); made.set(id, c); return Promise.resolve(c); };
const env = { requestAnimationFrame: (cb: (ts: number) => void): number => window.requestAnimationFrame(cb), cancelAnimationFrame: (id: number): void => { window.cancelAnimationFrame(id); }, document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return window.devicePixelRatio; } } as HostEnv;
let view: View = VIEW0, intent: Intent | null = intentFor(q.get("kind")), ramp: string | null = null, picked: Preset | undefined, driver: Driver | undefined, entry: Entry | undefined;
let docs: Record<string, Row> = {}, trash: string[] = [], n = 0; const taken = new Set<string>(), revs: Record<string, number | null> = {};
const store = opfsStore(await navigator.storage.getDirectory()), mint = (p: string): string => `${p}${n += 1}`, ulid = (): string => { const b = new Uint8Array(26); crypto.getRandomValues(b); let s = "setup_"; for (const x of b) s += ALPH[x % 32] ?? "0"; return s; };
const boot = (): void => { driver?.dispose(); driver = undefined; if (!view.visible) return; const doc = picked?.doc ?? {}, castAt = clock.now(), live = createDriver({ env, canvas: canvas as unknown as HostCanvas, clock, clear: "#203040", load, view: () => { const p = preview(doc, view, castAt, sheet); return { scene: link.scene({ cols: STRIP.cols, rows: STRIP.rows, tileW: 16, tileH: 16, mapSeed: 1, overlays: [], objects: [], assets: { stand: { sheet }, g: { sheet: ground } }, layers: [{ tileset: "g", aboveUnits: false, visible: true, tiles: board }], units: p.units, effects: p.effects }, { tMs: clock.now(), stepMs: clock.stepMs }), x: 0, y: 0, s: view.zoom }; } }); driver = live; live.start(); };
const chip = (host: Element, label: string, on: boolean, go: () => void): void => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; if (on) b.setAttribute("aria-pressed", "true"); b.addEventListener("click", go); host.append(b); };
const draw = (): void => {
  const node = (id: string): Element => { const n = document.querySelector(id); if (n === null) throw new Error(id); return n; };
  const what = node("#what"), colour = node("#colour"), grid = node("#grid"), turnRow = node("#turn"), shown = tiles(PRESETS, intent, ramp);
  picked = shown.find((t) => t.id === picked?.id); what.replaceChildren(); colour.replaceChildren(); grid.replaceChildren(); turnRow.replaceChildren();
  for (const id of INTENTS) chip(what, id.slice(0, 1).toUpperCase() + id.slice(1), id === intent, () => { intent = id; draw(); boot(); });
  for (const id of rampChips(["fire", "frost", "holy", "venom"], (q.get("ramps") ?? "fire,frost,holy,venom").split(","))) chip(colour, id, id === ramp, () => { ramp = id; draw(); boot(); });
  for (const t of shown) chip(grid, t.label, t.id === picked?.id, () => { picked = t; draw(); boot(); });
  chip(turnRow, "Turn", false, () => { view = turn(view); boot(); }); for (const z of STRIP.zooms) chip(turnRow, `${z}×`, view.zoom === z, () => { view = zoom(view, z); draw(); boot(); });
};
const at = (): string => new Date().toISOString();
const save = async (): Promise<void> => { if (picked === undefined) return; try {
  const read = ownerOf(ownerFile, await store.read(ownerFile)); if ("error" in read) { say(read.message); return; }
  revs[ownerFile] = read.doc === null ? null : Number(read.doc["rev"]);
  const id = ulid(), label = picked.label, owner = read.doc ?? { kind: "behaviour-setup", formatVersion: 3, id: who, name: who, rev: 0, behaviourId: who, catalogue: { rev: 28 }, createdAt: at(), updatedAt: at(), copiedFrom: null, answers: {}, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [] } };
  const out = saveAndUse({ name: `effects/${id}.json`, doc: null, values: picked.doc }, { name: ownerFile, doc: owner }, { at: at(), mint, id, label, catalogueRev: 28, taken: [...taken] });
  if ("error" in out) { say(out.message); return; }
  const done = await commit(store, out.docs, revs, { absent: out.absent }); if ("error" in done) { say(`Not saved: ${done.name} changed. Nothing was changed.`); return; }
  try { for (const t of trash) await store.remove(t); } catch { /* best-effort */ }
  docs = out.docs; entry = out.entry; trash = []; taken.add(id); for (const [k, d] of Object.entries(out.docs)) revs[k] = Number(d["rev"]); say(`Saved '${label}' and ${who} uses it. One undo.${out.notes.length === 0 ? "" : ` ${out.notes.map((n) => n.message).join(" ")}`}`);
} catch (e) { say(`Not saved: storage error (${e instanceof Error ? e.message : "error"}). Nothing was changed.`); } };
const undo = async (): Promise<void> => { if (entry === undefined) return; try {
  const got = undoGroup(docs, entry, at());
  if ("error" in got) { const cur = docs[got.name]; if (cur === undefined) { say(got.error); return; } const next = undoStep(cur, at()); const one = await commit(store, { [got.name]: next }, revs); if ("error" in one) { say(one.error); return; } docs[got.name] = next; revs[got.name] = Number(next["rev"]); entry = undefined; say("Undone."); return; }
  const done = await commit(store, got.docs, revs, { moves: got.moves }); if ("error" in done) { say(`${done.error} ${done.name}`); return; }
  docs = { ...got.docs }; entry = undefined; for (const m of got.moves) trash.push(m.to); for (const [k, d] of Object.entries(docs)) revs[k] = Number(d["rev"]); say("Undone.");
} catch (e) { say(`Not undone: storage error (${e instanceof Error ? e.message : "error"}). Nothing was changed.`); } };
draw(); boot(); new IntersectionObserver((es) => { const next = seen(view, es.some((e) => e.isIntersecting)); if (next === view) return; view = next; boot(); }).observe(canvas);
document.querySelector("#save")?.addEventListener("click", () => void save()); document.querySelector("#undo")?.addEventListener("click", () => void undo());
