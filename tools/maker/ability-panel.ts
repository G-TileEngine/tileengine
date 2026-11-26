import { aimKind, detach, panelOf, resetAnswer, setAnswer, stageFor, type PanelKnob, type PanelModel } from "../../src/editor/unit/panel.ts";
import { effectRows } from "../../src/editor/effect/list.ts";
import { builtinRows, isBuiltin, withFx } from "../../src/editor/effect/builtins.ts";
import { BUNDLED } from "./catalogue.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { addChrome } from "./add-ability.ts";
import { diagramHtml, diagramOf } from "./unit-diagram.ts";
import { knobWidget, type KnobSpec } from "./widgets.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
let openId = "";
export function abilityShut(): void { openId = ""; }
export function abilityOpen(id: string): void { openId = id; }
export type AbilityPlay = { readonly unitId: string; readonly abilityId?: string; readonly aim?: "basic" | "spell"; readonly stageId: string };
export type AbilityEdit = { readonly keep: true } | { readonly play: AbilityPlay } | { readonly bag: Record<string, Obj>; readonly toast: string };
const specOf = (knob: PanelKnob): KnobSpec => ({ id: knob.id, label: knob.label, type: knob.type, ...(knob.min === undefined ? {} : { min: knob.min }), ...(knob.max === undefined ? {} : { max: knob.max }), ...(knob.step === undefined ? {} : { step: knob.step }), ...(knob.max_len === undefined ? {} : { max_len: knob.max_len }), ...(knob.options === undefined ? {} : { options: knob.options }), ...(knob.builtin === undefined ? {} : { builtin: knob.builtin }) });
export function panelHtml(model: PanelModel): string {
  const body = model.sections.map((section) => `<details class="ability"${section.open ? " open" : ""}><summary>${esc(section.question)}</summary>${section.knobs.map((knob) => `${knobWidget(specOf(knob), knob.value)}<button type="button" class="btn ghost" data-act="a:reset:${esc(knob.id)}">Reset to default</button>`).join("")}</details>`).join("");
  return `<div class="ability">${body}</div>`;
}
function rowsOf(bag: Record<string, Obj>, unit: Obj, slice: Obj, skip: string): string {
  let html = "";
  for (const sid of list(unit["setupIds"])) {
    if (typeof sid !== "string" || sid === skip) continue;
    const setup = bag[`setups/${sid}.json`]; if (!isObj(setup) || typeof setup["behaviourId"] !== "string") continue;
    const model = panelOf(slice, WIRED, setup["behaviourId"], isObj(setup["answers"]) ? setup["answers"] : {});
    if (model.role !== "row") continue;
    html += `<p class="row" data-role="row">${esc(model.name)}</p>${panelHtml(model)}`;
  }
  return html;
}
const fxRow = (bag: Record<string, Obj>, behaviourId: string, answers: Obj): string => {
  if (aimKind(behaviourId) === undefined) return "";
  const cur = isObj(answers["effect"]) && answers["effect"]["source"] !== "default" && typeof answers["effect"]["value"] === "string" ? answers["effect"]["value"] : "none";
  const saved = effectRows(bag).map((row) => `<button type="button" class="choice" data-act="a:fx:${esc(row.id)}" aria-pressed="${cur === row.id}">${esc(row.name)}</button>`).join("");
  const built = builtinRows(bag, BUNDLED, behaviourId);
  const extra = built.length === 0 ? "" : `<p class="row">Built-in</p>${built.map((row) => `<button type="button" class="choice" data-act="a:fx:${esc(row.id)}" aria-pressed="${isBuiltin(cur, row.id)}">${esc(row.name)}</button>`).join("")}`;
  return `<p class="row">Effect</p><button type="button" class="choice" data-act="a:fx:none" aria-pressed="${cur === "none"}">None</button>${saved}${extra}`;
};
export function abilityView(bag: Record<string, Obj>, unit: Obj, readOnly: boolean): string {
  const slice = bag["catalogue/slice.json"]; if (!isObj(slice)) return "";
  const id = typeof unit["id"] === "string" ? unit["id"] : "", placed = stageFor(bag, id), ids = list(unit["setupIds"]).filter((item): item is string => typeof item === "string");
  if (openId !== "" && !ids.includes(openId)) openId = "";
  const open = bag[`setups/${openId}.json`];
  if (openId !== "" && isObj(open) && typeof open["behaviourId"] === "string") {
    const model = panelOf(slice, WIRED, open["behaviourId"], isObj(open["answers"]) ? open["answers"] : {});
    const marks = diagramHtml(diagramOf(bag, id, open["behaviourId"], isObj(open["answers"]) ? open["answers"] : null));
    return `<h2>Abilities</h2><button type="button" class="btn ghost" data-act="a:shut">Back</button><h2>${esc(model.name)}</h2>${panelHtml(model)}${fxRow(bag, open["behaviourId"], isObj(open["answers"]) ? open["answers"] : {})}${marks}${rowsOf(bag, unit, slice, openId)}`;
  }
  const cards = ids.flatMap((sid) => {
    const setup = bag[`setups/${sid}.json`]; if (!isObj(setup) || typeof setup["behaviourId"] !== "string") return [];
    const model = panelOf(slice, WIRED, setup["behaviourId"], isObj(setup["answers"]) ? setup["answers"] : {});
    if (model.role !== "card") return [];
    const test = placed === null ? "" : `<button type="button" class="btn" data-act="a:test:${esc(sid)}">Test</button>`;
    const drop = readOnly ? "" : `<button type="button" class="btn" data-act="a:drop:${esc(sid)}" aria-label="Remove ${esc(model.name)}">×</button>`;
    return [`<div class="card" data-role="card"><button type="button" class="grow card-hit" data-act="a:open:${esc(sid)}"><span class="name">${esc(model.name)}</span></button>${test}${drop}</div>`];
  }).join("");
  const whole = placed === null ? `<p>Place this unit on a stage to test it.</p>` : `<button type="button" class="btn" data-act="a:test">▶ Test</button>`;
  return `<h2>Abilities</h2>${cards}${addChrome(bag, unit, readOnly)}${whole}`;
}
function clamp(knob: PanelKnob, value: number): number {
  const min = knob.min ?? value, max = knob.max ?? value, step = knob.step !== undefined && knob.step > 0 ? knob.step : 1;
  return Math.min(max, Math.max(min, Math.round((value - min) / step) * step + min));
}
function writeKnob(bag: Record<string, Obj>, key: string, raw: unknown, reset: boolean): AbilityEdit {
  const setup = bag[`setups/${openId}.json`], slice = bag["catalogue/slice.json"];
  if (!isObj(setup) || !isObj(slice) || typeof setup["behaviourId"] !== "string") return { keep: true };
  const answers = isObj(setup["answers"]) ? setup["answers"] : {};
  const knob = panelOf(slice, WIRED, setup["behaviourId"], answers).sections.flatMap((section) => [...section.knobs]).find((item) => item.id === key);
  if (knob === undefined) return { keep: true };
  const value = knob.type === "slider" && typeof raw === "string" ? clamp(knob, Number(raw)) : knob.type === "toggle" ? raw === true : raw;
  if (knob.type === "slider" && typeof value === "number" && !Number.isFinite(value)) return { keep: true };
  const next = reset ? resetAnswer(answers, key) : setAnswer(answers, key, value, knob.def);
  return { bag: { ...bag, [`setups/${openId}.json`]: { ...setup, answers: next } }, toast: "Changed · Undo" };
}
export function abilityAct(act: string, bag: Record<string, Obj>, unitId: string): AbilityEdit {
  const path = `units/${unitId}.json`, unit = bag[path];
  if (!isObj(unit)) return { keep: true };
  if (act === "a:shut") { openId = ""; return { keep: true }; }
  if (act.startsWith("a:open:")) { openId = act.slice(7); return { keep: true }; }
  if (act.startsWith("a:fx:")) {
    const value = act.slice(5);
    const setup = bag[`setups/${openId}.json`];
    if (!isObj(setup) || typeof setup["behaviourId"] !== "string") return { keep: true };
    const answers = isObj(setup["answers"]) ? setup["answers"] : {};
    const behaviourId = setup["behaviourId"];
    if (builtinRows(bag, BUNDLED, behaviourId).some((row) => row.id === value)) {
      const next = withFx(bag, BUNDLED);
      if (next === null) return { keep: true };
      return { bag: { ...next, [`setups/${openId}.json`]: { ...setup, answers: setAnswer(answers, "effect", value, "none") } }, toast: "Changed · Undo" };
    }
    if (value !== "none" && !effectRows(bag).some((row) => row.id === value)) return { keep: true };
    return { bag: { ...bag, [`setups/${openId}.json`]: { ...setup, answers: setAnswer(answers, "effect", value, "none") } }, toast: "Changed · Undo" };
  }
  if (act === "a:test" || act.startsWith("a:test:")) {
    const stageId = stageFor(bag, unitId); if (stageId === null) return { keep: true };
    const abilityId = act === "a:test" ? undefined : act.slice(7);
    const setup = abilityId === undefined ? undefined : bag[`setups/${abilityId}.json`];
    const behaviour = isObj(setup) && typeof setup["behaviourId"] === "string" ? setup["behaviourId"] : "";
    const aim = aimKind(behaviour);
    return { play: { unitId, stageId, ...(abilityId === undefined ? {} : { abilityId }), ...(aim === undefined ? {} : { aim }) } };
  }
  if (act.startsWith("a:drop:")) { const id = act.slice(7); if (openId === id) openId = ""; return { bag: { ...bag, [path]: detach(unit, id) }, toast: "Changed · Undo" }; }
  if (act.startsWith("a:reset:")) return writeKnob(bag, act.slice(8), undefined, true);
  const cut = (head: string): [string, string] => { const rest = act.slice(head.length), at = rest.indexOf(":"); return [rest.slice(0, at), rest.slice(at + 1)]; };
  if (act.startsWith("a:set:")) { const [key, value] = cut("a:set:"); return writeKnob(bag, key ?? "", value, false); }
  if (act.startsWith("k:pick:") || act.startsWith("k:colour:")) { const [key, value] = cut(act.startsWith("k:pick:") ? "k:pick:" : "k:colour:"); return writeKnob(bag, key ?? "", value, false); }
  if (act.startsWith("k:toggle:")) { const key = act.slice(9), setup = bag[`setups/${openId}.json`], slice = bag["catalogue/slice.json"]; const answers = isObj(setup) && isObj(setup["answers"]) ? setup["answers"] : {}; const behaviour = isObj(setup) && typeof setup["behaviourId"] === "string" ? setup["behaviourId"] : ""; const knob = isObj(slice) ? panelOf(slice, WIRED, behaviour, answers).sections.flatMap((section) => [...section.knobs]).find((item) => item.id === key) : undefined; return writeKnob(bag, key, knob?.value !== true, false); }
  return { keep: true };
}
