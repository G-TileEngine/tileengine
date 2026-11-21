type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
export type RuleHit = { readonly source: "stage" | "project" | "default"; readonly setupId: string };
export type RuleBag = { readonly manifest: unknown; readonly stages: Readonly<Record<string, unknown>>; readonly setups: Readonly<Record<string, unknown>> };
/** Stage setup wins, else the project setup, else catalogue defaults. */
export function ruleOf(project: RuleBag, stageId: string, behaviourId: string): RuleHit {
  const stage = project.stages[stageId], root = isObj(project.manifest) && isObj(project.manifest["project"]) ? project.manifest["project"] : {};
  const hit = (ids: readonly unknown[], source: "stage" | "project"): RuleHit | null => { for (const id of ids) { if (typeof id !== "string") continue; const setup = project.setups[id]; if (isObj(setup) && setup["behaviourId"] === behaviourId) return { source, setupId: id }; } return null; };
  return hit(isObj(stage) ? list(stage["rules"]) : [], "stage") ?? hit(list(isObj(root) ? root["rules"] : undefined), "project") ?? { source: "default", setupId: "" };
}
