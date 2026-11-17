import { SAVE,            } from "../../src/editor/effect/save.js";
                                                                                                                                                                 
                                                                                                                                                                                                                                                     
const miss = (e         )          => e instanceof Error && e.name === "NotFoundError";
const JSON_NAME = /^[^/]+\.json$/;
export function opfsStore(root     )                                                   {
  const dirOf = async (name        , create         )                                      => {
    const parts = name.split("/"), leaf = parts.pop() ?? ""; let dir = root;
    for (const p of parts) dir = await dir.getDirectoryHandle(p, create ? { create: true } : {});
    return { dir, leaf };
  };
  return {
    async read(name) { try { const { dir, leaf } = await dirOf(name, false); return await (await (await dir.getFileHandle(leaf)).getFile()).text(); } catch (e) { if (miss(e)) return null; throw e; } },
    async write(name, text) { const { dir, leaf } = await dirOf(name, true); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); await w.write(text); await w.close(); },
    async remove(name) { try { const { dir, leaf } = await dirOf(name, false); await dir.removeEntry(leaf); } catch (e) { if (!miss(e)) throw e; } },
    async list(name) { try { const { dir } = await dirOf(name.endsWith("/") ? name : `${name}/`, false); const names           = []; if (dir.keys !== undefined) for await (const k of dir.keys()) names.push(k); return names.sort(); } catch (e) { if (miss(e)) return []; throw e; } },
  };
}
export async function purgeTrash(store                                                       )                    {
  const names = (await store.list(SAVE.trash)).filter((n) => JSON_NAME.test(n)), gone           = [];
  for (const name of names) { try { await store.remove(`${SAVE.trash}${name}`); } catch { /* a failed remove is skipped */ } gone.push(name); }
  return gone;
}
