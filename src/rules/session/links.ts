import type { CoreLink, LinkType, Sq } from "../../types/core-types.ts";
export const LINK_TYPES = ["stairs", "door", "gate"] as const satisfies readonly LinkType[];
export type LinkEvent = { readonly type: "link"; readonly linkType: LinkType; readonly from: string; readonly to: string; readonly at: Sq };
export function linkAt(links: readonly CoreLink[], at: Sq): CoreLink | null {
  return links.find((link) => link.at.c === at.c && link.at.r === at.r) ?? null;
}
/** `back` is the target's first link in array order whose `to` is the source stage. */
export function arrival(targetLinks: readonly CoreLink[], fromStageId: string, spawns: readonly Sq[]): readonly Sq[] {
  const back = targetLinks.find((link) => link.to === fromStageId);
  return back === undefined ? spawns : [back.at, ...spawns.filter((sq) => sq.c !== back.at.c || sq.r !== back.at.r)];
}
export function linkEvent(link: CoreLink, from: string): LinkEvent {
  return { type: "link", linkType: link.type, from, to: link.to, at: link.at };
}
