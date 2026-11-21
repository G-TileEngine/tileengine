import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { ruleLine, resetStageRule, setStageRule, sourceOf } from "../../src/editor/rules/rules.ts";
import { addCase, updateProject } from "../../src/editor/unit/add.ts";
import { panelOf } from "../../src/editor/unit/panel.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { sliceDoc } from "../project/slice-of.ts";
import { BUNDLED } from "./catalogue.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
import { knobWidget } from "./widgets.ts";
type Obj = Record<string, unknown>;
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
export type RulesHit = Host & { readonly banner: string | null; readonly toast?: string | null };
export type RulesIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
let open = false, skel: Obj | null = null, stack: DocText[] = [];
export function rememberRule(doc: unknown): void { if (!isObj(doc)) throw new Error("Can't open: templates"); skel = doc; }
export function rulesOpen(): boolean { return open; }
export function rulesShut(): void { open = false; }
function bagOf(files: DocText): Record<string, Obj> | null {
  const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
}
function viewSlice(bag: Record<string, Obj>): Obj {
  const slice = bag["catalogue/slice.json"], rows = isObj(slice) ? list(slice["behaviours"]) : [];
  if (isObj(slice) && rows.some((row) => isObj(row) && row["id"] === "win-condition")) return slice;
  const cut = sliceDoc(BUNDLED, [...rows.flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []), "win-condition"]); return isObj(cut) ? cut : {};
}
function stageDoc(bag: Record<string, Obj>, stageId: string): Obj | null { for (const [path, doc] of Object.entries(bag)) if (path.startsWith("stages/") && doc["id"] === stageId) return doc; return null; }
function wipeOn(bag: Record<string, Obj>, stageId: string): boolean {
  const hit = sourceOf(bag, stageId, "win-condition"), setup = hit.setupId === "" ? undefined : bag[`setups/${hit.setupId}.json`], answers = isObj(setup) && isObj(setup["answers"]) ? setup["answers"] : {};
  return panelOf(viewSlice(bag), WIRED, "win-condition", answers).sections.flatMap((section) => [...section.knobs])[0]?.value === true;
}
export function rulesHtml(bag: Record<string, Obj>, stageId: string, readOnly: boolean): string {
  const stage = stageDoc(bag, stageId); if (stage === null) return "";
  const name = typeof stage["name"] === "string" ? stage["name"] : "Stage", gate = addCase(bag, BUNDLED);
  const close = `<button type="button" class="btn ghost" data-act="r:close">Close</button>`;
  const head = `<div class="scrim" data-sheet="rules"><div class="sheet" role="dialog"><h2>Rules · ${esc(name)}</h2>`;
  if (gate.mode === "newer" || readOnly) return `${head}<p>${esc(gate.mode === "newer" ? gate.text : "Made with a newer TileEngine. Open only.")}</p>${close}</div></div>`;
  if (gate.mode === "older") { const act = gate.update ? `<button type="button" class="btn" data-act="r:update">Update</button><button type="button" class="btn ghost" data-act="r:close">Not now</button>` : close; return `${head}<p>${esc(gate.text)}</p>${act}</div></div>`; }
  const hit = sourceOf(bag, stageId, "win-condition"), setup = hit.setupId === "" ? undefined : bag[`setups/${hit.setupId}.json`];
  const answers = isObj(setup) && isObj(setup["answers"]) ? setup["answers"] : {};
  const knob = panelOf(viewSlice(bag), WIRED, "win-condition", answers).sections.flatMap((section) => [...section.knobs])[0];
  const on = knob?.value === true, widget = knob === undefined ? "" : knobWidget({ id: knob.id, label: "Win by defeating every enemy", type: "toggle" }, on);
  const sub = knob === undefined ? "" : `<p class="sub">${esc(knob.label)}</p>`;
  const line = on ? `<p class="sub">You lose when all your units fall.</p>` : `<p>With this off, nobody wins: Test plays until you leave.</p>`;
  return `${head}<h2>How is this stage won?</h2><p class="sub">${esc(ruleLine(hit.source))}</p>${widget}${sub}${line}<button type="button" class="btn ghost" data-act="r:reset">Reset to default</button>${close}</div></div>`;
}
export function rulesSheet(files: DocText, stageId: string, readOnly: boolean): string { if (!open) return ""; const bag = bagOf(files); return bag === null ? "" : rulesHtml(bag, stageId, readOnly); }
const kept = (host: Host): RulesHit => ({ ...host, banner: null });
function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>, slice: string): DocText { const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); if (slice !== "") next["catalogue/slice.json"] = slice; return next; }
async function commit(io: RulesIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
async function save(io: RulesIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, slice: string): Promise<RulesHit> {
  const prev = stack; stack = [host.files];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after, slice));
  if (!wrote.ok) { stack = prev; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast: "Changed · Undo" };
}
async function undo(io: RulesIo, host: Host): Promise<RulesHit> {
  const snap = stack.pop(); if (snap === undefined) return { ...kept(host), toast: null };
  const wrote = await commit(io, host.files, host.rev, snap);
  if (!wrote.ok) { stack = [snap]; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast: null };
}
export async function rulesAct(act: string, stageId: string, host: Host, io: RulesIo): Promise<RulesHit> {
  if (act === "r:open") { open = true; return kept(host); }
  if (act === "r:close") { open = false; return kept(host); }
  if (act === "r:undo") return undo(io, host);
  if (host.readOnly) return { ...kept(host), banner: "Made with a newer TileEngine. Open only." };
  const bag = bagOf(host.files); if (bag === null) return { ...kept(host), banner: "Can't open this project" };
  if (act === "r:update") { const wrote = updateProject(bag, BUNDLED); return wrote === null ? kept(host) : save(io, host, bag, wrote.bag, wrote.slice); }
  if (addCase(bag, BUNDLED).mode !== "same") return kept(host);
  if (skel === null) return { ...kept(host), banner: "Can't open: setup.rule.json" };
  if (act !== "k:toggle:wipe_wins" && act !== "r:reset") return kept(host);
  const id = `setup_${ulid(Date.parse(io.now), io.bytes())}`;
  const got = act === "r:reset" ? resetStageRule(bag, stageId, "win-condition", "wipe_wins") : setStageRule(bag, skel, stageId, id, "win-condition", "wipe_wins", !wipeOn(bag, stageId), BUNDLED);
  if (got.mode !== "wrote" || (got.slice === "" && got.bag === bag)) return kept(host);
  return save(io, host, bag, got.bag, got.slice);
}
