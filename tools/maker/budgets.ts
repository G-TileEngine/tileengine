import { budgetUse, readProject, type BudgetUse } from "../../src/project/load/index.ts";
import type { BudgetKey } from "../../src/types/core-types.ts";
import { parseProject } from "./project-files.ts";
const KEYS: readonly BudgetKey[] = ["units", "activeAi", "effects", "stageTiles"];
const LABEL: Readonly<Record<BudgetKey, string>> = { units: "Units", activeAi: "Active AI", effects: "Effects", stageTiles: "Stage size" };
let open = false;
export function budgetsTap(paint: () => void): void {
  open = !open;
  paint();
}
function picked(files: Readonly<Record<string, string>>): BudgetUse[] {
  const parsed = parseProject(files);
  if (!parsed.ok) return [];
  const load = readProject(parsed.files);
  if (load.project === null) return [];
  const all = budgetUse(load.project);
  const rows: BudgetUse[] = [];
  for (const key of KEYS) {
    let best: BudgetUse | undefined;
    for (const use of all) if (use.budget === key && (best === undefined || use.used > best.used)) best = use;
    if (best !== undefined) rows.push(best);
  }
  return rows;
}
function rowHtml(use: BudgetUse): string {
  const mark = use.used > use.limit ? " · over limit" : use.used >= use.warn ? " · near limit" : "";
  const max = Math.max(use.used, use.limit);
  const meter = `<meter min="0" max="${max}" low="${use.warn - 0.5}" high="${use.limit + 0.5}" optimum="0" value="${use.used}" aria-hidden="true"></meter>`;
  return `<p class="budget" data-budget="${use.budget}"><span>${LABEL[use.budget]}</span> <span>${use.used} of ${use.limit}${mark}</span>${meter}</p>`;
}
export function budgetsRow(files: Readonly<Record<string, string>>): string {
  const rows = picked(files);
  if (rows.length === 0) return "";
  let over = 0;
  let near = 0;
  for (const use of rows) if (use.used > use.limit) over += 1; else if (use.used >= use.warn) near += 1;
  const summary = over > 0 ? `Budgets: ${over} over the limit` : near > 0 ? `Budgets: ${near} near the limit` : "Budgets: all good";
  const body = open ? rows.map(rowHtml).join("") : "";
  return `<div class="budgets" data-budgets><button type="button" class="btn ghost stage-row" data-act="budgets" aria-expanded="${open ? "true" : "false"}">${summary}</button>${body}</div>`;
}
