import { SAVE, type Store } from "../../src/editor/effect/save.ts";
type FileHandle = { getFile(): Promise<{ text(): Promise<string> }>; createWritable(): Promise<{ write(text: string): Promise<void>; close(): Promise<void>; abort?(): Promise<void> }> };
export type Dir = { getDirectoryHandle(name: string, o?: { create?: boolean }): Promise<Dir>; getFileHandle(name: string, o?: { create?: boolean }): Promise<FileHandle>; removeEntry(name: string): Promise<void>; keys?(): AsyncIterable<string> };
const miss = (e: unknown): boolean => e instanceof Error && e.name === "NotFoundError";
const JSON_NAME = /^[^/]+\.json$/;
export function opfsStore(root: Dir): Store & { list(dir: string): Promise<string[]> } {
  const dirOf = async (name: string, create: boolean): Promise<{ dir: Dir; leaf: string }> => {
    const parts = name.split("/"), leaf = parts.pop() ?? ""; let dir = root;
    for (const p of parts) dir = await dir.getDirectoryHandle(p, create ? { create: true } : {});
    return { dir, leaf };
  };
  return {
    async read(name) { try { const { dir, leaf } = await dirOf(name, false); return await (await (await dir.getFileHandle(leaf)).getFile()).text(); } catch (e) { if (miss(e)) return null; throw e; } },
    async write(name, text) { const { dir, leaf } = await dirOf(name, true); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); await w.write(text); await w.close(); },
    async remove(name) { try { const { dir, leaf } = await dirOf(name, false); await dir.removeEntry(leaf); } catch (e) { if (!miss(e)) throw e; } },
    async list(name) { try { const { dir } = await dirOf(name.endsWith("/") ? name : `${name}/`, false); const names: string[] = []; if (dir.keys !== undefined) for await (const k of dir.keys()) names.push(k); return names.sort(); } catch (e) { if (miss(e)) return []; throw e; } },
  };
}
export async function purgeTrash(store: Pick<ReturnType<typeof opfsStore>, "list" | "remove">): Promise<string[]> {
  const names = (await store.list(SAVE.trash)).filter((n) => JSON_NAME.test(n)), gone: string[] = [];
  for (const name of names) { try { await store.remove(`${SAVE.trash}${name}`); } catch { /* a failed remove is skipped */ } gone.push(name); }
  return gone;
}
