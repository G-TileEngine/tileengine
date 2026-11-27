import { prefix, storedRev, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { emptyBoard, playLine, stageNames, testGate } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import { startOf } from "../../src/editor/stage/rooms.ts";
import { settleSession } from "../../src/project/read/session.ts";
import type { Notice } from "../../src/core/notice.ts";
import type { SessionParty, SessionSave } from "../../src/types/core-types.ts";
import type { Looks } from "../play-stage/load.ts";
import { openProject, arriveIn, type PlayOut } from "../play-stage/project.ts";
import type { LinkEvent } from "../../src/rules/session/links.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
import { assetRows } from "./asset-check.ts";
export type PlayReady = PlayOut & { readonly looks: Looks };
export type AimAt = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
export type Next = (from: PlayReady, link: LinkEvent, party: SessionParty) => { readonly docs: PlayReady | null; readonly error: string };
export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number; readonly notes?: readonly Notice[] } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
type Start = (docs: PlayReady, aim?: AimAt, next?: Next) => void;
export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly aim?: AimAt; readonly start: Start; readonly resume?: SessionSave };
export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";
const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
const stageOf = (docs: PlayReady): string => { const stage = docs.stage; return typeof stage === "object" && stage !== null && "id" in stage && typeof stage.id === "string" ? stage.id : ""; };
const showUrl = (id: string, stage: string, from: string, aim?: AimAt): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; const unit = aim?.unitId === undefined ? "" : `&unit=${encodeURIComponent(aim.unitId)}`; const ability = aim?.abilityId === undefined ? "" : `&ability=${encodeURIComponent(aim.abilityId)}`; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}${unit}${ability}`); };
function resumed(files: Parameters<typeof openProject>[0], save: SessionSave): { readonly docs: (PlayOut & { readonly looks: Looks }) | null; readonly error: string; readonly notes: readonly Notice[] } {
  const root = files["project.json"], rec = (v: unknown): Record<string, unknown> | null => (typeof v === "object" && v !== null && !Array.isArray(v) ? v as Record<string, unknown> : null), project = rec(rec(root)?.["project"]), list = project?.["stages"], stages = Array.isArray(list) ? list.filter((id): id is string => typeof id === "string") : [], units: string[] = [], bag: Record<string, Record<string, unknown>> = {}; for (const [path, doc] of Object.entries(files)) { const row = rec(doc); if (row !== null) { bag[path] = row; if (path.startsWith("units/") && typeof row["id"] === "string") units.push(row["id"]); } } const kept = settleSession(save, stages, units, startOf(bag) ?? stages[0] ?? ""); const got = arriveIn(files, kept.from, kept.to, kept.party); return { docs: got.docs, error: got.error, notes: kept.notes };
}
async function play(input: LaunchBag, text: DocText): Promise<Launch> {
  const parsed = parseProject(text);
  if (!parsed.ok) return fail([parsed.message], text, 0);
  const load = readProject(parsed.files), rows = await assetRows(input.store, prefix(input.id), parsed.files), gate = testGate([...load.report, ...rows], load.readOnly, stageNames(load)), rev = storedRev(parsed.files);
  if (!gate.allowed) return fail(gate.lines, text, rev);
  const opened = input.resume === undefined ? (input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId)) : resumed(parsed.files, input.resume);
  if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
  if (emptyBoard(opened.docs)) return fail(["Place a unit on this stage to test it."], text, rev);
  const art = (file: string): Promise<Blob | null> => input.store.readBlob(`${prefix(input.id)}${file}`);
  try { input.start({ ...opened.docs, art }, input.aim, (from, link, party) => { const got = arriveIn(parsed.files, stageOf(from), link.to, party); return got.docs === null ? got : { docs: { ...got.docs, art }, error: got.error }; }); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
  showUrl(input.id, stageOf(opened.docs), input.from, input.aim); const notes = "notes" in opened ? opened.notes : []; return notes.length > 0 ? { ok: true, files: text, rev, notes } : { ok: true, files: text, rev };
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
