import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { deleteEffect, duplicateEffect, editEffect, effectRows, FX_KNOBS, newEffect, renameEffect } from "../../src/editor/effect/list.ts";
import { panelOf, type PanelKnob } from "../../src/editor/unit/panel.ts";
import { BUNDLED } from "./catalogue.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
import { knobWidget, type KnobSpec } from "./widgets.ts";
type Obj = Record<string, unknown>;
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
export type EffectsHit = Host & { readonly banner: string | null; readonly toast?: string | null };
export type EffectsIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const OPEN = "Made with a newer TileEngine. Open only.";
let mode: "closed" | "menu" | "edit" = "closed", openId = "", stack: DocText[] = [];
export function fxOpen(): boolean { return mode !== "closed"; }
function bagOf(files: DocText): Record<string, Obj> | null { const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag; }
const kept = (host: Host): EffectsHit => ({ ...host, banner: null });
const specOf = (knob: PanelKnob): KnobSpec => ({ id: knob.id, label: knob.label, type: knob.type, ...(knob.min === undefined ? {} : { min: knob.min }), ...(knob.max === undefined ? {} : { max: knob.max }), ...(knob.step === undefined ? {} : { step: knob.step }), ...(knob.max_len === undefined ? {} : { max_len: knob.max_len }), ...(knob.options === undefined ? {} : { options: knob.options }), ...(knob.builtin === undefined ? {} : { builtin: knob.builtin }) });
const useLine = (n: number): string => (n === 0 ? "Not used yet" : n === 1 ? "1 ability uses this" : `${n} abilities use this`);
export function effectsSection(files: DocText, readOnly: boolean): string {
  const bag = bagOf(files); if (bag === null) return "";
  const rows = effectRows(bag).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="e:open:${esc(row.id)}"><span class="name">${esc(row.name)}</span><span class="sub">${useLine(row.used)}</span></button>${readOnly ? "" : `<button type="button" class="btn icon" data-act="e:menu:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
  const add = readOnly ? "" : `<button type="button" class="card new" data-act="e:new"><span class="grow"><span class="name">+ New effect</span></span></button>`;
  return `<h2>Effects</h2>${rows}${add}`;
}
export function effectsSheet(files: DocText, readOnly: boolean): string {
  if (mode === "closed" || readOnly) return "";
  const bag = bagOf(files); if (bag === null) return "";
  const row = effectRows(bag).find((item) => item.id === openId), name = row?.name ?? "Effect";
  if (mode === "menu") { const used = row?.used ?? 0, warn = used === 0 ? "" : `<p>${used === 1 ? "1 ability uses" : `${used} abilities use`} this; they'll show None</p>`, none = used === 0 ? "" : `<button type="button" class="btn danger" data-act="e:none">Delete and switch ${used} to None</button>`; return `<div class="scrim" data-sheet="effects"><div class="sheet" role="dialog"><h2>${esc(name)}</h2>${warn}<button type="button" class="btn" data-act="e:dup">Duplicate</button><button type="button" class="btn danger" data-act="e:delete">Delete</button>${none}<button type="button" class="btn ghost" data-act="e:close">Close</button></div></div>`; }
  let doc: Obj | null = null; for (const [path, item] of Object.entries(bag)) if (path.startsWith("effects/") && !path.slice("effects/".length).includes("/") && item["id"] === openId) doc = item;
  const answers = doc !== null && isObj(doc["answers"]) ? doc["answers"] : {}, knobs = panelOf(BUNDLED, { effect: FX_KNOBS }, "effect", answers).sections.flatMap((section) => [...section.knobs]);
  const body = knobs.map((knob) => `${knobWidget(specOf(knob), knob.value)}<button type="button" class="btn ghost" data-act="e:reset:${esc(knob.id)}">Reset to default</button>`).join("");
  return `<div class="scrim" data-sheet="effect"><div class="sheet" role="dialog"><header class="topbar"><button type="button" class="btn ghost" data-act="e:close">Back</button><h1>${esc(name)}</h1></header><input class="name-field" data-fxname value="${esc(name)}" aria-label="Effect name">${body}<button type="button" class="btn" data-act="e:dup">Duplicate</button><button type="button" class="btn" data-act="test">▶ Test</button></div></div>`;
}
function applyBag(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>): DocText {
  const next: Record<string, string> = {};
  for (const [path, text] of Object.entries(stored)) if (before[path] === undefined || after[path] !== undefined) next[path] = text;
  for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc);
  return next;
}
async function commit(io: EffectsIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const gone = Object.keys(stored).filter((path) => next[path] === undefined), plan: Record<string, string> = { ...next };
  for (const path of gone) { const text = stored[path]; if (text !== undefined) plan[path] = text; }
  const save = planSave(stored, plan, rev, io.now); if (!save.ok) return { ok: false, message: save.message };
  const wrote = await commitWrites(io.store, prefix(io.id), save.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  for (const path of gone) await io.store.remove(`${prefix(io.id)}${path}`);
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: save.writes.length > 0 ? rev + 1 : rev };
}
async function save(io: EffectsIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string): Promise<EffectsHit> {
  if (after === before) return kept(host);
  const prev = stack; stack = [host.files];
  const wrote = await commit(io, host.files, host.rev, applyBag(host.files, before, after));
  if (!wrote.ok) { stack = prev; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast };
}
async function undo(io: EffectsIo, host: Host): Promise<EffectsHit> {
  const snap = stack.pop(); if (snap === undefined) return { ...kept(host), toast: null };
  const wrote = await commit(io, host.files, host.rev, snap);
  if (!wrote.ok) { stack = [snap]; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast: null };
}
const fresh = (io: EffectsIo): string => `effect_${ulid(Date.parse(io.now), io.bytes())}`;
const knobValue = (bag: Record<string, Obj>, key: string, raw: string, toggle: boolean): unknown => {
  const knob = panelOf(BUNDLED, { effect: FX_KNOBS }, "effect", {}).sections.flatMap((section) => [...section.knobs]).find((item) => item.id === key);
  if (toggle) { let doc: Obj | null = null; for (const [path, item] of Object.entries(bag)) if (item["id"] === openId && path.startsWith("effects/") && !path.slice("effects/".length).includes("/")) doc = item; const answers = doc !== null && isObj(doc["answers"]) ? doc["answers"] : {}; const cur = isObj(answers[key]) && answers[key]?.["source"] !== "default" ? answers[key]?.["value"] : knob?.def; return cur !== true; }
  return knob?.type === "slider" ? Number(raw) : raw;
};
export async function effectsAct(act: string, host: Host, io: EffectsIo): Promise<EffectsHit> {
  if (act === "e:close") { mode = "closed"; return kept(host); }
  if (act === "e:undo") return undo(io, host);
  if (host.readOnly) return { ...kept(host), banner: OPEN };
  const bag = bagOf(host.files); if (bag === null) return { ...kept(host), banner: "Can't open this project" };
  if (act === "e:new") { const id = fresh(io); openId = id; mode = "edit"; return save(io, host, bag, newEffect(bag, id, io.now, (p) => `${p}1`), "Changed · Undo"); }
  if (act.startsWith("e:open:")) { openId = act.slice(7); mode = "edit"; return kept(host); }
  if (act.startsWith("e:menu:")) { openId = act.slice(7); mode = "menu"; return kept(host); }
  if (act === "e:dup") { const next = duplicateEffect(bag, openId, fresh(io), io.now); return next === null ? kept(host) : save(io, host, bag, next, "Changed · Undo"); }
  if (act === "e:delete" || act === "e:none") { mode = "closed"; return save(io, host, bag, deleteEffect(bag, openId, act === "e:none"), "Deleted · Undo"); }
  if (act.startsWith("e:name:")) return save(io, host, bag, renameEffect(bag, openId, act.slice(7), io.now), "Changed · Undo");
  if (act.startsWith("e:reset:")) return save(io, host, bag, editEffect(bag, openId, act.slice(8), undefined, io.now, (p) => `${p}1`), "Changed · Undo");
  if (act.startsWith("e:set:") || act.startsWith("k:pick:") || act.startsWith("k:toggle:")) {
    const toggle = act.startsWith("k:toggle:"), head = toggle ? "k:toggle:" : act.startsWith("k:pick:") ? "k:pick:" : "e:set:";
    const rest = act.slice(head.length), cut = toggle ? -1 : rest.indexOf(":"), key = toggle ? rest : rest.slice(0, cut), raw = toggle ? "" : rest.slice(cut + 1);
    return save(io, host, bag, editEffect(bag, openId, key, knobValue(bag, key, raw, toggle), io.now, (p) => `${p}1`), "Changed · Undo");
  }
  return kept(host);
}
