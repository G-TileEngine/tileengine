import { prefix, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { clearGround, paintCells } from "../../src/editor/stage/paint.ts";
import { closedType, sheetRows, typeLabel, type SheetRow } from "../../src/editor/stage/sheet.ts";
import { canUndo, pop, push } from "../../src/editor/stage/undo.ts";
import type { ProjectFiles } from "../../src/project/load/types.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
type Obj = Record<string, unknown>;
type Cell = { readonly c: number; readonly r: number };
type Mark = { readonly c: number; readonly r: number; readonly letter: string; readonly pill: string; readonly name: string };
export type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly banner: string | null; readonly dirty: boolean };
export type StageOut = Host & { readonly leave: boolean; readonly test: boolean };
export type Io = { readonly store: MakerStore; readonly id: string; readonly now: string };
export type Saved = { readonly ok: true; readonly files: DocText; readonly rev: number; readonly dirty: boolean } | { readonly ok: false; readonly error: "writeFailed" | "staleRev" | "readOnly"; readonly message: string; readonly files: DocText; readonly rev: number; readonly dirty: true };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type Sess = { id: string; project: string; draft: Obj | null; path: string | null; painting: string | null; label: string; stack: Obj[]; gridOn: boolean; sheet: Cell | null; view: boolean; confirm: boolean; note: string | null; sel: Cell | null };
const blank = (id: string, project: string): Sess => ({ id, project, draft: null, path: null, painting: null, label: "", stack: [], gridOn: true, sheet: null, view: false, confirm: false, note: null, sel: null });
let sess: Sess = blank("", "");
export function bindStage(id: string, project: string): void { if (sess.id !== id || sess.project !== project) sess = blank(id, project); }
function same(a: Cell, b: Cell): boolean { return a.c === b.c && a.r === b.r; }
function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {
  for (const [path, doc] of Object.entries(files)) if (path.startsWith(`${kind}/`) && isObj(doc) && doc["id"] === id) return { path, doc };
  return null;
}
function chosen(files: ProjectFiles, stage: Obj): readonly string[] {
  const root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {}, gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(project["loadout"]) ? project["loadout"] : {};
  const ids = [...list(gear["required"]), ...list(gear["roster"])].filter((id): id is string => typeof id === "string"), out: string[] = [];
  for (const id of ids) if (!out.includes(id)) out.push(id);
  const cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : out.length, list(stage["playerSpawns"]).length);
  return out.slice(0, cap);
}
function marks(files: ProjectFiles, stage: Obj): readonly Mark[] {
  const names = new Map<string, string>();
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") names.set(doc["id"], typeof doc["name"] === "string" ? doc["name"] : "Unit");
  const face = (id: string | undefined): { letter: string; name: string } => { const name = id === undefined ? "Unit" : names.get(id) ?? "Unit"; return { letter: name.slice(0, 1), name }; };
  const out: Mark[] = [], team = chosen(files, stage);
  list(stage["playerSpawns"]).forEach((entry, i) => { if (!isObj(entry) || typeof entry["c"] !== "number" || typeof entry["r"] !== "number") return; const who = face(team[i]); out.push({ c: entry["c"], r: entry["r"], letter: who.letter, pill: "You", name: who.name }); });
  const pill = (entry: Obj, foe: boolean): string => { if (foe) return "Foe"; const side = entry["side"]; return side === "player" ? "You" : typeof side === "string" && side !== "" && side !== "neutral" ? "Foe" : "NPC"; };
  const put = (entry: unknown, foe: boolean): void => { if (!isObj(entry) || !isObj(entry["at"]) || typeof entry["at"]["c"] !== "number" || typeof entry["at"]["r"] !== "number") return; const who = face(typeof entry["unitId"] === "string" ? entry["unitId"] : undefined); out.push({ c: entry["at"]["c"], r: entry["at"]["r"], letter: who.letter, pill: pill(entry, foe), name: who.name }); };
  list(stage["neutrals"]).forEach((entry) => put(entry, false));
  const pool = stage["enemyPool"]; if (isObj(pool) && pool["mode"] === "fixed") list(pool["entries"]).forEach((entry) => put(entry, true));
  return out;
}
function tileId(map: Obj, c: number, r: number): string {
  const cols = typeof map["cols"] === "number" ? map["cols"] : 0, logic = isObj(map["logic"]) ? map["logic"] : {}, terrain = Array.isArray(logic["terrain"]) ? logic["terrain"] : [], palette = isObj(logic["palette"]) ? logic["palette"] : {}, value = terrain[r * cols + c], id = typeof value === "number" ? palette[String(value)] : undefined;
  return typeof id === "string" ? id : "floor";
}
function live(files: DocText): Obj | null {
  if (sess.draft !== null) return sess.draft; if (sess.path === null) return null; const parsed = parseProject(files); if (!parsed.ok) return null; const doc = parsed.files[sess.path]; return isObj(doc) ? structuredClone(doc) as Obj : null;
}
async function writeMap(io: Io, files: DocText, rev: number, map: Obj): Promise<Saved> {
  if (sess.path === null) return { ok: false, error: "writeFailed", message: "Can't open this stage", files, rev, dirty: true };
  const next = { ...files, [sess.path]: JSON.stringify(map) }, plan = planSave(files, next, rev, io.now);
  if (!plan.ok) return { ok: false, error: plan.error, message: plan.message, files, rev, dirty: true };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes);
  if (!wrote.ok) return { ok: false, error: "writeFailed", message: wrote.message, files, rev, dirty: true };
  const same = sess.draft === map; if (same) { sess.draft = null; sess.painting = null; sess.label = ""; sess.note = null; }
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev, dirty: !same };
}
export async function stageCommit(io: Io, files: DocText, rev: number): Promise<Saved> {
  return sess.draft === null ? { ok: true, files, rev, dirty: false } : writeMap(io, files, rev, sess.draft);
}
function bundle(files: DocText, stageId: string): { readonly parsed: ProjectFiles; readonly stage: Obj; readonly map: Obj; readonly slice: Obj } | { readonly error: string } {
  const parsed = parseProject(files); if (!parsed.ok) return { error: parsed.message };
  const stage = docAt(parsed.files, "stages", stageId); if (stage === null) return { error: "Can't open this stage" };
  const ref = stage.doc["mapRef"]; if (typeof ref !== "string") return { error: "Can't open this stage" };
  const map = docAt(parsed.files, "maps", ref); if (map === null) return { error: "Can't open this map" };
  const slice = parsed.files["catalogue/slice.json"]; if (!isObj(slice)) return { error: "Can't open: catalogue/slice.json" };
  sess.path = map.path; return { parsed: parsed.files, stage: stage.doc, map: sess.draft ?? (structuredClone(map.doc) as Obj), slice };
}
function tone(id: string): string { return id === "floor" || id === "water" ? id : id === "wall-block" ? "wall" : "other"; }
function cellsHtml(map: Obj, slice: Obj, placed: readonly Mark[], sel: Cell | null): string {
  const cols = typeof map["cols"] === "number" ? map["cols"] : 0, rows = typeof map["rows"] === "number" ? map["rows"] : 0;
  let html = `<div class="grid${sess.gridOn ? "" : " off"}" style="grid-template-columns:repeat(${cols},48px)">`;
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
    const id = tileId(map, c, r), label = typeLabel(slice, id), mark = placed.find((item) => item.c === c && item.r === r) ?? null;
    const text = mark !== null || label.length > 5 ? label.slice(0, 1) : label, on = sel !== null && sel.c === c && sel.r === r ? " on" : "";
    const who = mark === null ? "" : `<span class="who">${esc(mark.letter)}</span><span class="pill">${esc(mark.pill)}</span>`;
    html += `<button type="button" class="cell t-${tone(id)}${on}" data-act="s:cell:${c},${r}" data-tile="${esc(id)}" aria-label="${esc(label)}${mark === null ? "" : `, ${mark.name}, ${mark.pill}`}"><span>${esc(text)}</span>${who}</button>`;
  }
  return `${html}</div>`;
}
export function stageRows(files: DocText): { readonly id: string; readonly name: string }[] {
  const parsed = parseProject(files); if (!parsed.ok) return [];
  const root = parsed.files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {};
  return list(project["stages"]).flatMap((id) => { if (typeof id !== "string") return []; const stage = docAt(parsed.files, "stages", id); return stage === null ? [] : [{ id, name: typeof stage.doc["name"] === "string" ? stage.doc["name"] : id }]; });
}
export function stageScreen(stageId: string, host: Host): string {
  const got = bundle(host.files, stageId);
  if ("error" in got) return `<header class="topbar"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>Stage</h1></header><div class="body"><p class="banner bad" role="alert">${esc(got.error)}</p></div>`;
  const name = typeof got.stage["name"] === "string" ? got.stage["name"] : "Stage", placed = marks(got.parsed, got.stage);
  let users = 0; for (const [path, doc] of Object.entries(got.parsed)) if (path.startsWith("stages/") && isObj(doc) && doc["mapRef"] === got.stage["mapRef"]) users += 1;
  const note = users > 1 ? `<p class="sub">This map is used by ${users} stages. Painting changes all of them.</p>` : "";
  const code = host.banner !== null && host.banner.startsWith("Couldn't save") ? "writeFailed" : host.banner !== null && host.banner.startsWith("This project changed") ? "staleRev" : "";
  const banner = host.banner === null ? "" : `<p class="banner bad" role="alert"${code === "" ? "" : ` data-error="${code}"`}>${esc(host.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
  const dot = host.dirty || sess.draft !== null ? `<span class="dot" aria-label="Unsaved"></span>` : "";
  const start = host.readOnly ? "" : `<button type="button" class="btn ghost" data-act="s:fresh">Start new</button>`;
  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
  const rows = sheetRows(got.slice, sess.sheet !== null && placed.some((item) => same(item, sess.sheet as Cell)));
  const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
  const stood = sess.sheet !== null && placed.some((item) => same(item, sess.sheet as Cell)) ? `<p>A unit stands here</p>` : "";
  const sheet = host.readOnly || sess.sheet === null ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Add here</h2><p class="sub">Tile ${sess.sheet.c},${sess.sheet.r}</p>${stood}${group("Ground")}${group("Terrain")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
  const view = sess.view ? `<div class="scrim"><div class="sheet" role="dialog"><h2>View</h2><button type="button" class="choice" data-act="s:grid">Grid lines: ${sess.gridOn ? "On" : "Off"}</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>` : "";
  const confirm = !host.readOnly && sess.confirm ? `<div class="scrim"><div class="sheet" role="dialog"><h2>Start new</h2><p>Start this stage's ground fresh? Every tile goes back to Floor. Units and NPCs stay. You can Undo this.</p><button type="button" class="btn danger" data-act="s:fresh-go">Start new</button><button type="button" class="btn ghost" data-act="s:close">Cancel</button></div></div>` : "";
  const undo = host.readOnly ? "" : `<button type="button" class="btn ghost undo" data-act="s:undo"${canUndo(sess.stack) ? "" : " disabled"}>${canUndo(sess.stack) ? "Undo" : "Nothing to undo"}</button>`;
  const chip = sess.painting === null ? "" : `<div class="chip" role="status"><span>Painting ${esc(sess.label)} · Tap more tiles</span><button type="button" class="btn" data-act="s:done">Done</button></div>${sess.note === null ? "" : `<p class="sub">${esc(sess.note)}</p>`}`;
  const dock = undo === "" && chip === "" ? "" : `<div class="dock">${undo}${chip}</div>`;
  return `${bar}<div class="body stage">${banner}${note}${cellsHtml(got.map, got.slice, placed, sess.sel)}</div>${dock}${sheet}${view}${confirm}`;
}
function kept(host: Host): StageOut { return { ...host, leave: false, test: false }; }
export async function stageClick(act: string, stageId: string, host: Host, io: Io): Promise<StageOut> {
  if (act === "s:back") { if (host.readOnly || sess.draft === null) return { ...host, leave: true, test: false }; const saved = await writeMap(io, host.files, host.rev, sess.draft); return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: host.readOnly ? host.banner : null, leave: true, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false }; }
  if (act === "s:test") return { ...host, leave: false, test: true };
  if (act === "s:close") { sess.sheet = null; sess.view = false; sess.confirm = false; return kept(host); }
  if (act === "s:view") { sess.view = true; sess.sheet = null; sess.confirm = false; return kept(host); }
  if (act === "s:grid") { sess.gridOn = !sess.gridOn; return kept(host); }
  if (host.readOnly) return kept(host);
  const got = bundle(host.files, stageId); if ("error" in got) return { ...host, banner: got.error, leave: false, test: false };
  const placed = marks(got.parsed, got.stage);
  if (act === "s:fresh") { sess.confirm = true; sess.sheet = null; sess.view = false; return kept(host); }
  if (act === "s:undo") {
    const item = pop(sess.stack); if (item === null) return kept(host);
    sess.stack = item.rest; sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.draft = item.snap; const saved = await writeMap(io, host.files, host.rev, item.snap);
    if (!saved.ok) return { ...host, dirty: true, banner: saved.message, leave: false, test: false };
    return { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false };
  }
  if (act === "s:fresh-go" || act === "s:done") {
    const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
    const next = act === "s:fresh-go" ? clearGround(map) : map;
    if (act === "s:fresh-go") sess.stack = push(sess.stack, structuredClone(map) as Obj);
    sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.draft = next;
    const saved = await writeMap(io, host.files, host.rev, next);
    return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false };
  }
  if (act.startsWith("s:cell:")) {
    const [cs, rs] = act.slice(7).split(","), c = Number(cs), r = Number(rs);
    if (!Number.isInteger(c) || !Number.isInteger(r)) return kept(host);
    const cell = { c, r };
    if (sess.painting !== null) {
      const busy = placed.some((item) => same(item, cell));
      if (busy && closedType(got.slice, sess.painting)) { sess.note = "A unit stands here"; sess.sel = cell; return { ...kept(host), dirty: true }; }
      const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
      sess.draft = paintCells(map, [cell], sess.painting); sess.note = null; sess.sel = cell; sess.sheet = null;
      return { ...host, dirty: true, leave: false, test: false };
    }
    sess.sheet = cell; sess.sel = cell; sess.view = false; sess.confirm = false; return kept(host);
  }
  if (act.startsWith("s:type:")) {
    const id = act.slice(7), rows = sheetRows(got.slice, sess.sheet !== null && placed.some((item) => sess.sheet !== null && same(item, sess.sheet))), row = rows.find((item) => item.id === id);
    if (row === undefined || sess.sheet === null) return kept(host);
    const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
    if (sess.painting === null) sess.stack = push(sess.stack, structuredClone(map) as Obj);
    sess.painting = row.id; sess.label = row.label; sess.draft = paintCells(map, [sess.sheet], row.id); sess.note = null; sess.sel = sess.sheet; sess.sheet = null;
    return { ...host, dirty: true, leave: false, test: false };
  }
  return kept(host);
}
