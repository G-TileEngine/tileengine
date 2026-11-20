import { prefix, storedRev, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { testGate, playLine } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import type { Looks } from "../play-stage/load.ts";
import { openProject, type PlayOut } from "../play-stage/project.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
export type PlayReady = PlayOut & { readonly looks: Looks };
export type AimAt = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
type Start = (docs: PlayReady, aim?: AimAt) => void;
export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly aim?: AimAt; readonly start: Start };
export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";
const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
const stageOf = (docs: PlayReady): string => { const stage = docs.stage; return typeof stage === "object" && stage !== null && "id" in stage && typeof stage.id === "string" ? stage.id : ""; };
const showUrl = (id: string, stage: string, from: string, aim?: AimAt): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; const unit = aim?.unitId === undefined ? "" : `&unit=${encodeURIComponent(aim.unitId)}`; const ability = aim?.abilityId === undefined ? "" : `&ability=${encodeURIComponent(aim.abilityId)}`; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}${unit}${ability}`); };
function play(input: LaunchBag, text: DocText): Launch {
  const parsed = parseProject(text);
  if (!parsed.ok) return fail([parsed.message], text, 0);
  const load = readProject(parsed.files), gate = testGate(load.report, load.readOnly), rev = storedRev(parsed.files);
  if (!gate.allowed) return fail(gate.lines, text, rev);
  const opened = input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId);
  if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
  try { input.start(opened.docs, input.aim); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
  showUrl(input.id, stageOf(opened.docs), input.from, input.aim); return { ok: true, files: text, rev };
}
/** Read a saved folder and start its stage. No demo fallback. */
export async function openSaved(input: LaunchBag): Promise<Launch> {
  const text = await readTree(input.store, prefix(input.id));
  if (Object.keys(text).length === 0) return fail([`Can't open: no project ${input.id}`], text, 0);
  return play(input, text);
}
/** Save first. A failed save does not start a match. */
export async function launchTest(input: LaunchBag & { readonly stored: DocText; readonly next: DocText; readonly rev: number; readonly now: string }): Promise<Launch> {
  const plan = planSave(input.stored, input.next, input.rev, input.now);
  if (!plan.ok) return fail([plan.message], input.stored, input.rev);
  const wrote = await commitWrites(input.store, prefix(input.id), plan.writes);
  if (!wrote.ok) return fail([wrote.message], input.stored, input.rev);
  const text = await readTree(input.store, prefix(input.id));
  return play(input, text);
}
