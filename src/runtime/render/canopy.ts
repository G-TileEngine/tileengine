import type { RenderScene } from "./types.ts";

export const SEE_THROUGH_DEFAULT = false;

export function createSeeThrough(): (scene: RenderScene, on?: boolean) => RenderScene {
  let scene: RenderScene | undefined, on: boolean | undefined, prev: RenderScene | undefined;
  return (next, flag) => {
    const enabled = flag ?? SEE_THROUGH_DEFAULT;
    if (prev !== undefined && scene === next && on === enabled) return prev;
    scene = next; on = enabled;
    if (!enabled) { prev = next; return next; }
    const cut = new Uint8Array(next.cols * next.rows);
    for (const st of next.standing) if (st.kind === "unit") for (const r of [st.r, st.r - 1]) if (st.c >= 0 && r >= 0 && st.c < next.cols && r < next.rows) cut[r * next.cols + st.c] = 1;
    let changed = false;
    const above = next.above.map((layer) => {
      const tiles = layer.tiles.slice();
      for (let i = 0; i < cut.length; i += 1) if (cut[i] === 1 && tiles[i] !== null && tiles[i] !== undefined) { tiles[i] = null; changed = true; }
      return changed && tiles.some((t, i) => t !== layer.tiles[i]) ? { ...layer, tiles } : layer;
    });
    prev = changed ? { ...next, above } : next;
    return prev;
  };
}
