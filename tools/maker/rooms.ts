import { checkName, prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { addStage, deleteMap, deleteStage, docsIn, refsTo, renameDoc } from "../../src/editor/stage/rooms.ts";
import { resizeMap, type Drop } from "../../src/editor/stage/resize.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
type Obj = Record<string, unknown>;
type Snap = { readonly files: DocText; readonly hidden: readonly string[] };
type Sess = { project: string; mode: "add" | "menu" | "rename" | "resize" | "ask" | "note" | null; which: "stage" | "map"; target: string; cols: number; rows: number; name: string; lines: string[]; hidden: string[]; stack: Snap[] };
export type RoomHit = { readonly files: DocText; readonly rev: number; readonly banner: string | null; readonly dirty: boolean; readonly stageId: string | null; readonly toast?: string | null };
export type RoomIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array; readonly empty: DocText };
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const blank = (project: string): Sess => ({ project, mode: null, which: "stage", target: "", cols: 1, rows: 1, name: "", lines: [], hidden: [], stack: [] });
let sess: Sess = blank("");
export function bindRooms(id: string): void { if (sess.project !== id) sess = blank(id); }
export function roomLine(value: string): void { sess.name = value; }
function bagOf(files: DocText): Record<string, Obj> | null {
  const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
}
function skels(empty: DocText): { readonly stage: Obj; readonly map: Obj } | null {
  const bag = bagOf(empty); if (bag === null) return null; const stage = docsIn(bag, "stages")[0]?.doc, map = docsIn(bag, "maps")[0]?.doc;
  return stage !== undefined && map !== undefined ? { stage, map } : null;
}
function pathOf(files: Record<string, Obj>, folder: "stages" | "maps", id: string): string | null {
  return docsIn(files, folder).find(({ doc }) => doc["id"] === id)?.path ?? null;
}
function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>): DocText {
  const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); return next;
}
async function commit(io: RoomIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
const kept = (host: Host, banner: string | null): RoomHit => ({ files: host.files, rev: host.rev, banner, dirty: host.dirty, stageId: null });
function say(row: Drop, ask: boolean): string {
  if (row.code === "mapEntryDropped") return ask ? `Edge ${row.index} will go` : `mapEntryDropped edges ${row.index} outsideMap`;
  const at = row.sq === null ? "" : ` at ${row.sq.c},${row.sq.r}`;
  return ask ? `${row.list} ${row.index}${at} will go` : `placementDropped ${row.list} ${row.index} outsideMap`;
}
async function save(io: RoomIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string): Promise<RoomHit> {
  const prev = sess.stack; sess.stack = [{ files: host.files, hidden: [...sess.hidden] }];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after));
  if (!wrote.ok) { sess.stack = prev; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true, stageId: null }; }
  sess.mode = null; return { files: wrote.files, rev: wrote.rev, banner: null, dirty: false, stageId: null, toast };
}
export function roomTail(files: DocText, readOnly: boolean): string {
  const bag = bagOf(files); if (bag === null) return "";
  const maps = docsIn(bag, "maps").filter(({ doc }) => !sess.hidden.includes(String(doc["id"]))).map(({ doc }) => {
    const id = String(doc["id"]), name = typeof doc["name"] === "string" ? doc["name"] : "Map", used = refsTo(bag, id).length;
    const menu = readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:map:${esc(id)}" aria-label="Menu ${esc(name)}">⋯</button>`;
    return `<div class="card"><div class="grow"><span class="name">${esc(name)}</span><span class="sub">${esc(String(doc["cols"]))} × ${esc(String(doc["rows"]))} · Used by ${used} ${used === 1 ? "stage" : "stages"}</span></div>${menu}</div>`;
  }).join("");
  const add = readOnly ? "" : `<button type="button" class="card new" data-act="r:add"><span class="grow"><span class="name">+ Add stage</span></span></button>`;
  const lines = sess.mode === null ? sess.lines.map((line) => `<p class="sub">${esc(line)}</p>`).join("") : "";
  return `${add}<h2>Maps</h2>${maps}${lines}`;
}
export function roomSheet(files: DocText): string {
  if (sess.mode === null) return "";
  const close = `<button type="button" class="btn ghost" data-act="r:close">Close</button>`;
  const bag = bagOf(files);
  if (sess.mode === "note") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Can't delete</h2><p>${esc(sess.lines[0] ?? "")}</p>${close}</div></div>`;
  if (sess.mode === "add") {
    const maps = bag === null ? [] : docsIn(bag, "maps").filter(({ doc }) => !sess.hidden.includes(String(doc["id"])));
    const uses = maps.map(({ doc }) => `<button type="button" class="btn" data-act="r:use:${esc(String(doc["id"]))}">Use map: ${esc(typeof doc["name"] === "string" ? doc["name"] : "Map")}</button>`).join("");
    return `<div class="scrim"><div class="sheet" role="dialog"><h2>Add stage</h2><button type="button" class="btn" data-act="r:new">New map</button>${uses}${close}</div></div>`;
  }
  if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Edit")}</h2><button type="button" class="btn" data-act="r:rename">Rename</button>${sess.which === "map" ? `<button type="button" class="btn" data-act="r:resize">Resize</button>` : ""}<button type="button" class="btn danger" data-act="r:delete">Delete</button>${close}</div></div>`;
  if (sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Rename</h2><input class="name-field" data-room value="${esc(sess.name)}" aria-label="Name"><button type="button" class="btn" data-act="r:save-name">Save</button>${close}</div></div>`;
  if (sess.mode === "ask") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Resize</h2>${sess.lines.map((line) => `<p>${esc(line)}</p>`).join("")}<button type="button" class="btn danger" data-act="r:anyway">Resize anyway</button><button type="button" class="btn ghost" data-act="r:close">Cancel</button></div></div>`;
  const big = sess.cols > 256 || sess.rows > 256 ? `<p>Big maps may stutter on phones</p>` : "";
  return `<div class="scrim"><div class="sheet" role="dialog"><h2>Resize</h2><p>Columns ${sess.cols}</p><button type="button" class="btn" data-act="r:step:c:-1" aria-label="Fewer columns">−</button><button type="button" class="btn" data-act="r:step:c:1" aria-label="More columns">+</button><p>Rows ${sess.rows}</p><button type="button" class="btn" data-act="r:step:r:-1" aria-label="Fewer rows">−</button><button type="button" class="btn" data-act="r:step:r:1" aria-label="More rows">+</button>${big}<button type="button" class="btn" data-act="r:apply">Apply</button>${close}</div></div>`;
}
function titleOf(files: DocText): string {
  const bag = bagOf(files), path = bag === null ? null : pathOf(bag, sess.which === "map" ? "maps" : "stages", sess.target), doc = path === null || bag === null ? null : bag[path];
  return isObj(doc) && typeof doc["name"] === "string" ? doc["name"] : "Edit";
}
async function undo(io: RoomIo, host: Host): Promise<RoomHit> {
  const snap = sess.stack.pop(); if (snap === undefined) return { ...kept(host, null), toast: null };
  const next: DocText = { ...host.files }; for (const [path, text] of Object.entries(snap.files)) next[path] = text;
  const wrote = await commit(io, host.files, host.rev, next);
  if (!wrote.ok) { sess.stack = [snap]; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true, stageId: null }; }
  sess.hidden = [...snap.hidden]; for (const path of Object.keys(host.files)) if (snap.files[path] === undefined && path.startsWith("maps/") && path.endsWith(".json")) sess.hidden.push(path.slice("maps/".length, -".json".length));
  sess.lines = []; sess.mode = null;
  return { files: await readTree(io.store, prefix(io.id)), rev: wrote.rev, banner: null, dirty: false, stageId: null, toast: null };
}
export async function roomClick(act: string, host: Host, io: RoomIo): Promise<RoomHit> {
  if (act === "r:close") { sess.mode = null; sess.lines = []; return kept(host, null); }
  if (act === "r:undo") return undo(io, host);
  if (host.readOnly) return kept(host, "Made with a newer TileEngine. Open only.");
  if (act === "r:add") { sess.mode = "add"; sess.lines = []; return kept(host, null); }
  if (act.startsWith("r:menu:")) {
    const body = act.slice(7), which = body.startsWith("map:") ? "map" : "stage";
    sess.which = which; sess.target = body.slice(which.length + 1); sess.name = titleOf(host.files); sess.mode = "menu"; sess.lines = []; return kept(host, null);
  }
  if (act === "r:rename") { sess.name = titleOf(host.files); sess.mode = "rename"; return kept(host, null); }
  if (act === "r:resize") {
    const bag = bagOf(host.files), path = bag === null ? null : pathOf(bag, "maps", sess.target), doc = path === null || bag === null ? null : bag[path];
    sess.cols = isObj(doc) && typeof doc["cols"] === "number" ? doc["cols"] : 1; sess.rows = isObj(doc) && typeof doc["rows"] === "number" ? doc["rows"] : 1; sess.mode = "resize"; return kept(host, null);
  }
  if (act.startsWith("r:step:")) { const parts = act.split(":"), delta = Number(parts[3]); if (parts[2] === "c") sess.cols = Math.max(1, sess.cols + delta); else sess.rows = Math.max(1, sess.rows + delta); return kept(host, null); }
  const bag = bagOf(host.files); if (bag === null) return kept(host, "Can't open this project");
  if (act === "r:new" || act.startsWith("r:use:")) {
    const sk = skels(io.empty); if (sk === null) return kept(host, "Can't open: templates");
    const stageId = `stage_${ulid(Date.parse(io.now), io.bytes())}`, existing = act.startsWith("r:use:") ? act.slice(6) : null, mapId = existing ?? `map_${ulid(Date.parse(io.now), io.bytes())}`;
    const n = list(isObj(bag["project.json"]) && isObj(bag["project.json"]["project"]) ? bag["project.json"]["project"]["stages"] : []).length + 1;
    const after = addStage(bag, sk.stage, existing === null ? sk.map : null, stageId, mapId, `Stage ${n}`, `Stage ${n} map`);
    const hit = await save(io, host, bag, after, "Changed · Undo"); return hit.banner === null ? { ...hit, stageId } : hit;
  }
  if (act === "r:save-name") {
    const name = sess.name.trim(), err = checkName(name); if (err !== null) return kept(host, err);
    const path = pathOf(bag, sess.which === "map" ? "maps" : "stages", sess.target); if (path === null) return kept(host, "Can't open this");
    return save(io, host, bag, renameDoc(bag, path, name), "Changed · Undo");
  }
  if (act === "r:delete" && sess.which === "map") {
    const got = deleteMap(bag, sess.target); if (!got.ok) { sess.mode = "note"; sess.lines = [`Used by: ${got.usedBy.join(", ")}`]; return kept(host, null); }
    sess.stack = [{ files: host.files, hidden: [...sess.hidden] }]; sess.hidden = [...sess.hidden, sess.target]; sess.mode = null; sess.lines = []; return { ...kept(host, null), toast: "Deleted · Undo" };
  }
  if (act === "r:delete") {
    const got = deleteStage(bag, sess.target); if (!got.ok) { sess.mode = "note"; sess.lines = [got.reason]; return kept(host, null); }
    return save(io, host, bag, got.files, "Deleted · Undo");
  }
  if (act === "r:apply" || act === "r:anyway") {
    const mapPath = pathOf(bag, "maps", sess.target), map = mapPath === null ? null : bag[mapPath]; if (mapPath === null || !isObj(map)) return kept(host, "Can't open this map");
    const sized = resizeMap(mapPath, map, docsIn(bag, "stages"), sess.cols, sess.rows);
    if (act === "r:apply" && sized.rows.length > 0) { sess.mode = "ask"; sess.lines = sized.rows.map((row) => say(row, true)); return kept(host, null); }
    const after: Record<string, Obj> = { ...bag, [mapPath]: sized.map }; for (const stage of sized.stages) if (bag[stage.path] !== stage.doc) after[stage.path] = stage.doc;
    const hit = await save(io, host, bag, after, "Changed · Undo"); if (hit.banner === null) sess.lines = sized.rows.map((row) => say(row, false)); return hit;
  }
  return kept(host, null);
}
