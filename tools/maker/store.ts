import { opfsStore, type Dir } from "../effect-designer/store.ts";
export type MakerStore = { read(path: string): Promise<string | null>; write(path: string, text: string): Promise<void>; remove(path: string): Promise<void>; list(dir: string): Promise<string[]>; rename(from: string, to: string): Promise<void> };
export type WriteResult = { readonly ok: true } | { readonly ok: false; readonly error: "writeFailed"; readonly path: string; readonly message: string; readonly rows: readonly { readonly code: "writeFailed"; readonly severity: "hard"; readonly path: string; readonly detail: string }[] };
type Handle = { move?: (dir: Dir, name: string) => Promise<void> };
const failed = (path: string): WriteResult => { const message = `Couldn't save ${path}. Your phone may be full. Your last save is safe.`; return { ok: false, error: "writeFailed", path, message, rows: [{ code: "writeFailed", severity: "hard", path, detail: message }] }; };
export function memoryStore(): MakerStore & { readonly files: Map<string, string>; failOn(path: string): void } {
  const files = new Map<string, string>(); let fail = "";
  return { files, failOn(path) { fail = path; }, async read(path) { return files.has(path) ? files.get(path) ?? "" : null; }, async write(path, text) { if (fail !== "" && path === fail) throw new Error("full"); files.set(path, text); }, async remove(path) { files.delete(path); }, async rename(from, to) { if (fail !== "" && to === fail) throw new Error("full"); const text = files.get(from); if (text === undefined) throw new Error(`missing ${from}`); files.set(to, text); files.delete(from); }, async list(dir) { const pre = dir.endsWith("/") ? dir : `${dir}/`, names = new Set<string>(); for (const key of files.keys()) if (key.startsWith(pre)) { const rest = key.slice(pre.length), cut = rest.indexOf("/"); if (rest !== "") names.add(cut === -1 ? rest : rest.slice(0, cut)); } return [...names].sort(); } };
}
export function makerStore(root: Dir): MakerStore {
  const base = opfsStore(root);
  return { read: (path) => base.read(path), write: (path, text) => base.write(path, text), remove: (path) => base.remove(path), list: (dir) => base.list(dir), async rename(from, to) { const parts = from.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const handle = await dir.getFileHandle(leaf) as Handle, destParts = to.split("/"), destLeaf = destParts.pop() ?? ""; let dest = root; for (const part of destParts) dest = await dest.getDirectoryHandle(part, { create: true }); if (handle.move !== undefined) { await handle.move(dest, destLeaf); return; } const text = await base.read(from); if (text === null) throw new Error(`missing ${from}`); await base.write(to, text); await base.remove(from); } };
}
export async function readTree(store: MakerStore, folder: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {}, pre = folder.endsWith("/") ? folder : `${folder}/`;
  const walk = async (dir: string, rel: string): Promise<void> => { for (const name of await store.list(dir)) { const child = `${dir}${name}`, next = rel === "" ? name : `${rel}/${name}`; let text: string | null = null, dirChild = false; try { text = await store.read(child); } catch (e) { if (e instanceof Error && e.name === "TypeMismatchError") dirChild = true; else throw e; } if (dirChild || (text === null && (await store.list(`${child}/`)).length > 0)) await walk(`${child}/`, next); else if (text !== null) out[next] = text; else throw new Error(`missing ${child}`); } };
  await walk(pre, ""); return out;
}
export async function commitWrites(store: MakerStore, folder: string, writes: readonly { readonly path: string; readonly text: string }[]): Promise<WriteResult> {
  if (writes.length === 0) return { ok: true };
  const pre = folder.endsWith("/") ? folder : `${folder}/`, tmps: string[] = [];
  for (const write of writes) { const tmp = `${pre}${write.path}.tmp`; try { await store.write(tmp, write.text); tmps.push(tmp); } catch (e) { const pending: string[] = []; for (const tmpPath of tmps) { try { await store.remove(tmpPath); } catch (c) { pending.push(`${tmpPath}: ${c instanceof Error ? c.message : "remove failed"}`); } } if (pending.length > 0) throw new Error(`${e instanceof Error ? e.message : "write failed"}; cleanup ${pending.join("; ")}`); return failed(write.path); } }
  for (const write of writes) { try { await store.rename(`${pre}${write.path}.tmp`, `${pre}${write.path}`); } catch { return failed(write.path); } }
  return { ok: true };
}
export async function movePrefix(store: MakerStore, from: string, to: string): Promise<void> {
  const files = await readTree(store, from), src = from.endsWith("/") ? from : `${from}/`, dest = to.endsWith("/") ? to : `${to}/`, wrote: string[] = [];
  for (const [rel, text] of Object.entries(files)) { try { await store.write(`${dest}${rel}`, text); wrote.push(rel); } catch (e) { for (const relDone of wrote) await store.remove(`${dest}${relDone}`); throw e; } }
  for (const rel of Object.keys(files)) await store.remove(`${src}${rel}`);
  const drop = async (dir: string): Promise<void> => { const pre = dir.endsWith("/") ? dir : `${dir}/`; for (const name of await store.list(pre)) await drop(`${pre}${name}`); await store.remove(pre.slice(0, -1)); };
  await drop(src);
}
