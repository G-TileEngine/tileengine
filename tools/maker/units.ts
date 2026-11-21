import { abilityAct, abilityOpen, abilityShut, abilityView, type AbilityPlay } from "./ability-panel.ts";
import { addClick, addShut } from "./add-ability.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { prefix, ulid } from "../../src/editor/project/home.ts";
import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError } from "../../src/editor/unit/units.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
import { knobWidget, type KnobSpec } from "./widgets.ts";
type Obj = Record<string, unknown>;
type DocText = Readonly<Record<string, string>>;
type Snap = { readonly files: DocText; readonly hidden: readonly string[] };
type Sess = { project: string; mode: "add" | "rename" | "role" | "menu" | "note" | "edit" | null; unit: string; name: string; hint: string; lines: string[]; hidden: string[]; stack: Snap[] };
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
export type UnitHit = { readonly files: DocText; readonly rev: number; readonly banner: string | null; readonly dirty: boolean; readonly toast?: string | null; readonly shown?: string; readonly play?: AbilityPlay };
export type UnitIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const blank = (project: string): Sess => ({ project, mode: null, unit: "", name: "", hint: "", lines: [], hidden: [], stack: [] });
let sess: Sess = blank(""), skel: Obj | null = null;
export function rememberUnit(doc: unknown): void { if (!isObj(doc)) throw new Error("Can't open: templates"); skel = doc; }
export function bindUnits(id: string): void { if (sess.project !== id) sess = blank(id); }
export function unitLine(value: string): void { sess.name = value; }
export function unitEditing(): boolean { return sess.mode === "edit" || sess.mode === "rename" || sess.mode === "role"; }
export function openUnit(id: string): void { abilityShut(); addShut(); sess.unit = id; sess.mode = "edit"; sess.hint = ""; }
function bagOf(files: DocText): Record<string, Obj> | null {
  const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
}
function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>, slice = ""): DocText {
  const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc);
  if (slice !== "") next["catalogue/slice.json"] = slice; return next;
}
async function commit(io: UnitIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
function roster(bag: Record<string, Obj>): { readonly knobs: readonly Obj[]; readonly presets: readonly unknown[]; readonly army: Obj | null } {
  const slice = bag["catalogue/slice.json"], behaviours = isObj(slice) ? list(slice["behaviours"]) : [], beh = behaviours.find((b) => isObj(b) && b["id"] === "unit-roster");
  const knobs = isObj(beh) ? list(beh["knobs"]).filter(isObj) : [], presets = isObj(beh) ? list(beh["presets"]) : [];
  const army = Object.values(bag).find((doc) => doc["behaviourId"] === "unit-roster");
  return { knobs, presets, army: isObj(army) ? army : null };
}
function armyNum(army: Obj | null, knob: Obj): number | null {
  const key = typeof knob["id"] === "string" ? knob["id"] : "", answers = army !== null && isObj(army["answers"]) ? army["answers"] : null, row = answers === null ? undefined : answers[key];
  if (isObj(row) && row["source"] !== "default" && typeof row["value"] === "number") return row["value"];
  return typeof knob["default"] === "number" ? knob["default"] : null;
}
function perKeys(knobs: readonly Obj[]): Set<string> { return new Set(knobs.filter((k) => k["per_unit"] === true && typeof k["id"] === "string").map((k) => String(k["id"]))); }
function rolesOf(knobs: readonly Obj[], presets: readonly unknown[]): { readonly id: string; readonly label: string; readonly overrides: Record<string, number> }[] {
  const per = perKeys(knobs), out: { id: string; label: string; overrides: Record<string, number> }[] = [];
  for (const item of presets) {
    if (!isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string" || !isObj(item["overrides"])) continue;
    const over = item["overrides"], keys = Object.keys(over); if (keys.length === 0 || keys.some((key) => !per.has(key) || typeof over[key] !== "number")) continue;
    const overrides: Record<string, number> = {}; for (const key of keys) { const n = over[key]; if (typeof n === "number") overrides[key] = n; }
    out.push({ id: item["id"], label: item["label"], overrides });
  }
  return out;
}
function specOf(knob: Obj): KnobSpec | null {
  if (typeof knob["id"] !== "string" || typeof knob["label"] !== "string" || typeof knob["type"] !== "string") return null;
  return { id: knob["id"], label: knob["label"], type: knob["type"], ...(typeof knob["min"] === "number" ? { min: knob["min"] } : {}), ...(typeof knob["max"] === "number" ? { max: knob["max"] } : {}), ...(typeof knob["step"] === "number" ? { step: knob["step"] } : {}) };
}
function ownNum(unit: Obj, key: string): number | null { const stats = isObj(unit["stats"]) ? unit["stats"] : null, bag = stats === null ? undefined : stats[key]; return isObj(bag) && typeof bag["value"] === "number" ? bag["value"] : null; }
const kept = (host: Host): UnitHit => ({ files: host.files, rev: host.rev, banner: null, dirty: host.dirty });
async function save(io: UnitIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string, slice = ""): Promise<UnitHit> {
  const prev = sess.stack; sess.stack = [{ files: host.files, hidden: [...sess.hidden] }];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after, slice));
  if (!wrote.ok) { sess.stack = prev; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, banner: null, dirty: false, toast };
}
function unitDoc(bag: Record<string, Obj>, id: string): { readonly path: string; readonly doc: Obj } | null {
  const path = `units/${id}.json`, doc = bag[path]; return isObj(doc) ? { path, doc } : null;
}
function statBlock(unit: Obj, knob: Obj, army: Obj | null): string {
  const spec = specOf(knob); if (spec === null || spec.type !== "slider") return "";
  const own = ownNum(unit, spec.id), armyValue = armyNum(army, knob), shownValue = own ?? armyValue; if (shownValue === null) return "";
  const reset = own === null ? `<p class="sub">Same as army</p>` : `<button type="button" class="btn ghost" data-act="u:reset:${esc(spec.id)}">Reset</button>`;
  return `${knobWidget({ ...spec, min: spec.min ?? null, max: spec.max ?? null, step: spec.step ?? null }, shownValue)}${reset}`;
}
export function unitTail(files: DocText, readOnly: boolean): string {
  const bag = bagOf(files); if (bag === null) return "";
  const cards = shown(bag, sess.hidden).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="u:open:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${readOnly ? "" : `<button type="button" class="btn icon" data-act="u:menu:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
  const add = readOnly ? "" : `<button type="button" class="card new" data-act="u:add"><span class="grow"><span class="name">+ Add unit</span></span></button>`;
  return `<h2>Units</h2>${cards}${add}`;
}
function sheet(): string {
  const close = `<button type="button" class="btn ghost" data-act="u:close">Close</button>`;
  if (sess.mode === "note") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Can't delete</h2>${sess.lines.map((line) => `<p>${esc(line)}</p>`).join("")}${close}</div></div>`;
  if (sess.mode === "add" || sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${sess.mode === "add" ? "Unit name" : "Rename"}</h2><input class="name-field" data-unit value="${esc(sess.name)}" aria-label="Unit name"><p class="hint">${esc(sess.hint || "1-40 characters")}</p><button type="button" class="btn" data-act="${sess.mode === "add" ? "u:create" : "u:save-name"}">${sess.mode === "add" ? "Add" : "Save"}</button>${close}</div></div>`;
  if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Unit")}</h2><button type="button" class="btn danger" data-act="u:delete">Delete</button>${close}</div></div>`;
  return "";
}
export function unitSheet(): string { return sess.mode === "add" || sess.mode === "menu" || sess.mode === "note" ? sheet() : ""; }
export function unitPage(files: DocText, readOnly: boolean, banner: string | null): string {
  const bag = bagOf(files), hit = bag === null ? null : unitDoc(bag, sess.unit); if (bag === null || hit === null) return "";
  const { knobs, presets, army } = roster(bag), roles = rolesOf(knobs, presets), name = typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit";
  const stats = knobs.filter((knob) => knob["per_unit"] === true && knob["type"] === "slider").map((knob) => statBlock(hit.doc, knob, army)).join("");
  const abilities = abilityView(bag, hit.doc, readOnly);
  const roleBtn = readOnly || roles.length === 0 ? "" : `<button type="button" class="btn" data-act="u:role">Start from a role</button>`;
  const roleSheet = sess.mode !== "role" ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Start from a role</h2>${roles.map((role) => `<button type="button" class="btn" data-act="u:apply:${esc(role.id)}">${esc(role.label)}</button>`).join("")}<button type="button" class="btn ghost" data-act="u:close">Close</button></div></div>`;
  const note = banner === null ? "" : `<p class="banner bad" role="alert">${esc(banner)}</p>`;
  const rename = readOnly ? "" : `<p class="sub">Name</p><button type="button" class="btn ghost" data-act="u:rename">${esc(name)}</button>`;
  return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}${abilities}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
}
async function undo(io: UnitIo, host: Host): Promise<UnitHit> {
  const snap = sess.stack.pop(); if (snap === undefined) return { ...kept(host), toast: null };
  const next: Record<string, string> = { ...host.files }; for (const [path, text] of Object.entries(snap.files)) next[path] = text;
  const wrote = await commit(io, host.files, host.rev, next);
  if (!wrote.ok) { sess.stack = [snap]; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true }; }
  sess.hidden = [...snap.hidden];
  for (const path of Object.keys(host.files)) if (snap.files[path] === undefined && path.startsWith("units/") && path.endsWith(".json")) sess.hidden.push(path.slice("units/".length, -".json".length));
  sess.mode = null; sess.lines = []; return { files: wrote.files, rev: wrote.rev, banner: null, dirty: false, toast: null };
}
function clamp(knob: Obj, value: number): number {
  const min = typeof knob["min"] === "number" ? knob["min"] : value, max = typeof knob["max"] === "number" ? knob["max"] : value, step = typeof knob["step"] === "number" && knob["step"] > 0 ? knob["step"] : 1;
  const snapped = Math.round((value - min) / step) * step + min; return Math.min(max, Math.max(min, snapped));
}
export async function unitClick(act: string, host: Host, io: UnitIo): Promise<UnitHit> {
  if (act === "u:close") { sess.mode = sess.mode === "rename" || sess.mode === "role" ? "edit" : null; sess.hint = ""; sess.lines = []; return kept(host); }
  if (act === "u:back") { sess.mode = null; sess.hint = ""; addShut(); return kept(host); }
  if (act === "u:undo") return undo(io, host);
  if (host.readOnly) return { ...kept(host), banner: "Made with a newer TileEngine. Open only." };
  if (act.startsWith("a:") || act.startsWith("k:") || act.startsWith("g:")) {
    const live = bagOf(host.files); if (live === null) return { ...kept(host), banner: "Can't open this project" };
    if (act.startsWith("g:")) {
      const id = act.startsWith("g:add:") ? `setup_${ulid(Date.parse(io.now), io.bytes())}` : "";
      const hit = addClick(act, live, sess.unit, id);
      if ("bag" in hit) { if (hit.open !== undefined) abilityOpen(hit.open); return save(io, host, live, hit.bag, hit.toast, hit.slice); }
      return kept(host);
    }
    const hit = abilityAct(act, live, sess.unit);
    if ("play" in hit) return { ...kept(host), play: hit.play };
    if ("bag" in hit) return save(io, host, live, hit.bag, hit.toast);
    return kept(host);
  }
  if (act === "u:add") { sess.mode = "add"; sess.name = "New unit"; sess.hint = ""; return kept(host); }
  if (act === "u:role") { sess.mode = "role"; return kept(host); }
  if (act === "u:rename") { const bag = bagOf(host.files), hit = bag === null ? null : unitDoc(bag, sess.unit); sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : ""; sess.hint = ""; sess.mode = "rename"; return kept(host); }
  if (act.startsWith("u:open:")) { abilityShut(); addShut(); sess.unit = act.slice(7); sess.mode = "edit"; sess.hint = ""; return kept(host); }
  if (act.startsWith("u:menu:")) { const bag = bagOf(host.files), id = act.slice(7), hit = bag === null ? null : unitDoc(bag, id); sess.unit = id; sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit"; sess.mode = "menu"; return kept(host); }
  const bag = bagOf(host.files); if (bag === null) return { ...kept(host), banner: "Can't open this project" };
  if (act === "u:create" || act === "u:save-name") {
    const err = unitNameError(sess.name); if (err !== null) { sess.hint = err; return kept(host); }
    const name = sess.name.trim();
    if (act === "u:create") {
      if (skel === null) return { ...kept(host), banner: "Can't open: templates" };
      const id = `unit_${ulid(Date.parse(io.now), io.bytes())}`, doc = newUnit(skel, id, name);
      const hit = await save(io, host, bag, { ...bag, [`units/${id}.json`]: doc }, "Changed · Undo"); if (hit.banner !== null) return hit;
      sess.mode = "edit"; sess.unit = id; sess.hint = ""; return hit;
    }
    const cur = unitDoc(bag, sess.unit); if (cur === null) return { ...kept(host), banner: "Can't open this" };
    const hit = await save(io, host, bag, { ...bag, [cur.path]: renameUnit(cur.doc, name) }, "Changed · Undo"); if (hit.banner === null) { sess.mode = "edit"; sess.hint = ""; }
    return hit;
  }
  if (act === "u:delete") {
    const got = deleteUnit(bag, sess.unit); if (!got.ok) { sess.mode = "note"; sess.lines = [...got.reasons]; return kept(host); }
    sess.stack = [{ files: host.files, hidden: [...sess.hidden] }]; sess.hidden = [...sess.hidden, sess.unit]; sess.mode = null; sess.lines = [];
    return { ...kept(host), toast: "Deleted · Undo" };
  }
  const cur = unitDoc(bag, sess.unit); if (cur === null) return { ...kept(host), banner: "Can't open this" };
  const { knobs, presets } = roster(bag);
  if (act.startsWith("u:apply:")) {
    const role = rolesOf(knobs, presets).find((item) => item.id === act.slice(8)); if (role === undefined) return kept(host);
    const hit = await save(io, host, bag, { ...bag, [cur.path]: applyRole(cur.doc, role.overrides, perKeys(knobs)) }, "Changed · Undo"); if (hit.banner === null) sess.mode = "edit"; return hit;
  }
  if (act.startsWith("u:reset:")) {
    const hit = await save(io, host, bag, { ...bag, [cur.path]: resetStat(cur.doc, act.slice(8)) }, "Changed · Undo"); return hit;
  }
  if (act.startsWith("u:stat:")) {
    const parts = act.split(":"), key = parts[2] ?? "", value = Number(parts.slice(3).join(":")), knob = knobs.find((item) => item["id"] === key);
    if (knob === undefined || !Number.isFinite(value) || knob["per_unit"] !== true) return kept(host);
    const next = clamp(knob, value); if (ownNum(cur.doc, key) === next) return { ...kept(host), shown: String(next) };
    const hit = await save(io, host, bag, { ...bag, [cur.path]: setStat(cur.doc, key, next) }, "Changed · Undo");
    return hit.banner === null ? { ...hit, shown: String(next) } : hit;
  }
  return kept(host);
}
