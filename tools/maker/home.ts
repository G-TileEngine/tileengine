import { aimKind } from "../../src/editor/unit/panel.ts";
import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
import { asWrites, planSave } from "../../src/editor/project/save.ts";
import { parseProject } from "./project-files.ts";
import { projectScreen } from "./project.ts";
import { buildButton, buildSheet, type BuildSheet, type BuildView } from "./build-sheet.ts";
import { buildGame, playBase } from "./export.ts";
import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
import { addFind, rememberAbility } from "./add-ability.ts";
import { DEV } from "./dev.ts"; // dev-only
import { rememberRule, rulesAct, rulesOpen, rulesShut } from "./rules-panel.ts";
import { levelsAct, levelsOpen, levelsSection, levelsSheet, rememberLevels } from "./levels.ts";
import { effectsAct, effectsSection, effectsSheet, fxOpen } from "./effects.ts";
import { bindStage, dropUndo, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
import { backScreen, launchTest, openSaved, type AimAt, type Next, type PlayReady } from "./test-launch.ts";
import { startMatch } from "../play-stage/page.ts";
import { ENGINE_VERSION } from "../../src/index.ts";
import { addPicture, artLines, artSheet, dropLayer, hideArt, setArtLines, setArtNote, showArt, uploadBytes } from "./art.ts";
import type { SessionParty, SessionSave } from "../../src/types/core-types.ts";
import type { LinkEvent } from "../../src/rules/session/links.ts";
import { keptLine, readAutosave, writeAutosave } from "./session.ts";
const OPFS = "This browser can't save projects here. Open the app from its web address.";
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | "effect" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve(), resume: SessionSave | null = null, building: BuildView = "idle";
const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
const fail = (e: unknown): void => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.");
const go = (act: string): void => { gate = gate.then(() => run(act)).catch(fail); };
const rowHtml = (row: Row): string => { const open = row.error === null, tag = open ? "button" : "div"; return `<article class="card"><${tag} class="grow card-hit"${open ? ` type="button" data-act="open:${row.id}"` : ""}><span class="name">${esc(row.name)}</span><span class="sub">${esc(row.error ?? subline(row, Date.now()))}</span>${row.badge === null ? "" : `<span class="badge">${esc(row.badge)}</span>`}</${tag}><button type="button" class="btn icon" data-act="menu:${row.id}" aria-label="Project menu">⋯</button></article>`; };
function sheet(): string {
  if (state.screen === "pick") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a start</h2><button type="button" class="choice" data-act="tpl:demo" aria-pressed="${state.tpl === "demo" ? "true" : "false"}">Demo</button><button type="button" class="choice" data-act="tpl:empty" aria-pressed="${state.tpl === "empty" ? "true" : "false"}">Empty</button><button type="button" class="btn" data-act="toname">Continue</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
  if (state.screen === "menu") { const row = state.rows.find((item) => item.id === state.menu), ok = row?.error === null; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(row?.name ?? "Project")}</h2>${ok ? `<button type="button" class="btn ghost" data-act="askrename">Rename</button><button type="button" class="btn ghost" data-act="duplicate">Duplicate</button>` : ""}<button type="button" class="btn danger" data-act="delete">Delete</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`; }
  if (state.screen !== "name" && state.screen !== "rename") return "";
  return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? "Save name" : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
}
function paint(): void {
  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() || fxOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
  if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
  if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + artSheet(state.files, state.stageId, state.readOnly) + edit + toast; return; }
  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${buildButton(building)}${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly) + buildSheet(built)) + (unitEditing() ? "" : toast); return; }
  const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
  const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
  const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
  root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
}
async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; resume = null; bindRooms(id); bindUnits(id); paint(); const live = store, want = { projectId: id, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }; readAutosave(live, want).then((got) => { if (state.current !== id || got === null) return; if (!got.ok) { const line = keptLine(got.code); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); return; } resume = got.save; paint(); }).catch((e: unknown) => { if (state.current !== id) return; const line = keptLine(e instanceof Error ? e.message : "read failed"); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); }); }
async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
async function rename(): Promise<void> { if (store === null || state.menu === null) return; const err = checkName(state.name); if (err !== null) { say(err); return; } const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } if (rowFrom(state.menu, parsed.files).readOnly) { say("Made with a newer TileEngine. Open only."); return; } const plan = planSave(text, renameTo(text, state.name), storedRev(parsed.files), nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.menu), plan.writes); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), from = prefix(state.menu), bins: { path: string; bytes: Uint8Array }[] = []; for (const name of await store.list(`${from}assets/`)) { const blob = await store.readBlob(`${from}assets/${name}`); if (blob !== null) bins.push({ path: `assets/${name}`, bytes: new Uint8Array(await blob.arrayBuffer()) }); } const got = await commitWrites(store, prefix(id), [...bins, ...asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))]); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
async function remove(): Promise<void> { if (store === null || state.menu === null) return; const id = state.menu; await movePrefix(store, prefix(id), prefix(id, true)); toastId = id; state.toast = "Deleted · Undo"; state.screen = "home"; window.clearTimeout(timer); timer = window.setTimeout(() => { state.toast = null; paint(); }, 6000); await refresh(); paint(); }
async function restore(id: string): Promise<void> { if (store === null || id === "") return; const taken = (await store.list(LIVE)).includes(id), text = await readTree(store, prefix(id, true)), plan = restorePlan(id, taken, text, projectId(Date.now(), bytes()), nowIso(), state.rows.map((row) => row.name)); if (taken) { const got = await commitWrites(store, prefix(plan.id), asWrites(plan.files)); if (!got.ok) { say(got.message); return; } for (const rel of Object.keys(text)) await store.remove(`${prefix(id, true)}${rel}`); } else await movePrefix(store, prefix(id, true), prefix(id)); window.clearTimeout(timer); state.toast = null; state.screen = "home"; state.banner = null; await refresh(); paint(); }
function saveTrip(link: LinkEvent, party: SessionParty): void { if (store === null || state.current === null) return; const header = { projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION, projectId: state.current, savedAt: nowIso() }; writeAutosave(store, header, link.from, link.to, party).then((res) => { if (!res.ok) { state.banner = res.message; paint(); return; } resume = res.save; }).catch((e: unknown) => { state.banner = `Autosave skipped (${e instanceof Error ? e.message : "error"}). The saved game is kept.`; paint(); }); }
function enterPlay(docs: PlayReady, scroll: number, aim?: AimAt, next?: Next): void {
  const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
  const out = (): void => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; };
  const travel = next === undefined ? undefined : (link: LinkEvent, party: SessionParty): void => { const got = next(docs, link, party); if (got.docs === null) { out(); state.problems = [got.error]; paint(); return; } if (link.autosave) saveTrip(link, party); canvas.remove(); document.querySelector("#hud")?.remove(); enterPlay(got.docs, scroll, undefined, next); };
  try { startMatch(docs, out, aim, travel); root.hidden = true; } catch (e) { canvas.remove(); throw e; }
}
async function saveStage(): Promise<boolean> {
  if (store === null || state.current === null) return false;
  const out = await stageCommit({ store, id: state.current, now: nowIso() }, state.files, state.rev);
  state.files = out.files; state.rev = out.rev; state.dirty = out.dirty; if (!out.ok) state.banner = out.message; else if (!state.readOnly) state.banner = null; return out.ok;
}
async function beginTest(aim?: AimAt & { readonly stageId?: string }, held?: SessionSave): Promise<void> {
  if (store === null || state.current === null) return;
  const stageId = aim?.stageId ?? (state.screen === "stage" ? state.stageId : null);
  if (stageId !== null && state.screen === "stage" && !await saveStage()) { paint(); return; }
  const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
  const launched = aim?.unitId === undefined ? undefined : { ...(aim.abilityId === undefined ? { unitId: aim.unitId } : { unitId: aim.unitId, abilityId: aim.abilityId }), ...(aim.aim === undefined ? {} : { aim: aim.aim }) };
  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null && state.screen === "stage" ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), ...(launched === undefined ? {} : { aim: launched }), ...(held === undefined ? {} : { resume: held }), now: nowIso(), start: (docs, at, next) => enterPlay(docs, scroll, at, next) });
  state.files = got.files; state.rev = got.rev;
  if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
  if (held !== undefined) {
    const fresh = store === null || state.current === null ? null : await readAutosave(store, { projectId: state.current, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }), resumeNotes = fresh !== null && fresh.ok ? fresh.notes : [];
    const parts: string[] = []; if (resumeNotes.some((n) => n.code === "saveProjectMismatch") || (got.notes ?? []).some((n) => n.code === "saveProjectMismatch")) parts.push("the project changed"); if (resumeNotes.some((n) => n.code === "saveEngineMismatch") || (got.notes ?? []).some((n) => n.code === "saveEngineMismatch")) parts.push("TileEngine changed"); for (const n of [...resumeNotes, ...(got.notes ?? [])]) if (n.code === "saveRefDropped") parts.push(n.message === held.to ? `dropped the stage it was going to ${n.message}` : n.message === held.from ? `dropped the stage it came from ${n.message}` : `dropped unitId ${n.message}`); if (parts.length > 0) state.banner = `Continued. Since the save: ${parts.join("; ")}`; paint();
  }
  state.dirty = false; state.problems = [];
}
function aimAt(text: DocText, unit: string, ability: string | null): AimAt {
  if (ability === null) return { unitId: unit };
  const parsed = parseProject(text); let behaviour = "";
  if (parsed.ok) for (const [path, doc] of Object.entries(parsed.files)) if (path.startsWith("setups/") && typeof doc === "object" && doc !== null && !Array.isArray(doc) && "id" in doc && doc["id"] === ability && typeof doc["behaviourId"] === "string") behaviour = doc["behaviourId"];
  const aim = aimKind(behaviour);
  return { unitId: unit, abilityId: ability, ...(aim === undefined ? {} : { aim }) };
}
async function fromUrl(): Promise<void> {
  const params = new URLSearchParams(location.search), id = params.get("project");
  if (id === null || store === null) return;
  const stage = params.get("stage"), from = params.get("from") ?? "project", unit = params.get("unit"), ability = params.get("ability");
  const text = await readTree(store, prefix(id)), aim = unit === null ? undefined : aimAt(text, unit, ability);
  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), ...(aim === undefined ? {} : { aim }), start: (docs, at, next) => enterPlay(docs, 0, at, next) });
  if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
  if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
}
async function run(act: string): Promise<void> {
  if (state.stageId !== null && store !== null && state.current !== null && ((state.screen === "stage" && (act.startsWith("r:") || (rulesOpen() && !unitEditing() && act.startsWith("k:")))) || (act === "undo" && state.undo === "rule"))) {
    const hit = await rulesAct(act === "undo" ? "r:undo" : act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "rule"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || state.screen === "project") paint(); }, 6000); }
    paint(); return;
  }
  const unitUndo = act === "undo" && state.undo === "unit";
  if (((act.startsWith("l:") && state.screen === "project") || (act === "undo" && state.undo === "level")) && store !== null && state.current !== null) {
    const hit = await levelsAct(act === "undo" ? "l:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "level"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project") paint(); }, 6000); }
    paint(); return;
  }
  if ((((act.startsWith("e:") || (fxOpen() && act.startsWith("k:"))) && state.screen === "project") || (act === "undo" && state.undo === "effect")) && store !== null && state.current !== null) {
    const hit = await effectsAct(act === "undo" ? "e:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "effect"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project") paint(); }, 6000); }
    paint(); return;
  }
  if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || act.startsWith("t:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
    const hadBanner = state.banner !== null;
    const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || (state.screen === "project" && !unitEditing())) paint(); }, 6000); }
    if (hit.play !== undefined) return beginTest({ unitId: hit.play.unitId, stageId: hit.play.stageId, ...(hit.play.abilityId === undefined ? {} : { abilityId: hit.play.abilityId }), ...(hit.play.aim === undefined ? {} : { aim: hit.play.aim }) });
    if (act.startsWith("u:stat:") && hit.banner === null && !hadBanner && typeof hit.shown === "string") {
      const key = act.split(":")[2] ?? "", span = /^[A-Za-z0-9_-]+$/.test(key) ? document.querySelector(`[data-val="${key}"]`) : null;
      if (span !== null) span.textContent = hit.shown;
      const sib = span?.nextElementSibling;
      if (sib instanceof HTMLElement && sib.tagName === "P" && sib.textContent === "Same as army") { const btn = document.createElement("button"); btn.type = "button"; btn.className = "btn ghost"; btn.setAttribute("data-act", `u:reset:${key}`); btn.textContent = "Reset"; sib.replaceWith(btn); }
      return;
    }
    paint(); return;
  }
  if ((act.startsWith("r:") || (act === "undo" && state.screen === "project")) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
    const hit = await roomClick(act === "undo" ? "r:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes, empty: templates.empty });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "room"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project" && !unitEditing()) paint(); }, 6000); }
    if (hit.stageId !== null) { state.stageId = hit.stageId; bindStage(hit.stageId, state.current); state.screen = "stage"; if (!state.readOnly) state.banner = null; history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(hit.stageId)}&from=stage`); }
    paint(); return;
  }
  if (act.startsWith("stage:")) { rulesShut(); state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
  if ((act === "b:open" || act === "b:close" || act.startsWith("b:del:")) && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
    if (act === "b:close") hideArt(); else if (act === "b:open") { showArt(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); } else if (!state.readOnly) { if (!await saveStage()) setArtNote(state.banner ?? "Couldn't save."); else { const got = await dropLayer(store, state.current, state.files, state.rev, state.stageId, Number(act.slice(6)), nowIso()); if (!got.ok) setArtNote(got.line); else { state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); } } }
    paint(); return;
  }
  if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
    const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty;
    if (out.unitId !== undefined && !out.test) { openUnit(out.unitId); paint(); return; }
    if (out.test) return beginTest(out.unitId === undefined ? undefined : { unitId: out.unitId, ...(out.stageId === undefined ? {} : { stageId: out.stageId }) });
    if (out.leave) { rulesShut(); hideArt(); state.screen = "project"; } paint(); return;
  }
  if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
  if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
  if (act.startsWith("open:")) forgetBuild();
  if (act === "build:share") return shareBuild();
  if (act === "build:done") return closeBuild();
  if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "build") return buildNow(); if (act === "continue" && resume !== null) return beginTest(undefined, resume); if (act === "fix") { state.problems = []; paint(); }
}
let built: BuildSheet = null;
let builtFile: File | null = null;
function download(file: File): void {
  const url = URL.createObjectURL(file), a = document.createElement("a");
  a.href = url; a.download = file.name; a.click(); URL.revokeObjectURL(url);
}
async function buildNow(): Promise<void> {
  if (store === null || state.current === null) return;
  if (state.dirty) await saveCurrent();
  if (state.dirty) return;
  const id = state.current;
  built = null;
  building = "busy"; state.problems = []; paint();
  try {
    const got = await buildGame(store, id, async (path) => { const res = await fetch(new URL(path, playBase(import.meta.url))); if (!res.ok) throw new Error(`Can't build: ${path}`); return res.text(); });
    if (!got.ok) { state.problems = got.lines; building = "idle"; paint(); return; }
    builtFile = new File([got.bytes as BlobPart], `${id}-game.zip`, { type: "application/zip" });
    download(builtFile);
    built = { mode: "ready", file: builtFile.name, share: navigator.canShare?.({ files: [builtFile] }) === true };
  } catch (e) { built = { mode: "error", reason: e instanceof Error ? e.message : "Can't build" }; }
  building = "idle"; paint();
}
async function shareBuild(): Promise<void> {
  if (builtFile === null || built === null || built.mode !== "ready") return;
  try {
    if (navigator.share === undefined) throw new Error("Couldn't share your game.");
    await navigator.share({ files: [builtFile], title: builtFile.name });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") return;
    built = { mode: "error", reason: e instanceof Error && e.message !== "" ? e.message : "Couldn't share your game." };
    paint();
  }
}
function forgetBuild(): void {
  built = null;
  builtFile = null;
}
function closeBuild(): void {
  forgetBuild();
  paint();
}
async function boot(): Promise<void> {
  paint();
  try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
  try {
    const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.ability.json")) { const parsed = parseProject({ "setups/setup.ability.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberAbility(parsed.files["setups/setup.ability.json"]); continue; } if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/setup.rule.json")) { const parsed = parseProject({ "setups/setup.rule.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberRule(parsed.files["setups/setup.rule.json"]); rememberLevels(parsed.files["setups/setup.rule.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) go(node.getAttribute("data-act") ?? ""); });
let held: { act: string; t: number } | null = null;
document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-lvl")) { go(`l:set:${node.getAttribute("data-lvl") ?? ""}:${node.value}`); return; } if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(fxOpen() ? `e:set:${key}:${node.value}` : key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
document.addEventListener("change", (ev) => { const node = ev.target; if (node instanceof HTMLInputElement && node.hasAttribute("data-fxname")) { go(`e:name:${node.value}`); return; } if (!(node instanceof HTMLInputElement) || !node.hasAttribute("data-art")) return; const file = node.files?.[0]; node.value = ""; if (file === undefined) return; gate = gate.then(async () => { if (store === null || state.current === null || state.stageId === null || state.screen !== "stage" || state.readOnly) return; if (!await saveStage()) { setArtNote(state.banner ?? "Couldn't save."); paint(); return; } let raw: Uint8Array; try { raw = await uploadBytes(file); } catch (e) { setArtNote(`Couldn't add ${file.name}: ${e instanceof Error ? e.message : "read failed"}`); paint(); return; } const got = await addPicture(store, state.current, state.files, state.rev, state.stageId, nowIso(), file.name, raw); if (!got.ok) { setArtNote(got.line); paint(); return; } state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); paint(); }).catch(fail); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
void boot();
