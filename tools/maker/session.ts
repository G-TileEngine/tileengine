import { SAVE_MIGRATIONS, migrateSave, type SaveChains } from "../../src/sim/migrations/save/index.ts";
import { SESSION_FORMAT, readSession, sessionSave, sessionVersion, type SessionRead } from "../../src/project/read/session.ts";
import type { SaveHeader, SessionParty, SessionSave } from "../../src/types/core-types.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, type MakerStore } from "./store.ts";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export const slotOf = (id: string): string => `tileengine/saves/${id}/autosave.json`;
export const keptLine = (why: string): string => `The saved game can't be read (${why}). It is kept.`;
export async function readAutosave(store: MakerStore, want: { readonly projectId: string; readonly projectHash: string; readonly engineVersion: string }, chains: SaveChains = SAVE_MIGRATIONS): Promise<SessionRead | null> {
  const text = await store.read(slotOf(want.projectId)); if (text === null) return null;
  const parsed = parseProject({ "autosave.json": text }); if (!parsed.ok) return { ok: false, code: "invalidValue", needsMigration: false };
  const doc = parsed.files["autosave.json"]; const fv = isObj(doc) ? sessionVersion(doc) : null; if (!isObj(doc) || fv === null) return { ok: false, code: "invalidValue", needsMigration: false };
  if (fv < SESSION_FORMAT) { let migrated: Readonly<Record<string, unknown>> | null; try { migrated = migrateSave("session-save", doc, fv, SESSION_FORMAT, chains); } catch { return { ok: false, code: "saveMigrationFailed", needsMigration: true }; } if (migrated === null) return { ok: false, code: "saveFormatOlder", needsMigration: true }; const read = readSession(migrated, want); return !read.ok && read.detail !== "projectId" ? { ok: false, code: "saveMigrationFailed", needsMigration: true } : read; }
  return readSession(doc, want);
}
let queue: Promise<unknown> = Promise.resolve();
const lane = <T>(job: () => Promise<T>): Promise<T> => { const run = queue.then(job); queue = run.catch(() => undefined); return run; };
async function writeOne(store: MakerStore, header: SaveHeader, from: string, to: string, party: SessionParty): Promise<{ readonly ok: true; readonly save: SessionSave } | { readonly ok: false; readonly message: string }> {
  const save = sessionSave(header, from, to, party), check = readSession(save, { projectId: header.projectId, projectHash: header.projectHash, engineVersion: header.engineVersion });
  if (!check.ok) return { ok: false, message: `Autosave skipped: this game can't be saved (${check.detail === undefined ? check.code : `${check.code} ${check.detail}`}).` };
  const got = await readAutosave(store, { projectId: header.projectId, projectHash: header.projectHash, engineVersion: header.engineVersion }); if (got !== null && !got.ok) return { ok: false, message: `Autosave skipped: ${keptLine(got.code)}` };
  const wrote = await commitWrites(store, `tileengine/saves/${header.projectId}`, [{ path: "autosave.json", text: JSON.stringify(save) }]);
  return wrote.ok ? { ok: true, save } : { ok: false, message: wrote.message };
}
export const writeAutosave: typeof writeOne = (store, header, from, to, party) => lane(() => writeOne(store, header, from, to, party));
