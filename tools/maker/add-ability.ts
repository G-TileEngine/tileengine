import { addAbility, addCase, addable, byGoal, updateProject, type AddCase } from "../../src/editor/unit/add.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { BUNDLED } from "./catalogue.ts";
import { diagramHtml, diagramOf } from "./unit-diagram.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
let skel: Obj | null = null, view: "off" | "goals" | "cards" | "offer" = "off", picked = 0, query = "";
export function rememberAbility(doc: unknown): void { if (!isObj(doc)) throw new Error("Can't open: templates"); skel = doc; }
export function addShut(): void { view = "off"; query = ""; }
export function addFind(text: string): void { query = text; }
export type AddHit = { readonly keep: true } | { readonly bag: Record<string, Obj>; readonly slice: string; readonly toast: string; readonly open?: string };
const binsOf = (bag: Obj, unit: Obj) => byGoal(addable(BUNDLED, WIRED, unit, bag));
function offer(gate: AddCase): string {
  if (gate.mode !== "older") return "";
  const act = gate.update ? `<button type="button" class="btn primary" data-act="g:update">Update</button><button type="button" class="btn ghost" data-act="g:close">Not now</button>` : `<button type="button" class="btn ghost" data-act="g:close">Close</button>`;
  return `<div class="scrim" data-sheet="offer"><div class="sheet" role="dialog"><h2>Browse by goal</h2><p>${esc(gate.text)}</p>${act}</div></div>`;
}
function goals(bag: Obj, unit: Obj): string {
  const bins = binsOf(bag, unit);
  const cards = bins.map((bin, i) => `<button type="button" class="card" data-act="g:bin:${i}" data-goal="${esc(bin.title)}"><span class="grow"><span class="name">${esc(bin.title)}</span><span class="sub">${bin.cards.length}</span></span></button>`).join("");
  return `<div class="scrim" data-sheet="goals"><div class="sheet" role="dialog"><h2>Browse by goal</h2>${cards}<button type="button" class="btn ghost" data-act="g:close">Close</button></div></div>`;
}
function cards(bag: Obj, unit: Obj): string {
  const bin = binsOf(bag, unit)[picked]; if (bin === undefined) return goals(bag, unit);
  const id = typeof unit["id"] === "string" ? unit["id"] : "", q = query.toLowerCase();
  const rows = bin.cards.filter((card) => q === "" || `${card.name} ${card.summary}`.toLowerCase().includes(q)).map((card) => `<button type="button" class="card ability-add" data-act="g:add:${esc(card.id)}" data-add="${esc(`${card.name} ${card.summary}`)}">${diagramHtml(diagramOf(bag, id, card.id, null))}<span class="name">${esc(card.name)}</span><span class="sub">${esc(card.summary)}</span></button>`).join("");
  return `<div class="scrim" data-sheet="cards"><div class="sheet" role="dialog"><h2>${esc(bin.title)}</h2><input class="name-field" data-find value="${esc(query)}" aria-label="Tap a card to add it with defaults"><p class="hint">Tap a card to add it with defaults</p>${rows}<button type="button" class="btn ghost" data-act="g:back">Back</button></div></div>`;
}
export function addChrome(bag: Obj, unit: Obj, readOnly: boolean): string {
  if (readOnly || !isObj(bag["project.json"])) return "";
  const gate = addCase(bag, BUNDLED);
  if (gate.mode === "newer") return `<p class="hint">${esc(gate.text)}</p>`;
  const sheet = view === "offer" ? offer(gate) : view === "goals" ? goals(bag, unit) : view === "cards" ? cards(bag, unit) : "";
  return `<button type="button" class="btn ghost" data-act="g:open">+ Add ability</button>${sheet}`;
}
export function addClick(act: string, bag: Obj, unitId: string, setupId: string): AddHit {
  const gate = addCase(bag, BUNDLED);
  if (act === "g:close" || act === "g:back" && view === "goals") { addShut(); return { keep: true }; }
  if (act === "g:back") { view = "goals"; return { keep: true }; }
  if (act === "g:open") { view = gate.mode === "older" ? "offer" : "goals"; return { keep: true }; }
  if (act.startsWith("g:bin:")) { picked = Number(act.slice(6)); view = "cards"; return { keep: true }; }
  if (act === "g:update") { const next = updateProject(bag, BUNDLED); if (next === null) return { keep: true }; view = "off"; return { bag: next.bag, slice: next.slice, toast: "Changed · Undo" }; }
  if (act.startsWith("g:add:")) {
    if (skel === null || gate.mode !== "same") return { keep: true };
    const got = addAbility(bag, skel, unitId, setupId, act.slice(6), BUNDLED);
    if (got.mode !== "added") return { keep: true };
    view = "off"; return { bag: got.bag, slice: got.slice, toast: "Changed · Undo", open: setupId };
  }
  return { keep: true };
}
