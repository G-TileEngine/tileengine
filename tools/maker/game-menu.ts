import { icon, type IconName } from "./icons.ts";
const amp = String.fromCharCode(38);
const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export type MenuView = "none" | "menu" | "switch" | "units" | "effects" | "levels";
const VIEWS: readonly MenuView[] = ["none", "menu", "switch", "units", "effects", "levels"];
let view: MenuView = "none";
export function menuView(): MenuView {
  return view;
}
export function menuSet(next: string): void {
  const found = VIEWS.find((item) => item === next);
  if (found === undefined) {
    throw new Error(`maker: no menu view ${next}`);
  }
  view = found;
}
export type MenuHost = { readonly name: string; readonly stages: number; readonly units: number; readonly effects: number; readonly budgets: string; readonly build: string; readonly dirty: boolean; readonly readOnly: boolean; readonly resume: boolean };
const close = `<button type="button" class="btn icon" data-act="m:close" aria-label="Close">${icon("close")}</button>`;
const modal = (name: string, inner: string): string => `<div class="scrim" data-sheet="${name}"><div class="sheet" role="dialog"><div class="grabber"></div>${inner}</div></div>`;
const head = (title: string): string => `<div class="sheet-head"><h2>${esc(title)}</h2>${close}</div>`;
const count = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;
function row(act: string, glyph: IconName, name: string, meta: string): string {
  const tail = meta === "" ? "" : `<span class="meta">${esc(meta)}</span>`;
  return `<button type="button" class="list-row" data-act="${act}">${icon(glyph)}<span class="grow">${esc(name)}</span>${tail}${icon("chevron")}</button>`;
}
export function gameMenu(host: MenuHost): string {
  const reason = "Made with a newer TileEngine. Open only.";
  const save = host.readOnly ? `<button type="button" class="list-row" disabled title="${esc(reason)}">${icon("save")}<span class="grow">Save</span>${icon("chevron")}</button>` : row("save", "save", "Save", host.dirty ? "Unsaved" : "Saved");
  const cont = host.resume ? `<button type="button" class="btn ghost" data-act="continue">Continue</button>` : "";
  const rows = [row("m:switch", "stages", "Stages & maps", count(host.stages, "stage", "stages")), row("m:units", "units", "Units", String(host.units)), row("m:effects", "effects", "Effects", String(host.effects)), row("m:levels", "levels", "Levels & XP", ""), host.budgets, host.build, save, row("m:games", "games", "My games", "")];
  return modal("game-menu", `${head(host.name)}${rows.join("")}${cont}`);
}
export function stageSwitcher(rows: readonly { readonly id: string; readonly name: string }[], current: string, readOnly: boolean, tail: string): string {
  const items = rows.map((item) => {
    const lead = item.id === current ? icon("check") : `<span class="slot"></span>`;
    const pick = `<button type="button" class="list-row" data-act="stage:${esc(item.id)}" aria-current="${item.id === current ? "true" : "false"}">${lead}<span class="grow">${esc(item.name)}</span></button>`;
    const more = readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(item.id)}" aria-label="Menu ${esc(item.name)}">${icon("more")}</button>`;
    return `<div class="pair">${pick}${more}</div>`;
  });
  return modal("stage-switcher", `${head("Stages")}<p class="eyebrow">Stages</p>${items.join("")}${tail}`);
}
export function sectionSheet(name: MenuView, body: string): string {
  return modal(`menu-${name}`, `<div class="sheet-head bare">${close}</div>${body}`);
}
