import type { CoreLink, LinkType, Sq } from "../../types/core-types.ts";
export const LINK_TYPES = ["stairs", "door", "gate"] as const satisfies readonly LinkType[];
export type LinkEvent = { readonly type: "link"; readonly linkType: LinkType; readonly from: string; readonly to: string; readonly at: Sq; readonly autosave: boolean };
export function linkAt(links: readonly CoreLink[], at: Sq): CoreLink | null {
  return links.find((link) => link.at.c === at.c && link.at.r === at.r) ?? null;
}
/** `back` is the target's first link in array order whose `to` is the source stage. */
const key = (sq: Sq): string => `${sq.c},${sq.r}`;
export function arrival(targetLinks: readonly CoreLink[], fromStageId: string, spawns: readonly Sq[], size = 0, free: (sq: Sq) => boolean = () => true): readonly Sq[] {
  const back = targetLinks.find((link) => link.to === fromStageId);
  const base = back === undefined ? [...spawns] : [back.at, ...spawns.filter((sq) => sq.c !== back.at.c || sq.r !== back.at.r)];
  const got = base.filter((sq) => free(sq)); if (size < 1 || got.length >= size) return size < 1 ? got : got.slice(0, size);
  const origin = base[0]; if (origin === undefined) return got;
  const seen = new Set(got.map(key)), been = new Set<string>([key(origin)]), q: Sq[] = [origin];
  while (q.length > 0 && got.length < size) { const cur = q.shift(); if (cur === undefined) break; for (const [dc, dr] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) { const n = { c: cur.c + dc, r: cur.r + dr }, id = key(n); if (been.has(id) || Math.abs(n.c - origin.c) + Math.abs(n.r - origin.r) > 512 || !free(n)) continue; been.add(id); q.push(n); if (!seen.has(id)) { seen.add(id); got.push(n); if (got.length >= size) break; } } }
  return got;
}
export function autosaves(link: CoreLink, contest: boolean): boolean { return link.autosave === true && !contest; }
export function linkEvent(link: CoreLink, from: string, contest = false): LinkEvent { return { type: "link", linkType: link.type, from, to: link.to, at: link.at, autosave: autosaves(link, contest) }; }
