import type { Notice } from "../../core/notice.ts";
import type { SaveHeader, SessionParty, SessionSave } from "../../types/core-types.ts";
import { isInt, isObj, isStr } from "./guard.ts";
export const SESSION_FORMAT: SessionSave["formatVersion"] = 1;
const note = (code: string, message: string): Notice => ({ code, message });
const whole = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n >= 0;
const no = (code: "saveFormatNewer" | "saveFormatOlder" | "saveMigrationFailed" | "invalidValue", needsMigration: boolean, detail?: string) => detail === undefined ? { ok: false as const, code, needsMigration } : { ok: false as const, code, detail, needsMigration };
export type SessionRefusal = ReturnType<typeof no>;
export type SessionRead = { readonly ok: true; readonly save: SessionSave; readonly notes: readonly Notice[] } | SessionRefusal;
export function sessionVersion(doc: unknown): number | null { return isObj(doc) && isInt(doc["formatVersion"]) ? doc["formatVersion"] : null; }
export function sessionSave(header: SaveHeader, from: string, to: string, party: SessionParty): SessionSave { return { kind: "session-save", formatVersion: SESSION_FORMAT, header, from, to, party }; }
function readParty(v: unknown): SessionParty | SessionRefusal {
  if (!isObj(v) || !isStr(v["side"]) || !Array.isArray(v["members"])) return no("invalidValue", false, "party");
  const seen = new Set<string>(), members: { unitId: string; hp: number }[] = [];
  for (const m of v["members"]) { const id = isObj(m) ? m["unitId"] : undefined, hp = isObj(m) ? m["hp"] : undefined; if (!isStr(id) || typeof hp !== "number" || !Number.isInteger(hp) || hp < 1 || seen.has(id)) return no("invalidValue", false, "members"); seen.add(id); members.push({ unitId: id, hp }); }
  if (members.length < 1) return no("invalidValue", false, "members");
  const b = v["bar"]; if (b === null) return { side: v["side"], members, bar: null };
  if (!isObj(b) || !whole(b["xp"]) || !whole(b["level"]) || !whole(b["banked"]) || !(b["offer"] === null || (Array.isArray(b["offer"]) && b["offer"].every((a) => typeof a === "string"))) || !Array.isArray(b["abilities"]) || !b["abilities"].every((a) => typeof a === "string")) return no("invalidValue", false, "bar");
  const offer = b["offer"] === null ? null : b["offer"].filter((a): a is string => typeof a === "string"), abilities = b["abilities"].filter((a): a is string => typeof a === "string");
  return { side: v["side"], members, bar: { xp: b["xp"], level: b["level"], banked: b["banked"], offer, abilities } };
}
export function readSession(doc: unknown, want: { readonly projectId: string; readonly projectHash: string; readonly engineVersion: string }): SessionRead {
  if (!isObj(doc) || doc["kind"] !== "session-save" || !isInt(doc["formatVersion"])) return no("invalidValue", false);
  if (doc["formatVersion"] > SESSION_FORMAT) return no("saveFormatNewer", false);
  if (doc["formatVersion"] < SESSION_FORMAT) return no("saveFormatOlder", true);
  const header = doc["header"], hash = isObj(header) ? header["projectHash"] : undefined, engine = isObj(header) ? header["engineVersion"] : undefined, projectId = isObj(header) ? header["projectId"] : undefined, savedAt = isObj(header) ? header["savedAt"] : undefined;
  if (!isStr(hash) || !isStr(engine) || !isStr(projectId) || !isStr(savedAt) || !isStr(doc["from"]) || !isStr(doc["to"])) return no("invalidValue", false);
  if (projectId !== want.projectId) return no("invalidValue", false, "projectId");
  const party = readParty(doc["party"]); if ("ok" in party) return party;
  const notes: Notice[] = []; if (hash !== want.projectHash) notes.push(note("saveProjectMismatch", "saveProjectMismatch")); if (engine !== want.engineVersion) notes.push(note("saveEngineMismatch", "saveEngineMismatch"));
  return { ok: true, save: { kind: "session-save", formatVersion: 1, header: { projectHash: hash, engineVersion: engine, projectId, savedAt }, from: doc["from"], to: doc["to"], party }, notes };
}
export function settleSession(save: SessionSave, stageIds: readonly string[], unitIds: readonly string[], start: string): { readonly from: string | null; readonly to: string; readonly party: SessionParty; readonly notes: readonly Notice[] } {
  const notes: Notice[] = [], stages = new Set(stageIds), units = new Set(unitIds), members = save.party.members.filter((m) => units.has(m.unitId));
  if (!stages.has(save.to)) notes.push(note("saveRefDropped", save.to)); if (!stages.has(save.from)) notes.push(note("saveRefDropped", save.from));
  for (const m of save.party.members) if (!units.has(m.unitId)) notes.push(note("saveRefDropped", m.unitId));
  return { from: stages.has(save.from) ? save.from : null, to: stages.has(save.to) ? save.to : start, party: { side: save.party.side, members, bar: save.party.bar }, notes };
}
