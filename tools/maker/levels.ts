import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { curveOf, resetCurve, setLevels, setThreshold, setXpMove, turnOff, turnOn, type LevelWrite } from "../../src/editor/rules/levels.ts";
import { addCase, updateProject } from "../../src/editor/unit/add.ts";
import { BUNDLED } from "./catalogue.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
import { icon, thumb } from "./icons.ts";
type Obj = Record<string, unknown>;
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
export type LevelsHit = Host & { readonly banner: string | null; readonly toast?: string | null };
export type LevelsIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
let open = false, skel: Obj | null = null, stack: DocText[] = [];
export function rememberLevels(doc: unknown): void { if (!isObj(doc)) throw new Error("Can't open: templates"); skel = doc; }
export function levelsOpen(): boolean { return open; }
function bagOf(files: DocText): Record<string, Obj> | null { const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag; }
const slider = (id: string, label: string, value: number, min: number, max: number): string => `<label class="sub" for="k-${esc(id)}">${esc(label)}</label><input id="k-${esc(id)}" class="knob" type="range" min="${min}" max="${max}" step="1" value="${value}" data-lvl="${esc(id)}" aria-label="${esc(label)}"><span class="sub" data-val="${esc(id)}">${value}</span>`;
export function levelsSection(files: DocText, readOnly: boolean): string {
  const bag = bagOf(files); if (bag === null) return "";
  const gate = addCase(bag, BUNDLED), head = `<h2>Levels</h2>`;
  if (readOnly || gate.mode === "newer") return `${head}<div class="card"><p>${esc(gate.mode === "newer" ? gate.text : "Made with a newer TileEngine. Open only.")}</p></div>`;
  if (gate.mode === "older") return `${head}<div class="card">${thumb("levels")}<p>${esc(gate.text)}</p>${gate.update ? `<button type="button" class="btn ghost" data-act="l:update">Update</button>` : ""}</div>`;
  const view = curveOf(bag); if (view === null) return `${head}<div class="card">${thumb("levels")}<span class="name">Levels: Off</span><button type="button" class="btn ghost" data-act="l:on">Turn on levels</button></div>`;
  return `${head}<div class="card">${thumb("levels")}<button type="button" class="grow card-hit" data-act="l:open"><span class="name">Levels: ${view.n} · ${view.total} XP to the top</span></button></div>`;
}
export function levelsSheet(files: DocText, readOnly: boolean): string {
  if (!open || readOnly) return "";
  const bag = bagOf(files), view = bag === null ? null : curveOf(bag); if (view === null) return "";
  const rows = view.rows.map((value, i) => `<div data-row="${i}"><label class="sub" for="k-row-${i}">Level ${i + 1}</label><input id="k-row-${i}" class="knob" type="range" min="${view.rowMin}" max="${view.rowMax}" step="1" value="${value}" data-lvl="row-${i}" aria-label="Level ${i + 1}"><span class="sub" data-val="row-${i}">${value} XP</span></div>`).join("");
  return `<div class="scrim" data-sheet="levels"><div class="sheet" role="dialog"><header class="topbar"><button type="button" class="btn ghost" data-act="l:close">Back</button><h1>Levels</h1></header>${slider("levels", view.levelLabel, view.n, view.levelMin, view.levelMax)}<h2>XP to reach each level</h2>${rows}<button type="button" class="btn ghost" data-act="l:reset">Reset curve</button>${slider("xp_move", view.moveLabel, view.move, view.moveMin, view.moveMax)}<button type="button" class="btn primary" data-act="test">${icon("play")}Test</button><button type="button" class="btn ghost" data-act="l:off">Turn off levels</button></div></div>`;
}
const keptHost = (host: Host): LevelsHit => ({ ...host, banner: null });
const texts = (stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>, slice: string): DocText => { const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); if (slice !== "") next["catalogue/slice.json"] = slice; return next; };
async function commit(io: LevelsIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
async function save(io: LevelsIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, slice: string): Promise<LevelsHit> {
  const prev = stack; stack = [host.files];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after, slice));
  if (!wrote.ok) { stack = prev; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast: "Changed · Undo" };
}
async function undo(io: LevelsIo, host: Host): Promise<LevelsHit> {
  const snap = stack.pop(); if (snap === undefined) return { ...keptHost(host), toast: null };
  const wrote = await commit(io, host.files, host.rev, snap);
  if (!wrote.ok) { stack = [snap]; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast: null };
}
function apply(host: Host, io: LevelsIo, bag: Record<string, Obj>, got: LevelWrite): Promise<LevelsHit> {
  if (got.mode !== "wrote" || (got.slice === "" && got.bag === bag)) return Promise.resolve(keptHost(host));
  return save(io, host, bag, got.bag, got.slice);
}
export async function levelsAct(act: string, host: Host, io: LevelsIo): Promise<LevelsHit> {
  if (act === "l:open") { open = true; return keptHost(host); }
  if (act === "l:close") { open = false; return keptHost(host); }
  if (act === "l:undo") return undo(io, host);
  if (host.readOnly) return { ...keptHost(host), banner: "Made with a newer TileEngine. Open only." };
  const bag = bagOf(host.files); if (bag === null) return { ...keptHost(host), banner: "Can't open this project" };
  if (act === "l:update") { const wrote = updateProject(bag, BUNDLED); return wrote === null ? keptHost(host) : save(io, host, bag, wrote.bag, wrote.slice); }
  if (addCase(bag, BUNDLED).mode !== "same") return keptHost(host);
  if (act === "l:off") { open = false; return apply(host, io, bag, turnOff(bag)); }
  if (skel === null) return { ...keptHost(host), banner: "Can't open: setup.rule.json" };
  if (act === "l:on") return apply(host, io, bag, turnOn(bag, skel, `setup_${ulid(Date.parse(io.now), io.bytes())}`, BUNDLED));
  if (act === "l:reset") return apply(host, io, bag, resetCurve(bag));
  if (!act.startsWith("l:set:")) return keptHost(host);
  const rest = act.slice("l:set:".length), cut = rest.lastIndexOf(":"), key = rest.slice(0, cut), raw = Number(rest.slice(cut + 1));
  const row = key.startsWith("row-") ? Number(key.slice("row-".length)) : Number.NaN;
  const got = key === "levels" ? setLevels(bag, raw) : key === "xp_move" ? setXpMove(bag, raw) : Number.isInteger(row) ? setThreshold(bag, row, raw) : { mode: "missing" as const };
  return apply(host, io, bag, got);
}
